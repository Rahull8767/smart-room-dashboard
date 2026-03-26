import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Snackbar, Alert } from '@mui/material';
import mqtt from 'mqtt';
import httpService from '../services/httpService';
import { useAppContext } from './AppContext';

const MqttContext = createContext();

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider');
  }
  return context;
};

export const MqttProvider = ({ children }) => {
  const { settings, logEvent, automationRules } = useAppContext();
  const [status, setStatus] = useState('disconnected');
  const [offlineMode, setOfflineMode] = useState(false);
  
  const mqttClient = useRef(null);
  
  // Hardware States
  const [lights, setLights] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });
  const [fanSpeed, setFanSpeed] = useState('OFF');
  const [activeMood, setActiveMood] = useState(null);
  const [motionAlert, setMotionAlert] = useState(false);
  const [motionStatus, setMotionStatus] = useState('Clear');

  // Analytics States
  const [motionLog, setMotionLog] = useState(() => {
    try {
      const saved = localStorage.getItem('motionLog');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [usageSeconds, setUsageSeconds] = useState(() => {
    const saved = localStorage.getItem('usageSeconds');
    const date = localStorage.getItem('usageDate');
    const today = new Date().toDateString();
    if (date !== today) {
      localStorage.setItem('usageDate', today);
      return 0;
    }
    return saved ? parseInt(saved, 10) : 0;
  });

  const triggerLocalEvent = useCallback((topic, payload) => {
    // Keep placeholder for backward compat
  }, []);

  const triggerMotionNotification = useCallback(() => {
    setMotionAlert(true);
    
    // Browser push notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("⚠️ Motion Detected in Room1");
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") new Notification("⚠️ Motion Detected in Room1");
      });
    }

    // Sound alert
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const osc = context.createOscillator();
      const gainNode = context.createGain();
      osc.connect(gainNode);
      gainNode.connect(context.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, context.currentTime);
      gainNode.gain.setValueAtTime(0.1, context.currentTime); 
      osc.start();
      osc.stop(context.currentTime + 0.2);
    } catch (e) { console.error("Audio beep failed", e); }
  }, []);

  const handleGlobalMessage = useCallback((topic, payload) => {
    if (topic === 'room/status' && payload === 'came_online') {
      setOfflineMode(false);
      logEvent('ESP32 came online. Switched to Online Mode.', 'success');
    }

    const isDetect = payload === 'ON' || payload === 'Detected' || payload === 1 || payload?.value === 1 || payload?.state === 'detected';

    // Handle Lights 1-6
    if (topic.startsWith('room/light')) {
      setActiveMood(null); // Manual override clears mood
      if (topic === 'room/light') {
        setLights(prev => ({ ...prev, 1: isDetect }));
      } else {
        const lightId = parseInt(topic.replace('room/light', ''), 10);
        if (lightId >= 2 && lightId <= 6) {
          setLights(prev => ({ ...prev, [lightId]: isDetect }));
        }
      }
    }
    // Handle Fan
    else if (topic === 'room/fan') {
      setActiveMood(null); // Manual override clears mood
      setFanSpeed(payload);
    }
    // Handle Mood
    else if (topic === 'room/mood') {
      setActiveMood(payload);
    }
    // Handle Motion
    else if (topic === 'room/motion' && isDetect) {
      logEvent('Motion detected!', 'alert');
      triggerMotionNotification();
      setMotionStatus('Detected');
      setTimeout(() => setMotionStatus('Clear'), 5000);

      setMotionLog(prev => {
        const newLog = [
          { timestamp: new Date().getTime(), text: 'Motion at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...prev
        ].slice(0, 5);
        localStorage.setItem('motionLog', JSON.stringify(newLog));
        return newLog;
      });
    }

    // Automation Engine
    const activeRules = automationRules.filter(r => r.enabled);
    activeRules.forEach(rule => {
      let conditionMet = false;
      const sensorName = topic.split('/').pop();
      if (rule.conditionSensor === sensorName) {
        if (sensorName === 'motion' && rule.conditionState === 'detected' && isDetect) conditionMet = true;
        if (sensorName === 'temp' && payload > rule.conditionValue) conditionMet = true;
      }
      if (conditionMet) {
        const actionTopic = `room/${rule.actionDevice}`;
        if (mqttClient.current && mqttClient.current.connected) {
           mqttClient.current.publish(actionTopic, rule.actionState.toUpperCase());
        }
      }
    });
  }, [automationRules, logEvent, triggerMotionNotification]);

  // Core Connection Loop
  useEffect(() => {
    if (mqttClient.current) return;

    mqttClient.current = mqtt.connect("wss://fc67e364fad54bc38e2e62d77e7751d1.s1.eu.hivemq.cloud:8884/mqtt", {
      username: "rahull",
      password: "Rahul@123",
      reconnectPeriod: 5000,
      keepalive: 60,
      clean: true
    });

    mqttClient.current.on('connect', () => {
      setStatus('connected');
      console.log('MQTT Connected');
      logEvent('MQTT Connected', 'success');
      
      const topics = [
        'room/light', 'room/light1', 'room/light2', 'room/light3', 'room/light4', 'room/light5', 'room/light6',
        'room/fan', 'room/motion', 'room/sound', 'room/status', 'room/mood', 'room/temp', 'room/humidity', 'room/door'
      ];
      topics.forEach(t => mqttClient.current.subscribe(t));
    });

    mqttClient.current.on('close', () => {
      setStatus('disconnected');
      console.log("MQTT disconnected, retrying...");
    });

    mqttClient.current.on('message', (topic, message) => {
      const msg = message.toString();
      
      if (topic === 'room/light') {
         if (msg === 'ON') setLights(prev => ({ ...prev, 1: true }));
         if (msg === 'OFF') setLights(prev => ({ ...prev, 1: false }));
      }
      
      handleGlobalMessage(topic, msg);
    });

    return () => {
      if (mqttClient.current) {
         mqttClient.current.end();
         mqttClient.current = null;
      }
    };
  }, []);

  // Usage Timer (If ANY light is ON)
  useEffect(() => {
    let interval;
    const isAnyLightOn = Object.values(lights).some(v => v === true);
    if (isAnyLightOn) {
      interval = setInterval(() => {
        setUsageSeconds(s => {
          const next = s + 1;
          if (next % 5 === 0) localStorage.setItem('usageSeconds', next.toString());
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lights]);

  // Master Publish
  const publishMessage = async (topic, message) => {
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);

    // Optimistic Update
    if (topic.startsWith('room/light')) {
      if (topic === 'room/light') {
        setLights(prev => ({ ...prev, 1: message === 'ON' ? true : message === 'OFF' ? false : !prev[1] }));
      } else {
        const lightId = parseInt(topic.replace('room/light', ''), 10);
        if (lightId >= 2 && lightId <= 6) {
          setLights(prev => ({ ...prev, [lightId]: message === 'ON' ? true : message === 'OFF' ? false : !prev[lightId] }));
        }
      }
    } else if (topic === 'room/fan') {
      setFanSpeed(message);
    } else if (topic === 'room/mood') {
      setActiveMood(message);
    }

    if (offlineMode) {
      if (topic === 'room/light1') {
        if (message === 'ON') { await httpService.turnOn(); triggerLocalEvent(topic, 'ON'); }
        else if (message === 'OFF') { await httpService.turnOff(); triggerLocalEvent(topic, 'OFF'); }
        else if (message === 'TOGGLE') { await httpService.toggle(); triggerLocalEvent(topic, lights[1] ? 'OFF' : 'ON'); }
      }
      return;
    }
    
    if (mqttClient.current && mqttClient.current.connected) {
       mqttClient.current.publish(topic, message);
    } else {
       console.log('Cannot publish, MQTT client disconnected');
    }
  };

  // Mood Dispatch Engine
  const setMood = (moodName) => {
    setActiveMood(moodName);
    const publishAll = (lightStates, fanValue) => {
      publishMessage('room/light', lightStates[1] ? 'ON' : 'OFF');
      [2, 3, 4, 5, 6].forEach(i => {
        publishMessage(`room/light${i}`, lightStates[i] ? 'ON' : 'OFF');
      });
      publishMessage('room/fan', fanValue);
      publishMessage('room/mood', moodName);
    };

    switch (moodName) {
      case 'Morning': publishAll({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true }, 'MEDIUM'); break;
      case 'Study': publishAll({ 1: true, 2: true, 3: false, 4: false, 5: false, 6: false }, 'MEDIUM'); break;
      case 'Night': publishAll({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: true }, 'LOW'); break;
      case 'Movie': publishAll({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }, 'LOW'); break;
      case 'Sleep': publishAll({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }, 'LOW'); break;
      case 'Away': publishAll({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }, 'OFF'); break;
      default: break;
    }
  };

  const subscribeTopic = (topic, callback) => {
    // Legacy support for local components (Dashboard)
    const handler = (receivedTopic, message) => {
       if (receivedTopic === topic) callback(message.toString());
    };
    if (mqttClient.current) mqttClient.current.on('message', handler);
    return () => {
       if (mqttClient.current) mqttClient.current.removeListener('message', handler);
    };
  };

  const value = {
    status, offlineMode, setOfflineMode,
    publishMessage, subscribeTopic,
    usageSeconds, motionLog,
    lights, fanSpeed, activeMood, setMood,
    motionStatus, setMotionStatus,
    mqttClient
  };

  return (
    <MqttContext.Provider value={value}>
      {children}
      <Snackbar open={motionAlert} autoHideDuration={4000} onClose={() => setMotionAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setMotionAlert(false)} severity="warning" sx={{ backgroundColor: '#1c1f26', border: '1px solid #f59e0b', color: '#f59e0b', '& .MuiAlert-icon': { color: '#f59e0b' } }}>
          Motion Detected!
        </Alert>
      </Snackbar>
    </MqttContext.Provider>
  );
};
