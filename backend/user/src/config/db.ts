import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // const connectionInstance = mongoose.connect();
    } catch (error) {
        console.log(error);
        process.exit(1);   
    }
} 