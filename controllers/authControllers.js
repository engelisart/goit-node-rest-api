import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlwrapper.js";

const { JWT_SECRET } = process.env;

const contactsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;

  const user = await userServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);
  const newUser = await authServices.signup({ ...req.body, avatarURL });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.setToken(user._id, token);

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: gravatar.url(email),
    },
  });
};

const current = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id, null);

  res.json({ status: 204 });
};

const avatars = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const img = await Jimp.read(oldPath);
  await img.resize(250, 250).writeAsync(oldPath);

  const newPath = path.join(contactsDir, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  await authServices.setAvatar(_id, avatarURL);
  return res.json({ avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  avatars: ctrlWrapper(avatars),
};
