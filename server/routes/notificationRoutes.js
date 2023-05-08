import express from "express";
import {
  getNotifications,
  setNotifications,
  deleteNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", setNotifications);
router.get("/:receiverId", getNotifications);
router.delete("/:receiverId/:senderId", deleteNotifications);

export default router;
