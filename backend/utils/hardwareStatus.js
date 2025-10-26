const { db } = require('../config/firebase');

/**
 * Check if ESP32 hardware is online
 * ESP32 sends heartbeat every 5 seconds
 * If no heartbeat in last 15 seconds, consider offline
 */
const isESP32Online = async () => {
  if (!db) {
    return false;
  }

  try {
    const statusRef = db.ref('hardware_status');
    const snapshot = await statusRef.once('value');
    const status = snapshot.val();

    if (!status) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const lastHeartbeat = status.last_heartbeat || 0;
    const timeSinceHeartbeat = now - lastHeartbeat;

    // Consider online if heartbeat within last 10 seconds (ESP32 sends every 5s)
    const isOnline = status.esp32_online === 'true' && timeSinceHeartbeat < 10;

    console.log('Hardware Status Check:');
    console.log('  Current time:', now);
    console.log('  Last heartbeat:', lastHeartbeat);
    console.log('  Time since heartbeat:', timeSinceHeartbeat, 'seconds');
    console.log('  ESP32 online flag:', status.esp32_online);
    console.log('  Is Online:', isOnline);

    return isOnline;
  } catch (error) {
    console.error('Error checking ESP32 status:', error);
    return false;
  }
};

/**
 * Get hardware status details
 */
const getHardwareStatus = async () => {
  if (!db) {
    return {
      online: false,
      message: 'Firebase not initialized'
    };
  }

  try {
    const statusRef = db.ref('hardware_status');
    const snapshot = await statusRef.once('value');
    const status = snapshot.val();

    if (!status) {
      return {
        online: false,
        message: 'Hardware not connected',
        lastHeartbeat: null
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const lastHeartbeat = status.last_heartbeat || 0;
    const timeSinceHeartbeat = now - lastHeartbeat;
    const isOnline = status.esp32_online === 'true' && timeSinceHeartbeat < 10;

    return {
      online: isOnline,
      message: isOnline ? 'Hardware connected' : 'Hardware offline',
      lastHeartbeat: lastHeartbeat,
      timeSinceHeartbeat: timeSinceHeartbeat,
      status: status.status || 'unknown'
    };
  } catch (error) {
    console.error('Error getting hardware status:', error);
    return {
      online: false,
      message: 'Error checking hardware status',
      error: error.message
    };
  }
};

module.exports = {
  isESP32Online,
  getHardwareStatus
};
