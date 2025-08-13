const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

// console.log(process.env.PORT);

const PORT = process.env.PORT || 9000;

//connect to mongoDB
connectDB();

app.get("/", (req,res) => {
    res.send("Welcome to shpoZa api!");
});

//api routes
app.use("/api/users", userRoutes);   
app.use("/api/products", productRoutes);   

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})