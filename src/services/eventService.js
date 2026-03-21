const EVENTS_KEY = 'smart_room_events';

export const eventService = {
  getEvents: () => {
    try {
      const data = localStorage.getItem(EVENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading events from storage', error);
      return [];
    }
  },

  addEvent: (event) => {
    try {
      const events = eventService.getEvents();
      const newEvent = {
        ...event,
        id: Date.now().toString() + Math.random().toString(16).substr(2, 4),
        timestamp: new Date().toISOString()
      };
      
      // Keep only last 200 events to prevent localStorage overflow
      const updatedEvents = [newEvent, ...events].slice(0, 200);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
      return newEvent;
    } catch (error) {
      console.error('Error saving event to storage', error);
      return null;
    }
  },

  clearEvents: () => {
    localStorage.removeItem(EVENTS_KEY);
  }
};
