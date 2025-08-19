import mongoose ,{Document , Schema} from "mongoose";

export interface IChat extends Document{
    users : string[];
    latestMessage : {
        text: string;
        sender:string;
    }
};

const chatSchema:Schema<IChat> = new Schema({
    users:[{
        type:String,
        required: true
    }],
    latestMessage:{
        text:String,
        sender:String
    }
});

export const Chat = mongoose.model<IChat>("Chat" , chatSchema);