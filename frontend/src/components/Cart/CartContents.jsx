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
    <div className="space-y-6 px-4 sm:px-0">
      {/* Cart Items */}
      <div className="space-y-4">
        <AnimatePresence>
          {cart.products.map((product, index) => (
            <motion.div
              key={`${product.productId}-${product.size}-${product.color}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-start gap-4 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image and Info Layout - Always vertical */}
              <div className="flex w-full gap-3">
                {/* Product Image */}
                <div className="flex-shrink-0 relative">
                  <div className="bg-gray-50 rounded-lg w-16 h-16 flex items-center justify-center overflow-hidden">
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
                    <h3 className="font-medium text-gray-900 text-sm truncate max-w-xs">
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
                      className="text-red-500 sm:text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <RiDeleteBin6Line className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-1">
                    <span>Size: {product.size}</span>
                    <span>|</span>
                    <span>Qty: {product.quantity}</span>
                    <span>|</span>
                    <span>Color: {product.color}</span>
                  </div>
                </div>
              </div>

              {/* Quantity and Price - Always full width, stacked */}
              <div className="flex items-center justify-between w-full mt-3">
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
                    className="w-7 h-7 flex items-center justify-center rounded-l-full text-gray-500 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <span className="text-sm">−</span>
                  </button>
                  <span className="mx-2 text-xs font-medium w-4 text-center">
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
                    className="w-7 h-7 flex items-center justify-center rounded-r-full text-gray-500 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <span className="text-sm">+</span>
                  </button>
                </div>

                <p className="font-medium text-gray-900 text-sm ml-4">
                  Rs.{" "}
                  {parseFloat(product.price * product.quantity).toLocaleString(
                    "en-LK",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
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
        className="bg-white p-4 sm:p-6 rounded-xl shadow-sm"
      >
        <h3 className="font-medium text-base sm:text-lg mb-4">Order Summary</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
            <span className="font-medium text-sm sm:text-base">
              Rs.{" "}
              {parseFloat(subtotal).toLocaleString("en-LK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm sm:text-base">Shipping</span>
            <span className="text-gray-600 text-xs sm:text-sm">
              Calculated at checkout
            </span>
          </div>
          <div className="border-t border-gray-100 pt-3 sm:pt-4 flex justify-between text-base sm:text-lg font-medium">
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
