import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlwrapper.js";

import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const contactsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;

  const user = await userServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const avatarURL = gravatar.url(email);
  const newUser = await authServices.signup({
    ...req.body,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    http: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await userServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  await userServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );

  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "User already verified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    http: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent"  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  avatars: ctrlWrapper(avatars),
};
