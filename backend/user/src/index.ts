
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import { createClient } from "redis";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import userRouts from "./routs/userRouts.js"

dotenv.config();
connectDB();
connectRabbitMQ();   

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient
   .connect()
   .then(()=> console.log("redis connected"))
   .catch(console.error);

 

const app = express()

const port = process.env.PORT;


app.use("/api/v1",userRouts);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})