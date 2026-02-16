const asyncHandler = require("../utils/asyncHandler");
const Notification = require("../models/Notification");

/* =======================
   GET USER NOTIFICATIONS
======================= */

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user._id,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(notifications);
});

/* =======================
   MARK AS READ
======================= */

exports.markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(
    req.params.id
  );

  if (!notification) {
    return res.status(404).json({
      message: "Notification not found",
    });
  }

  notification.isRead = true;
  await notification.save();

  res.json({
    success: true,
  });
});

/* =======================
   MARK ALL AS READ
======================= */

exports.markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({
    success: true,
    message: "All notifications marked as read",
  });
});
