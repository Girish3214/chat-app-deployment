import express from "express";
import {
  createChat,
  findChat,
  findUserChats,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);
router.delete("/:chatId", deleteChat);

export default router;
