const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const client = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB:${client.connection.host}`);
    return client;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = connectDB;
