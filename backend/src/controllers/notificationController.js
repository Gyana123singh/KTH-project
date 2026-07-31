const Notification = require('../models/Notification');
const { emitProfileEvent } = require('../config/socket');

// @desc    Get authenticated user's notifications and unread count
// @route   GET /api/notifications
// @access  Private (Authenticated)
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    return res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('[Notification Controller Get Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private (Authenticated)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, userId: req.user._id });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    return res.json({
      success: true,
      message: 'Notification marked as read',
      unreadCount,
      notification,
    });
  } catch (error) {
    console.error('[Notification Controller Mark Read Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private (Authenticated)
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0,
    });
  } catch (error) {
    console.error('[Notification Controller Mark All Read Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark all as read', error: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private (Authenticated)
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.deleteOne({ _id: id, userId: req.user._id });

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    return res.json({
      success: true,
      message: 'Notification deleted',
      unreadCount,
    });
  } catch (error) {
    console.error('[Notification Controller Delete Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
};

// Helper: Create notification in DB and emit real-time Socket.IO alert
const sendNotification = async ({ userId, userPublicId, title, message, type = 'system', link = '', icon = 'bell' }) => {
  try {
    const notification = await Notification.create({
      userId,
      userPublicId,
      title,
      message,
      type,
      link,
      icon,
    });

    // Emit real-time Socket.IO notification event to user's profile room
    if (userPublicId) {
      emitProfileEvent(userPublicId, 'new-notification', {
        notification,
      });
    }

    return notification;
  } catch (error) {
    console.error('[Send Notification Helper Error]:', error);
    return null;
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification,
};
