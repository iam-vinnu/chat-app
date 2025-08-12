import express from "express";
import { loginUser } from "../controller/user.controller.js";

const router = express.Router();

router.route("/login").post(loginUser);
export default router;