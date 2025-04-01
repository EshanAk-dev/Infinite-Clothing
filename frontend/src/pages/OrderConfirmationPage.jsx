import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShoppingBag, FiTruck, FiCreditCard, FiHome, FiCalendar } from "react-icons/fi";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  // Clear the cart when the order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to order date
    return orderDate.toLocaleDateString();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 sm:p-6"
    >
      {/* Success Header */}
      <motion.div 
        className="text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <FiCheckCircle className="h-16 w-16 text-emerald-500" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Thank you for your purchase. We've sent a confirmation email with your order details.
        </p>
      </motion.div>

      {checkout && (
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Order Summary Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiShoppingBag className="mr-2 text-emerald-600" />
                  Order #{checkout._id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-gray-500 text-sm flex items-center">
                  <FiCalendar className="mr-1" />
                  Placed on {new Date(checkout.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="bg-emerald-50 px-3 py-1 rounded-full flex items-center">
                <FiTruck className="text-emerald-600 mr-1" />
                <span className="text-emerald-700 text-sm font-medium">
                  Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="divide-y">
            {checkout.checkoutItems.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 flex items-start"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-md mr-4 border"
                />
                <div className="flex-grow">
                  <h4 className="text-md font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.color} | Size: {item.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-md font-medium">Rs.{item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Details Footer */}
          <div className="bg-gray-50 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-white p-4 rounded-lg shadow-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <FiCreditCard className="text-emerald-600 mr-2" />
                Payment Information
              </h4>
              <div className="space-y-2">
                <p className="text-gray-600">Method: PayPal</p>
                <p className="text-gray-600">Status: Paid</p>
                <p className="text-gray-600">
                  Total: <span className="font-medium">Rs.{checkout.totalPrice.toFixed(2)}</span>
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-4 rounded-lg shadow-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <FiHome className="text-emerald-600 mr-2" />
                Shipping Address
              </h4>
              <div className="space-y-1">
                <p className="text-gray-600">{checkout.shippingAddress.firstName} {checkout.shippingAddress.lastName}</p>
                <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                <p className="text-gray-600">{checkout.shippingAddress.city}, {checkout.shippingAddress.postalCode}</p>
                <p className="text-gray-600">{checkout.shippingAddress.country}</p>
                <p className="text-gray-600">Phone: {checkout.shippingAddress.phone}</p>
              </div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="p-6 border-t flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Order History
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderConfirmationPage;