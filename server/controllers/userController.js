import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import User from "../models/UserModel.js";
import { createJWT } from "../utils/jwt.js";
import validator from "validator";

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError("Email already exists");
  }

  if (!name || !email || !password) {
    throw new BadRequestError("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new BadRequestError(
      "Password must be at least 8 characters, should container capital letter"
    );
  }

  const user = await User.create({ name, email, password });
  const token = createJWT(user);
  res.status(200).json({ _id: user._id, email, name, token: token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = createJWT(user);
  if (user && token) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      token: token,
      avatar: user.avatar,
    });
  } else {
    res.status(400);
    throw new UnauthenticatedError("Invalid user data");
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  return res.status(200).json(users);
};

const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }
  res.status(200).json(user);
};

const setAvatar = async (req, res) => {
  const userId = req.params.id;
  const avatar = req.body.avatar;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      avatar: avatar,
    },

    { new: true }
  ).select("-password");
  res.send({ avatar: user.avatar });
};

export { registerUser, loginUser, getSingleUser, getAllUsers, setAvatar };
