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

export const publishQueue = async (queueName:string , message : any) => {
    if(!channel){
        console.log("RabbitMQ channel is not initiated");
        
    }

    await channel.assertQueue(queueName,{durable:true});

    channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message)),{persistent:true});
}