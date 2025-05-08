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
        const notification = new Notification({
          user: order.user._id,
          type: `order_${updatedOrder.status.toLowerCase().replace(' ', '_')}`,
          title: `Order ${updatedOrder.status}`,
          message: `Your order #${updatedOrder._id.toString().substring(18, 24).toUpperCase()} has been updated to ${updatedOrder.status}`,
          orderId: updatedOrder._id,
          orderStatus: updatedOrder.status,
          isRead: false,
        });
        
        await notification.save();
        
        // A socket.io event for real-time updates
        // io.to(order.user._id.toString()).emit('new_notification', notification);
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
