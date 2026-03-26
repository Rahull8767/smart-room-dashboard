/**
 * httpService.js
 * Handles direct HTTP requests to the ESP32 in Offline Mode (Hotspot).
 */

const ESP_IP = 'http://192.168.4.1';

class HttpService {
  async sendCommand(command) {
    try {
      if (command === 'room/light' || command.includes('light')) {
        // Just map generic publish 'ON' / 'OFF' if they come in
        return false;
      }
      
      const res = await fetch(`${ESP_IP}/${command.replace(/^\//, '')}`, { method: 'GET' });
      if (!res.ok) throw new Error('Network response was not ok');
      const text = await res.text();
      return text;
    } catch (err) {
      console.error('HTTP Command Error:', err);
      return null;
    }
  }

  async getStatus() {
    try {
      const res = await fetch(`${ESP_IP}/status`, { method: 'GET' });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json; // Expecting { light: boolean, manualLock: boolean, mode: string }
    } catch (err) {
      // Return null to signify timeout/error
      return null;
    }
  }

  // Wrappers
  async turnOn() { return this.sendCommand('on'); }
  async turnOff() { return this.sendCommand('off'); }
  async toggle() { return this.sendCommand('toggle'); }
  async setAuto() { return this.sendCommand('auto'); }
}

export default new HttpService();
