import amqp from "amqplib"

let channel : amqp.Channel;

export const connectRabbitMQ = async()=>{
    try {
        const connection = await amqp.connect({
            protocol:"amqp",
            hostname: process.env.rabbitMQ_hostname,
            port:5672,
            username:process.env.rabbitMQ_username,
            password:process.env.rabbitMQ_password
        });
        channel = await connection.createChannel();
        console.log("✅ connected to rabbitMQ");
        
    } catch (error) {
        console.error("Failed to connect to rabbitMQ" , error);
        
    }
} 