import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createNewChat, getAllChats, sendMessage } from "../controller/chat.controller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();


router.route("/chat/new").post(isAuth,createNewChat);
router.route("/chat/all").get(isAuth,getAllChats);
router.route("/message").post(isAuth, upload.single("image") , sendMessage);

export default router;