import { HttpError } from "../helper/httpError.js";
import User from "../services/user.service.js";
import Lookup from "../services/lookup.service.js";
import {
  createTwtToken,
  getHashPassword,
  validatePassword,
} from "../helper/authHelper.js";

export const postUserLogin = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const userObject = new User(reqBody);

    /** check user exists on phone and email  */
    const userData = await userObject.getUserByEmailOrPhone();
    if (!userData) {
      throw new HttpError("User not found", 404);
    }

    /** check password */
    const isPasswordValid = await validatePassword(
      reqBody.password,
      userData.password
    );

    if (!isPasswordValid) {
      throw new HttpError("Invalid password", 400);
    }

    const tokenData = {
      userId: userData.id,
      email: userData.email,
      userRole: userData.user_role,
      user_role_lookup_id: userData.user_role_lookup_id,
      user_status: userData.user_status,
      user_status_lookup_id: userData.user_status_lookup_id,
    };

    const jwtToken = await createTwtToken(tokenData);

    res.status(200).send({ token: jwtToken, userData: tokenData });
  } catch (error) {
    res.error(error);
  }
};

export const postUserSignup = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const userObject = new User(reqBody);
    debugger

    /** check user exists on phone and email  */
    const userData = await userObject.getUserByEmailOrPhone();
    if (userData) {
      throw new HttpError("User already exists", 400);
    }

    /* get user status lookup id */
    userObject.userStatusLookupId = await Lookup.getUserStatusPendingId();

    /* get user role lookup id */
    userObject.userRoleLookupId = await Lookup.getUserRoleUserId();

    /* hash password */
    userObject.hashPassword = await getHashPassword(reqBody.password);

    const registeredUser = await userObject.signupUser();

    res.status(200).send(registeredUser);
  } catch (error) {
    res.error(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userObject = new User({ id: userId });
    const user = await userObject.getUserById();

    if (!user) {
      throw new HttpError("User not found", 404);
    }

    res.status(200).send(user);
  } catch (error) {
    res.error(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const reqBody = req.body;
    const userObject = new User({ ...reqBody, id: userId });

    const userResponse = await userObject.updateUserInfo();
    res.status(200).send(userResponse);
  } catch (error) {
    res.error(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.getUsers();
    res.status(200).send(users);
  } catch (error) {
    res.error(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const reqBody = req.body;

    /* hash password */
    const hashPassword = await getHashPassword(reqBody.password);

    const userObject = new User({
      ...reqBody,
      hashPassword: hashPassword,
      id: userId,
    });

    const userResponse = await userObject.updateUserPassword();
    res.status(200).send(userResponse);
  } catch (error) {
    res.error(error);
  }
};
