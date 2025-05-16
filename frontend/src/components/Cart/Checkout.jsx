import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "./PaypalButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import Select from "react-select";
import countryList from "react-select-country-list";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState(""); // Track selected payment method
  const countryOptions = countryList().getData();

  // Ensure that cart is loaded before proceeding checkout
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0 && paymentMethod) {
      // Added paymentMethod check
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: paymentMethod, // This will now use the selected method
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        if (paymentMethod === "Paypal") {
          setActiveStep(2); // Move to payment step for Paypal
        } else if (paymentMethod === "COD") {
          // Handle COD payment immediately
          await handleCODPayment(res.payload._id);
        }
      }
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleCODPayment = async (checkoutId) => {
    try {
      // Mark the checkout as paid for COD with pending COD status
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "pending COD",
          paymentDetails: { method: "COD" },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Check if payment update was successful
      if (response.data && response.data._id) {
        // Finalize the checkout
        await handleFinalizeCheckout(checkoutId);
      } else {
        console.error(
          "COD payment update successful but response data is missing"
        );
        alert("Order started but there was an issue. Please contact support.");
      }
    } catch (error) {
      console.error("COD payment error:", error);
      alert("Error processing COD payment. Please try again.");
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      // The key issue is here - we need to explicitly set paymentStatus to "paid"
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: {
            id: details.id,
            status: details.status,
            update_time: details.update_time,
            email_address: details.payer.email_address,
            // Include any other PayPal details you want to keep
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // If payment was successful, finalize the checkout
      if (response.data && response.data._id) {
        await handleFinalizeCheckout(checkoutId);
      } else {
        console.error("Payment update successful but response data is missing");
        alert(
          "Payment recorded but there was an issue. Please contact support."
        );
      }
    } catch (error) {
      console.error("PayPal payment processing error:", error);
      alert("Error processing payment. Please try again or contact support.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data && response.data._id) {
        navigate("/order-confirmation");
      } else {
        console.error("Finalization successful but order data is missing");
        alert(
          "Order placed but there was an issue. Please check your orders or contact support."
        );
      }
    } catch (error) {
      console.error("Error finalizing checkout:", error);
      alert("Error finalizing order. Please contact customer support.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6 text-center">
        <FiShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Add some products to your cart before checking out
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Checkout Steps */}
      <div className="mb-8">
        <nav className="flex items-center justify-center">
          <ol className="flex items-center space-x-4">
            <li className="flex items-center">
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activeStep >= 1
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {activeStep > 1 ? <FiCheckCircle className="h-5 w-5" /> : "1"}
              </span>
              <span
                className={`ml-2 text-sm font-medium ${
                  activeStep >= 1 ? "text-black" : "text-gray-500"
                }`}
              >
                Shipping
              </span>
            </li>
            <li className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activeStep >= 2
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {activeStep > 2 ? <FiCheckCircle className="h-5 w-5" /> : "2"}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  activeStep >= 2 ? "text-black" : "text-gray-500"
                }`}
              >
                Payment
              </span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Shipping/Payment Form */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeStep === 1 ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              <form onSubmit={handleCreateCheckout}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                        required
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                        required
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      required
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <Select
                      options={countryOptions}
                      value={countryOptions.find(
                        (c) => c.label === shippingAddress.country
                      )}
                      onChange={(selected) =>
                        setShippingAddress({
                          ...shippingAddress,
                          country: selected ? selected.label : "",
                        })
                      }
                      isSearchable
                      placeholder="Select your country..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                    <div className="space-y-3">
                      <div
                        className={`border rounded-md p-4 cursor-pointer transition-colors ${
                          paymentMethod === "Paypal"
                            ? "border-black bg-black bg-opacity-5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handlePaymentMethodSelect("Paypal")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              paymentMethod === "Paypal"
                                ? "border-black bg-black"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === "Paypal" && (
                              <FiCheckCircle className="text-white w-3 h-3" />
                            )}
                          </div>
                          <h3 className="text-lg font-medium">
                            Pay with PayPal
                          </h3>
                        </div>
                      </div>
                      <div
                        className={`border rounded-md p-4 cursor-pointer transition-colors ${
                          paymentMethod === "COD"
                            ? "border-black bg-black bg-opacity-5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handlePaymentMethodSelect("COD")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              paymentMethod === "COD"
                                ? "border-black bg-black"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === "COD" && (
                              <FiCheckCircle className="text-white w-3 h-3" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">
                              Cash on Delivery
                            </h3>
                            <p className="text-sm text-gray-600">
                              Available only in Sri Lanka
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!paymentMethod}
                      className={`w-full flex items-center justify-center px-6 py-3 rounded-md transition-colors ${
                        paymentMethod
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {paymentMethod === "COD"
                        ? "Place Order"
                        : "Continue to Payment"}{" "}
                      <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3">Pay with PayPal</h3>
                  <PaypalButton
                    amount={cart.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) =>
                      alert("Payment failed. Please try again!")
                    }
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Right side - Order Summary */}
        <motion.div
          className="bg-gray-50 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6">
            {cart.products.map((product, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-4 border-b"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">
                      Size: {product.size}
                    </p>
                    <p className="text-sm text-gray-500">
                      Color: {product.color}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {product.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  Rs.{parseFloat(product.price?.toLocaleString()).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                Rs.{cart.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">
                Rs.{cart.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
