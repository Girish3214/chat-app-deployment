import express from "express";

import {
  registerUser,
  loginUser,
  getSingleUser,
  getAllUsers,
  setAvatar,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/setAvatar/:id", setAvatar);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);

export default router;
