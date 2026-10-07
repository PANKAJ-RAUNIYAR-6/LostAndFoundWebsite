import dbService from '../services/dbService.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await dbService.findNotifications(req.user._id);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const updated = await dbService.markNotificationRead(req.params.id);
    res.json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await dbService.markAllNotificationsRead(req.user._id);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};
