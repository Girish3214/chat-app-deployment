import Notifications from "../models/notificationModel.js";

const setNotifications = async (req, res) => {
  const { date, isRead, senderId, receiverId } = req.body;

  const newNotification = new Notifications({
    date,
    isRead,
    senderId,
    receiverId,
    members: [senderId, receiverId],
  });

  try {
    const response = await newNotification.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getNotifications = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const response = await Notifications.find({ receiverId });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteNotifications = async (req, res) => {
  const { receiverId, senderId } = req.params;

  try {
    const response = await Notifications.deleteMany({
      members: { $all: [receiverId, senderId] },
    });
    res.status(200).json({ receiverId, senderId, response });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export { getNotifications, setNotifications, deleteNotifications };
