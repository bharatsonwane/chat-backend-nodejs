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
    const reqObj = req.body;

    const userObject = new User(reqObj);

    /** check user exists on phone and email  */
    const userExist = await userObject.getUserByEmailOrPhone();
    if (!userExist) {
      throw new HttpError("User not found", 404);
    }

    /** check password */
    const isPasswordValid = await validatePassword(
      reqObj.password,
      userExist.password
    );

    if (!isPasswordValid) {
      throw new HttpError("Invalid password", 400);
    }

    const tokenData = {
      userId: userExist.id,
      email: userExist.email,
      userRole: userExist.user_role,
      user_role_lookup_id: userExist.user_role_lookup_id,
      user_status: userExist.user_status,
      user_status_lookup_id: userExist.user_status_lookup_id,
    };

    const jwtToken = await createTwtToken(tokenData);

    res.status(200).send({ token: jwtToken, userData: tokenData });
  } catch (error) {
    res.error(error);
  }
};

export const postUserSignup = async (req, res, next) => {
  try {
    const reqObj = req.body;
    const userObject = new User(reqObj);

    /** check user exists on phone and email  */
    const userExist = await userObject.getUserByEmailOrPhone();
    if (!userExist) {
      throw new HttpError("User already exists", 400);
    }

    /* get user status lookup id */
    userObject.userStatusLookupId = await Lookup.getUserStatusPendingId();

    /* get user role lookup id */
    userObject.userRoleLookupId = await Lookup.getUserRoleUserId();

    /* hash password */
    userObject.hashPassword = await getHashPassword(reqObj.password);

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
    // const reqObj = req.body;
    // const userInfo = req.userInfo;
    // const resObj = await User.updateUserProfile(reqObj, userInfo);
    // res.status(200).send(resObj);
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
}
