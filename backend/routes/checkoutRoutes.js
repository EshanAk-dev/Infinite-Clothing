const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: paymentMethod === "COD" ? "pending COD" : "pending",
      isPaid: false,
      paidAt: undefined,
    });
    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to marks as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
    } else if (paymentStatus === "pending COD") {
      checkout.isPaid = false;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = undefined;
    } else {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    await checkout.save();

    // Send real-time update for payment status change
    req.app.locals.sendNotificationToUser(checkout.user.toString(), {
      type: "payment_update",
      checkoutId: checkout._id,
      status: paymentStatus,
    });

    res.status(200).json(checkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    if (checkout.isPaid || checkout.paymentMethod === "COD") {
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: checkout.isPaid,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: checkout.paymentStatus,
        paymentDetails: checkout.paymentDetails,
        status: "Processing",
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      await Cart.findOneAndDelete({ user: checkout.user });

      const orderRef = finalOrder._id.toString().slice(-8).toUpperCase();
      const notification = new Notification({
        user: checkout.user,
        type: "order_processing",
        title: "Order Confirmed",
        message: `Thank you for your order #${orderRef}! We've received your order and are preparing it for shipment. We'll notify you when it's on the way.`,
        orderId: finalOrder._id,
        orderStatus: "Processing",
        isRead: false,
      });

      await notification.save();

      // Send real-time notification
      req.app.locals.sendNotificationToUser(checkout.user.toString(), {
        type: "order_created",
        orderId: finalOrder._id,
        status: "Processing",
        notification: {
          id: notification._id,
          title: "Order Confirmed",
          message: notification.message,
          createdAt: new Date(),
        },
      });

      res.status(201).json(finalOrder);
    } else {
      res.status(400).json({
        message:
          "Checkout cannot be finalized. Payment is required for non-COD orders.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/checkout/:id
// @desc Get checkout details by ID
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this checkout" });
    }

    res.status(200).json(checkout);
  } catch (error) {
    console.error("Error fetching checkout details: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
