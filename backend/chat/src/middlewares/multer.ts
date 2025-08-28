import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:"chat-image",
        allowed_formarts: ["jpg" , "jpeg" , "png" , "gif" , "webp"],
        transformations:[
            {width:800 , height : 600 , crop: "Limit"},
            {quality: "auto"}
        ]

    } as any
});

export const upload = multer({
    storage,
    limits:{
       fieldSize: 5*1024*1024
    },
    fileFilter : (req, file, callback)=> {
        if(file.mimetype.startsWith("/image/")){
            callback(null,true /* it is ok to upload */);
        }else{
            callback(new Error("only image allowed"));
        }
    },
})