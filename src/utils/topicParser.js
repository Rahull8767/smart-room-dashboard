export const parseTopic = (topic) => {
  // Format: home/room1/{sensor}
  const parts = topic.split('/');
  if (parts.length >= 3 && parts[0] === 'home') {
    return {
      room: parts[1],
      sensor: parts.slice(2).join('/')
    };
  }
  return { room: 'unknown', sensor: 'unknown' };
};

export const parseMessage = (payloadString) => {
  try {
    return JSON.parse(payloadString);
  } catch (error) {
    console.error('Failed to parse MQTT message:', error);
    return { error: 'Invalid JSON' };
  }
};
