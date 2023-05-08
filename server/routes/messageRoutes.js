import express from "express";
import {
  getMessages,
  createMessage,
} from "../controllers/messageConntroller.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);

export default router;
