const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const Client = require('./models/Client');

// Pushes a notification to the user's embedded array AND saves an admin-level notification to MongoDB.
// Emits real-time socket events so both user and admin panels update instantly.
const createPushNotification = (io, clients, saveData) => {
  return async (notifType, message, client, extra = {}) => {
    const notifId = 'N' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100);
    const notifDate = new Date();

    // 1. Push into the client's embedded notifications array
    if (client) {
      if (!client.notifications) client.notifications = [];
      client.notifications.push({
        id: notifId,
        message,
        date: notifDate,
        read: false,
        type: notifType.includes('reject') ? 'alert' : notifType.includes('close') ? 'info' : 'success'
      });
      saveData();
      if (mongoose.connection.readyState === 1) {
        Client.updateOne({ id: client.id }, { $set: { notifications: client.notifications } }).catch(err => console.warn('Notification DB sync failed:', err.message));
      }
    }

    // 2. Save admin-level notification to MongoDB
    const adminNotif = {
      id: notifId,
      clientId: client?.id || extra.clientId || null,
      clientName: client?.name || extra.clientName || 'Unknown',
      type: notifType,
      message,
      target: 'both',
      read: false,
      date: notifDate
    };

    if (mongoose.connection.readyState === 1) {
      Notification.create(adminNotif).catch(err => console.warn('Admin notification save failed:', err.message));
    }

    // 3. Emit real-time socket events
    io.emit('notification:new', adminNotif);
    io.emit('client_update', clients);
  };
};

module.exports = { createPushNotification };
