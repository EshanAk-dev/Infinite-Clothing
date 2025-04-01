import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  // Calculate total items
  const itemCount = cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleCartDrawer}
            className="fixed inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center space-x-2">
                <FiShoppingBag className="h-6 w-6 text-gray-700" />
                <h2 className="text-xl font-semibold">
                  My Cart {itemCount > 0 && `(${itemCount})`}
                </h2>
              </div>
              <button 
                onClick={toggleCartDrawer}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoMdClose className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Cart Contents */}
            <motion.div 
              className="flex-grow overflow-y-auto p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {cart?.products?.length > 0 ? (
                <CartContents cart={cart} userId={userId} guestId={guestId} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <FiShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start shopping to add items to your cart
                  </p>
                  <button
                    onClick={toggleCartDrawer}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>

            {/* Footer */}
            {cart?.products?.length > 0 && (
              <motion.div 
                className="p-6 border-t bg-white sticky bottom-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Shipping, taxes, and discount codes calculated at checkout.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;