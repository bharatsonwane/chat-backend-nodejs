const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import { envVariable } from "../config/envVariable";

// // AUTH
export const getHashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export const validatePassword = async (password, hashedPassword) => {
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  return isPasswordValid;
};

export const createTwtToken = async (tokenDataObject) => {
  const jwtToken = jwt.sign(
    { data: { ...tokenDataObject } },
    envVariable.JWT_SECRET,
    { expiresIn: 24 * 60 * 60 }
  );
  return jwtToken;
};

export const validateJwtToken = async (token) => {
  try {
    // verify a token symmetric - synchronous
    const decodedToken = jwt.verify(token, "secretKey");
  } catch (error) {}
};
