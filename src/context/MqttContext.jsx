import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import mqttService from '../services/mqttService';
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

  // Unified message handler for global logic (Timeline + Automation)
  const handleGlobalMessage = useCallback((topic, payload) => {
    // 1. Log to timeline
    const sensorName = topic.split('/').pop();
    if (sensorName === 'motion' && (payload === 'ON' || payload === 1 || payload?.value === 1)) {
      logEvent('Motion detected!', 'alert');
    } else if (sensorName === 'temp') {
      // Optional: log high temp
    }

    // 2. Evaluate Automation Rules
    const activeRules = automationRules.filter(r => r.enabled);
    activeRules.forEach(rule => {
      let conditionMet = false;
      if (rule.conditionSensor === sensorName) {
        if (sensorName === 'motion' && rule.conditionState === 'detected' && (payload === 'ON' || payload === 1 || payload?.value === 1)) conditionMet = true;
        if (sensorName === 'temp' && payload > rule.conditionValue) conditionMet = true;
      }

      if (conditionMet) {
        logEvent(`Automation: ${rule.conditionSensor} -> ${rule.actionDevice} ${rule.actionState}`, 'automation');
        const actionTopic = `room/${rule.actionDevice}`;
        mqttService.publishMessage(actionTopic, rule.actionState.toUpperCase());
      }
    });
  }, [automationRules, logEvent]);

  useEffect(() => {
    // Connect using AppContext settings
    if (!settings.brokerUrl) return;

    console.log("MqttProvider: Connecting with settings...", settings.brokerUrl);
    mqttService.connectMQTT(
      settings.brokerUrl, 
      settings.username, 
      settings.password, 
      (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'connected') logEvent('MQTT Connected', 'success');
      }
    );

    // Global listeners for timeline/automation — use subscribeTopic so they
    // benefit from dedup, queuing, and resubscription on reconnect.
    const globalTopics = ['room/motion', 'room/temp', 'room/light'];
    const globalHandlers = globalTopics.map(t => {
      const handler = (data) => handleGlobalMessage(t, data);
      mqttService.subscribeTopic(t, handler);
      return { topic: t, handler };
    });

    return () => {
      globalHandlers.forEach(({ topic, handler }) =>
        mqttService.unsubscribeTopic(topic, handler)
      );
      mqttService.disconnect();
    };
  }, [settings.brokerUrl, settings.username, settings.password, logEvent, handleGlobalMessage]);

  const publishMessage = (topic, message) => {
    mqttService.publishMessage(topic, message);
  };

  const subscribeTopic = (topic, callback) => {
    mqttService.subscribeTopic(topic, callback);
    return () => mqttService.unsubscribeTopic(topic, callback);
  };

  const value = {
    status,
    publishMessage,
    subscribeTopic
  };

  return (
    <MqttContext.Provider value={value}>
      {children}
    </MqttContext.Provider>
  );
};
