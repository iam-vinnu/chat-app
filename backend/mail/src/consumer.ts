import amqp from "amqplib"
import dotenv from "dotenv"
import { json } from "express";
import nodemailer from "nodemailer"

dotenv.config(); 

export const startSendOtpConsumer = async () => {
    try {
     const connection = await amqp.connect({
            protocol:"amqp",
            hostname: process.env.rabbitMQ_hostname,
            port:5672,
            username:process.env.rabbitMQ_username,
            password:process.env.rabbitMQ_password
     });

     const channel = await connection.createChannel();
     const queueName = "send-otp";

     await channel.assertQueue(queueName,{durable:true});

     console.log("Mailservice consumer started , litsening for otp emails");


     channel.consume(queueName,async(msg)=>{
           if(msg){
              try {
                const {to,subject,body} = JSON.parse(msg.content.toString());

                const transporter = nodemailer.createTransport({
                    host:"smtp.gmail.com",
                    port:465,
                    auth:{
                        user:process.env.USER,
                        pass:process.env.PASSWORD
                    }
                });

                await transporter.sendMail({
                    from:"chatapp",
                    to,
                    subject,
                    text:body
                });

                console.log(`opt mail send to ${to}`);
                channel.ack(msg);
                
              } catch (error) {
                console.log("Failed to send otp", error);
                
              }
           }
     })
     
    } catch (error) {
        console.log("Failed to start rabbitmq consumer", error);
        
    }
}