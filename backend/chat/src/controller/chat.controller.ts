import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../model/chatModel.js";
import { Messages } from "../model/messages.model.js";

export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
        return res.status(404).json({
            message: "Other User ID Required"
        })
    }

    const exsistingMessage = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 }
    });

    if (exsistingMessage) {
        return res.status(200).json({
            message: "Chat already exsists..",
            chatId: exsistingMessage._id
        })
    }

    const newChat = await Chat.create({
        users: [userId, otherUserId]
    })

    res.status(201).json({
        message: "New chat created",
        chatId: newChat._id
    });
});


export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(400).json({
            message: "no UserId found"
        });
    }

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatWithUserData = await Promise.all(
        chats.map(async (chat) => {
            const otherUserId = chat.users.find((id) => id !== userId);

            const unseenCount = await Messages.countDocuments({
                chatId: chat._id,
                sender: { $ne: userId },
                seen: false
            });

            try {
                const { data } = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`);
                return {
                    user: data,
                    chat: {
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unseenCount
                    }
                };
            } catch (error) {
                console.log(error);

                return {
                    user: { _id: otherUserId, name: "UnknownUser" },
                    chat: {
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unseenCount
                    }
                }
            }

        })
    )
    res.json({
        chat : chatWithUserData
    });
});


export const sendMessage = TryCatch(async(req:AuthenticatedRequest, res)=>{
    const senderId = req.user?._id;
    const {chatId , text} = req.body;
    const imageFile = req.file;
})