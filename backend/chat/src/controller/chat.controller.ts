import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../model/chatModel.js";

export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res) => {
        const userId = req.user?._id;
        const { otherUserId } = req.body;

        if (!otherUserId) {
            return res.status(404).json({
                message: "Other User ID Required"
            })
        }

        const exsistingMessage = await Chat.findOne({
            users:{$all:[userId,otherUserId] , $size:2}
        });

        if(exsistingMessage){
            return res.status(200).json({
                message:"Chat already exsists..",
                chatId : exsistingMessage._id
            })
        }

        const newChat = await Chat.create({
            users:[userId,otherUserId]
        })

         res.status(201).json({
            message:"New chat created",
            chatId : newChat._id
         });
});