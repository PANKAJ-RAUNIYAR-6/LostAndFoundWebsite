import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lost_and_found_web';
  try {
    // Attempt connection with 3-second timeout so app does not hang if no local mongod
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Live MongoDB connection unavailable (${error.message}).`);
    console.log(`[Database] Initializing Fast In-Memory Embedded Storage Engine (Fully functional for testing & development).`);
    isMongoConnected = false;
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isMongoConnected,
  type: isMongoConnected ? 'MongoDB / Mongoose' : 'Embedded In-Memory Engine (Fallback)',
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lost_and_found_web'
});
