import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';

const AppContext = createContext();

const DEFAULT_SETTINGS = {
  brokerUrl: 'wss://fc67e364fad54bc38e2e62d77e7751d1.s1.eu.hivemq.cloud:8884/mqtt',
  username: 'rahull',
  password: 'Rahul@123',
  roomName: 'Master Suite',
  deviceNames: {
    light1: 'Light 1',
    light2: 'Light 2',
    light3: 'Light 3',
    light4: 'Light 4',
    light5: 'Light 5',
    light6: 'Light 6',
    fan: 'Ceiling Fan'
  },
  sensorSettings: {
    motionDelay: 3,
    soundSensitivity: 'Medium'
  }
};

const readStoredObject = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return fallback;
    }

    const merged = { ...fallback, ...parsed };
    if (merged.brokerUrl && (merged.brokerUrl.includes(':8883') || !merged.brokerUrl.startsWith('wss://'))) {
      merged.brokerUrl = 'wss://fc67e364fad54bc38e2e62d77e7751d1.s1.eu.hivemq.cloud:8884/mqtt';
    }
    return merged;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return fallback;
  }
};

const readStoredArray = (key, fallback = []) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return fallback;
  }
};

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // App settings
  const [settings, setSettings] = useState(() => readStoredObject('smart_room_settings', DEFAULT_SETTINGS));

  // Automation Rules
  const [automationRules, setAutomationRules] = useState(() => readStoredArray('smart_room_rules'));

  // Timeline Events (Map timestamps safely on load)
  const [events, setEvents] = useState(() => {
    const rawEvents = eventService.getEvents();
    return rawEvents.map(e => ({ ...e, timestamp: new Date(e.timestamp) }));
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('smart_room_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('smart_room_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('smart_room_rules', JSON.stringify(automationRules));
  }, [automationRules]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addRule = (rule) => {
    setAutomationRules(prev => [...prev, { ...rule, id: Date.now().toString() }]);
  };

  const deleteRule = (id) => {
    setAutomationRules(prev => prev.filter(r => r.id !== id));
  };

  const toggleRule = (id) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const logEvent = useCallback((eventDesc, type = 'info') => {
    setEvents(prev => {
      const now = new Date();
      if (prev.length > 0 && prev[0].description === eventDesc) {
        // Group consecutive
        const newFirst = { ...prev[0], count: (prev[0].count || 1) + 1, timestamp: now };
        return [newFirst, ...prev.slice(1)];
      }
      return [{ id: now.getTime(), description: eventDesc, type, timestamp: now, count: 1 }, ...prev].slice(0, 100);
    });
  }, []);

  const clearEvents = useCallback(() => {
    eventService.clearEvents();
    setEvents([]);
  }, []);

  const value = {
    settings,
    updateSettings,
    automationRules,
    addRule,
    deleteRule,
    toggleRule,
    events,
    logEvent,
    clearEvents
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
