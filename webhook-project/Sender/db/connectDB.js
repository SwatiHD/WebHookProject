import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/webhookProject");

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Error", error.message);
  }
};

export default connectDB;
