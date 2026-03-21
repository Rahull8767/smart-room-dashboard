import mqtt from 'mqtt';

class MqttService {
  constructor() {
    this.client = null;
    this.callbacks = {};
    this.connectionCallback = null;
    this.status = 'disconnected'; // disconnected, connecting, connected, error
    this.isConnecting = false;
  }

  connectMQTT(brokerUrl = 'wss://fc67e364fad54bc38e2e62d77e7751d1.s1.eu.hivemq.cloud:8884/mqtt', username = 'rahull', password = 'Rahul@123', onConnectStatusChange = null) {
    if (this.client && this.client.connected) {
      console.log('MQTT is already connected.');
      return;
    }

    if (this.isConnecting) {
      console.log('MQTT connection is already in progress.');
      return;
    }

    if (onConnectStatusChange) {
      this.connectionCallback = onConnectStatusChange;
    }
    
    this.updateStatus('connecting');
    this.isConnecting = true;

    try {
      const options = {
        clientId: `smart-room-web-${Math.random().toString(16).substring(2, 10)}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 2000,
        username: username,
        password: password,
        protocolVersion: 4
      };

      console.log(`Connecting to MQTT broker at ${brokerUrl}`);
      this.client = mqtt.connect(brokerUrl, options);

      this.client.on('connect', () => {
        console.log('MQTT Connected');
        this.updateStatus('connected');
        this.isConnecting = false;
        this.resubscribeAll();
      });

      this.client.on('error', (err) => {
        console.error('MQTT Connection Error:', err);
        this.updateStatus('error');
        this.isConnecting = false;
      });

      this.client.on('reconnect', () => {
        console.log('Reconnecting to MQTT Broker...');
        this.updateStatus('connecting');
      });

      this.client.on('close', () => {
        console.log('MQTT connection closed.');
        this.updateStatus('disconnected');
        this.isConnecting = false;
      });

      this.client.on('offline', () => {
        console.log('MQTT client is offline.');
        this.updateStatus('disconnected');
      });

      this.client.on('message', (topic, message) => {
        const payloadString = message.toString();
        console.log(`Message received: ${topic} - ${payloadString}`);
        
        let parsedPayload = payloadString;
        try {
          parsedPayload = JSON.parse(payloadString);
        } catch (e) {
          // If not JSON, use the string directly
        }

        if (this.callbacks[topic]) {
          this.callbacks[topic].forEach(cb => cb(parsedPayload));
        }
      });
    } catch (error) {
      console.error('MQTT Setup Error:', error);
      this.updateStatus('error');
      this.isConnecting = false;
    }
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    if (this.connectionCallback) {
      this.connectionCallback(this.status);
    }
  }

  resubscribeAll() {
    if (this.client && this.client.connected) {
      const topics = Object.keys(this.callbacks);
      if (topics.length > 0) {
        topics.forEach(topic => {
          this.client.subscribe(topic, { qos: 0 }, (err) => {
            if (err) console.error(`Failed to resubscribe to ${topic}`, err);
          });
        });
        console.log(`Resubscribed to topics: ${topics.join(', ')}`);
      }
    }
  }

  subscribeTopic(topic, callback) {
    if (!this.callbacks[topic]) {
      this.callbacks[topic] = [];
    }
    
    // Prevent duplicate listeners
    if (!this.callbacks[topic].includes(callback)) {
      this.callbacks[topic].push(callback);
    }

    if (this.client && this.client.connected) {
      this.client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`Subscription error for topic ${topic}:`, err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    } else {
      console.log(`MQTT not yet connected — callback for '${topic}' queued. Will activate on connect.`);
    }
  }

  unsubscribeTopic(topic, callback) {
    if (this.callbacks[topic]) {
      this.callbacks[topic] = this.callbacks[topic].filter(cb => cb !== callback);
      if (this.callbacks[topic].length === 0) {
        delete this.callbacks[topic];
        if (this.client && this.client.connected) {
          this.client.unsubscribe(topic, (err) => {
             if (err) {
               console.error(`Unsubscribe error for topic ${topic}`, err);
             } else {
               console.log(`Unsubscribed from topic: ${topic}`);
             }
          });
        }
      }
    }
  }

  publishMessage(topic, messageObj) {
    if (this.client && this.client.connected) {
      const payload = typeof messageObj === 'string' ? messageObj : JSON.stringify(messageObj);
      console.log(`Publishing: ${topic} - ${payload}`);
      this.client.publish(topic, payload, { qos: 0, retain: false }, (err) => {
        if (err) {
           console.error(`Publish error for topic ${topic}`, err);
        }
      });
    } else {
      console.error('Cannot publish, MQTT client disconnected');
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.updateStatus('disconnected');
      this.isConnecting = false;
      console.log('MQTT manually disconnected.');
    }
  }
}

const mqttService = new MqttService();
export default mqttService;
