const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    
    if (order) {
      const oldStatus = order.status;
      order.status = req.body.status || order.status;
      
      // If the order status is being set to "Delivered"
      if (req.body.status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        
        if (order.paymentMethod === "COD" && order.paymentStatus === "pending COD") {
          order.paymentStatus = "paid";
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      }
      
      const updatedOrder = await order.save();
      
      // Create notification if status changed
      if (oldStatus !== updatedOrder.status) {
        // Get order reference number
        const orderRef = order._id.toString().slice(-8).toUpperCase();
        
        // Create notification messages based on status
        let notificationTitle, notificationMessage;
        
        switch (updatedOrder.status) {
          case "Processing":
            notificationTitle = "Order Confirmed";
            notificationMessage = `Thank you for your order #${orderRef}! We've received your order and are preparing it for shipment. We'll notify you when it's on the way.`;
            break;
          
          case "Shipped":
            notificationTitle = "Order Shipped";
            notificationMessage = `Great news! Your order #${orderRef} has been shipped and is on its way to you. You can track your delivery status in your account dashboard.`;
            break;
          
          case "Out_for_Delivery":
            notificationTitle = "Out for Delivery";
            notificationMessage = `Exciting news! Your order #${orderRef} is out for delivery today. Please ensure someone is available to receive your package.`;
            break;
          
          case "Delivered":
            notificationTitle = "Order Delivered";
            notificationMessage = `Your order #${orderRef} has been successfully delivered! We hope you enjoy your purchase. If you have any concerns, please contact our customer support.`;
            break;
          
          case "Cancelled":
            notificationTitle = "Order Cancelled";
            notificationMessage = `Your order #${orderRef} has been cancelled as requested. If you didn't request this cancellation or have any questions, please contact our customer support immediately.`;
            break;
          
          default:
            notificationTitle = `Order ${updatedOrder.status}`;
            notificationMessage = `Your order #${orderRef} has been updated to ${updatedOrder.status}. Check your account for more details.`;
        }
        
        const notification = new Notification({
          user: order.user._id,
          type: `order_${updatedOrder.status.toLowerCase().replace(' ', '_')}`,
          title: notificationTitle,
          message: notificationMessage,
          orderId: updatedOrder._id,
          orderStatus: updatedOrder.status,
          isRead: false,
        });
        
        await notification.save();
        
        // Send real-time notification via WebSocket
        req.app.locals.sendNotificationToUser(order.user._id.toString(), {
          type: 'order_update',
          orderId: updatedOrder._id,
          status: updatedOrder.status,
          notification: {
            id: notification._id,
            title: notificationTitle,
            message: notificationMessage,
            createdAt: new Date()
          }
        });
      }
      
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;