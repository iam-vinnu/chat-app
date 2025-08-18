import express from "express";
import { getAllUsers, getUser, loginUser, myProfile, updateName, verifyUser } from "../controller/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/verify").post(verifyUser);
router.route("/me").get(isAuth,myProfile);
router.route("/user/all").get(isAuth,getAllUsers);
router.route("/user/:id").get(getUser);
router.route("/update/user").post(isAuth,updateName);
export default router;  