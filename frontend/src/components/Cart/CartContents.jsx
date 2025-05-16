import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  const subtotal = cart.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-8">
      {/* Cart Items */}
      <div className="space-y-6">
        <AnimatePresence>
          {cart.products.map((product, index) => (
            <motion.div
              key={`${product.productId}-${product.size}-${product.color}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 relative">
                <div className="bg-gray-50 rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <button
                    onClick={() =>
                      handleRemoveFromCart(
                        product.productId,
                        product.size,
                        product.color
                      )
                    }
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <RiDeleteBin6Line className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-3 text-sm text-gray-500 mt-1 mb-3">
                  <span>Size: {product.size}</span>
                  <span>Color: {product.color}</span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product.productId,
                          -1,
                          product.quantity,
                          product.size,
                          product.color
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-l-full text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm">−</span>
                    </button>
                    <span className="mx-3 text-sm font-medium w-5 text-center">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product.productId,
                          1,
                          product.quantity,
                          product.size,
                          product.color
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-r-full text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm">+</span>
                    </button>
                  </div>

                  <p className="font-medium text-gray-900">
                    Rs.{" "}
                    {parseFloat(
                      product.price * product.quantity
                    ).toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cart Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <h3 className="font-medium text-lg mb-4">Order Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              Rs.{" "}
              {parseFloat(subtotal).toLocaleString("en-LK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-600">Calculated at checkout</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>
              Rs.{" "}
              {parseFloat(subtotal).toLocaleString("en-LK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartContents;
