import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ MongoDB Successfully Connected : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`❌ MongoDb connection Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDb