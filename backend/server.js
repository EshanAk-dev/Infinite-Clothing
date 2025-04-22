const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // ⬅️ Required to work with file paths
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoute = require("./routes/subscriberRoute");
const adminRoutes = require("./routes/adminRoutes");
const adminProductsRoutes = require("./routes/adminProductsRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const customDesignRoutes = require("./routes/customDesignRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoute);
app.use("/api/custom-designs", customDesignRoutes);

// Admin
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// -------------------
// Serve frontend (React build)
// -------------------
const __dirnamePath = path.resolve(); // ⬅️ Handles __dirname in ES modules

app.use(express.static(path.join(__dirnamePath, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnamePath, "/client/build/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
