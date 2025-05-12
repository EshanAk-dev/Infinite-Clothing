const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
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
const notificationRoute = require("./routes/notificationRoute");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server Setup
const wss = new WebSocket.Server({ server });
const clients = new Map(); // Store connected clients

wss.on('connection', (ws) => {
  let userId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'auth' && data.token) {
        // Verify JWT token
        jwt.verify(data.token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            ws.close();
            return;
          }
          
          userId = decoded.id;
          clients.set(userId, ws);
          console.log(`User ${userId} connected via WebSocket`);
        });
      }
    } catch (e) {
      console.error('WebSocket message error:', e);
    }
  });

  ws.on('close', () => {
    if (userId) {
      clients.delete(userId);
      console.log(`User ${userId} disconnected from WebSocket`);
    }
  });
});

// Function to send notifications to specific user
const sendNotificationToUser = (userId, notification) => {
  const client = clients.get(userId.toString());
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({
      type: 'notification',
      data: notification
    }));
  }
};

// Make the send function available to routes
app.locals.sendNotificationToUser = sendNotificationToUser;

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoute);
app.use("/api/custom-designs", customDesignRoutes);
app.use("/api/notifications", notificationRoute);

// Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Serve static files from React app (after React build)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// For all routes that aren't API routes, serve the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export WebSocket server for use in other files if needed
module.exports = { server, wss, sendNotificationToUser };