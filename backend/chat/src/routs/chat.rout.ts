import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createNewChat } from "../controller/chat.controller.js";

const router = express.Router();


router.route("/chat/new").post(isAuth,createNewChat);

export default router;