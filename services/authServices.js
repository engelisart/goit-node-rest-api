import bcrypt from "bcrypt";

import User from "../models/User.js";

export const signup = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  return await User.create({ ...data, password: hashPassword });
};

export const setToken = async (id, token = "") =>
  User.findByIdAndUpdate(id, { token });

export const setAvatar = async (id, avatarURL) =>
  User.findByIdAndUpdate(id, { avatarURL });
