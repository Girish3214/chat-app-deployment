import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  date: { type: String, required: true },
  isRead: { type: Boolean, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: Array,
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Notification", notificationSchema);
