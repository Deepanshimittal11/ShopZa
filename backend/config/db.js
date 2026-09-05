const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/shopza";

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully");
        return true;
    } catch (err) {
        console.error("MongoDB connection warning:", err.message);
        console.log("Backend server will continue running. (Note: provide a valid MONGO_URI in backend/.env or start MongoDB locally to enable database features)");
        return false;
    }
};

module.exports = connectDB;
