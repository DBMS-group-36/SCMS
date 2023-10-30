import logger from "@shared/logger";
import { connect, Mongoose } from "mongoose";

const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MongoDB URI cannot be found in .env file");
    }

    const database: Mongoose = await connect(mongoURI);

    return database;
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export default connectDatabase;