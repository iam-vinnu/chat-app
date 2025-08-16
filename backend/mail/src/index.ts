import express from "express"
import dotenv from "dotenv"
import { startSendOtpConsumer } from "./consumer.js";
const app = express();
dotenv.config(); 
  


startSendOtpConsumer();


app.listen(process.env.PORT , ()=>{
    console.log(`Server is running at ${process.env.PORT}`);
    
})