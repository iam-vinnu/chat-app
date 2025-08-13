import express from "express";
import { loginUser, verifyUser } from "../controller/user.controller.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/verify").post(verifyUser);
export default router; 