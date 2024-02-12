import mongoose from "mongoose";

export const connectDb = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};