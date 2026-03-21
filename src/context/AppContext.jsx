import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';

const AppContext = createContext();

const DEFAULT_SETTINGS = {
  brokerUrl: 'ws://localhost:9001',
  username: '',
  password: '',
  roomName: 'room1',
  soundThreshold: 70,
  tempThreshold: 30,
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

    return { ...fallback, ...parsed };
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

  // Timeline Events
  const [events, setEvents] = useState(() => eventService.getEvents());

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('smart_room_settings', JSON.stringify(settings));
  }, [settings]);

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
    const newEvent = eventService.addEvent({ description: eventDesc, type });
    if (newEvent) {
      setEvents(prev => [newEvent, ...prev].slice(0, 200));
    }
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
