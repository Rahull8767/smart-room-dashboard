# Smart Room Automation Dashboard

A modern React-based Progressive Web Application (PWA) for managing an ESP32-powered Smart Room via MQTT over WebSockets.

## Features
- **Real-Time Dashboard**: View live data from motion, sound, door, temperature, and humidity sensors.
- **Control Panel**: Switch lights and ceiling fans on/off instantly.
- **Automation Rules**: Create custom `IF [Condition] THEN [Action]` rules directly in the browser.
- **Historical Timeline**: View a chronological timeline of all events and sensor triggers.
- **Real-Time Trends**: Visualize sound, temperature, and humidity over time using Chart.js.
- **PWA Ready**: Installable on Desktop, iOS, and Android to function like a native app.

---

## 🚀 Running the Project

### Prerequisites
1. **Node.js**: Ensure Node.js (v18+) is installed.
2. **MQTT Broker with WebSockets**: 
   - You need a local or cloud MQTT broker configured to accept WebSocket connections.
   - For a local Mosquitto setup, edit `mosquitto.conf` to include:
     ```conf
     listener 1883
     protocol mqtt

     listener 9001
     protocol websockets
     ```

### Installation
1. Navigate to the project folder:
   ```bash
   cd "smart-room-dashboard"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.
5. Go to the **Settings** page in the app and set your broker URL (e.g., `ws://localhost:9001`).

---

## 🔌 Connecting ESP32 Devices

When programming your ESP32, use a library like `PubSubClient`. Ensure the ESP32 connects to the standard MQTT port (e.g., `1883`), while this web app connects to the WebSocket port (e.g., `9001`) of the **same** broker.

### Topics Setup
The default base topic is `home/room1/`.
- **Sensors (ESP32 Publishes, App Subscribes):**
  - `home/room1/motion`
  - `home/room1/sound`
  - `home/room1/door`
  - `home/room1/temperature`
  - `home/room1/humidity`
  - `home/room1/device_status`
- **Actuators (App Publishes, ESP32 Subscribes):**
  - `home/room1/light`
  - `home/room1/fan`

---

## 🧪 Testing with Mock MQTT Messages

You can use a tool like `mqtt-cli` or `MQTTX` to publish mock messages to test the dashboard. 

**Wait for the web dashboard to connect**, then publish the following JSON payloads:

### 1. Device Online Status
Topic: `home/room1/device_status`
```json
{ "online": true }
```

### 2. Motion Detected
Topic: `home/room1/motion`
```json
{ "value": 1 }
```

### 3. Temperature & Humidity Update
Topic: `home/room1/temperature`
```json
{ "value": 24.5 }
```
Topic: `home/room1/humidity`
```json
{ "value": 45 }
```

### 4. High Sound Level Alert
Topic: `home/room1/sound`
```json
{ "db": 85 }
```

### 5. Door Opened
Topic: `home/room1/door`
```json
{ "state": "open" }
```

---

## 📱 PWA Deployment

To deploy this app as a production PWA:
1. Build the project:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder using any static web server (NGINX, Vercel, Firebase Hosting, GitHub Pages). Wait until the site is served over HTTPS (required for PWA installs).
3. Open the deployed URL on your phone or desktop, and select **Add to Home Screen**.
