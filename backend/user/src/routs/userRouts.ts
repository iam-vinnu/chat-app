import express from "express";
import { loginUser, myProfile, verifyUser } from "../controller/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/verify").post(verifyUser);
router.route("/me").get(isAuth,myProfile);
export default router;  