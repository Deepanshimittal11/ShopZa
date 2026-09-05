require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoutes = require("./routes/subscriberRoute");
const adminRoutes = require("./routes/adminRoutes");
const productadminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

const paymentRouter = require("./routes/paymentRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Connect to MongoDb
connectDB();

app.get("/",(req,res) => {
    res.send("Welcom to the ShopZa!");
});

// API routes
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);  
app.use("/api/upload",uploadRoutes);
app.use("/api",subscribeRoutes);

// Admin
app.use("/api/admin/users",adminRoutes);
app.use("/api/admin/products",productadminRoutes);
app.use("/api/admin/orders",adminOrderRoutes);

// Payment
app.use("/api/payment", paymentRouter);

app.listen(PORT, () => {
    console.log(`Server is runnig on http://localhost:${PORT}`);
    
})