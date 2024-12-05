import express from "express";
// import auth from "../helper/middleware/auth.js";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/authJWT/login", userController.postUserLogin);

// router.post("/manager/register", userController.postManagerRegister);

// router.get("/retrieveProfile", auth, userController.getUserProfile);

export default router;
