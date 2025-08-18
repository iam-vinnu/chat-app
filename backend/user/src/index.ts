
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import { createClient } from "redis";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import userRouts from "./routs/userRouts.js"
import cors from "cors"

dotenv.config();
const app = express();
const port = process.env.PORT; 


connectDB();
connectRabbitMQ();    

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient
.connect()
.then(()=> console.log("redis connected"))
.catch(console.error);





app.use(express.json());   
app.use(cors());


app.use("/api/v1",userRouts); 
 
app.listen(port, ()=>{  
    console.log(`Server is running on port ${port}`);
})