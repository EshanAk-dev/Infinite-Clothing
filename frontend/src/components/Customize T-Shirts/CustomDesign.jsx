import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserDesignById } from "../../redux/slices/customDesignSlice";
import { motion } from "framer-motion";

const CustomDesign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentDesign, loading, error } = useSelector(
    (state) => state.customDesign
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDesignById(id));
    }
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const StatusBadge = useMemo(() => {
    if (!currentDesign?.status) return null;

    const statusStyles = {
      Processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
      "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-200",
      Shipped: "bg-blue-100 text-blue-800 border-blue-200",
      Delivered: "bg-purple-100 text-purple-800 border-purple-200",
      Cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span
        className={`px-3 py-1 text-sm rounded-full border ${
          statusStyles[currentDesign.status]
        } font-medium`}
      >
        {currentDesign.status}
      </span>
    );
  }, [currentDesign?.status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-black animate-spin"></div>
            <div
              className="h-16 w-16 rounded-full border-t-4 border-b-4 border-gray-300 animate-spin absolute top-0 left-0"
              style={{ animationDuration: "0.8s" }}
            ></div>
          </div>
          <p className="mt-4 text-gray-700">Loading your design...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
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
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            Error loading design
          </h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <motion.button
              onClick={() => navigate("/my-custom-designs")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Back to My Designs
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDesign) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-500 mb-2">
            Order ID:{" "}
            <span className="font-mono">
              #{currentDesign._id.slice(-8) || id}
            </span>
          </p>
          <motion.h1
            className="text-4xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Design Details
          </motion.h1>
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-600 flex items-center">
              <svg
                className="w-5 h-5 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(currentDesign.createdAt)}
            </p>
            {StatusBadge}
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Design Preview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Front Design */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Front Design
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {currentDesign.designs.front.length} elements
                </span>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <img
                  src={currentDesign.frontImageUrl}
                  alt="Front design"
                  className="w-full h-auto max-h-96 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-1.5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Design Elements
                </h3>
                {currentDesign.designs.front.length > 0 ? (
                  <ul className="space-y-3">
                    {currentDesign.designs.front.map((item, index) => (
                      <motion.li
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900">
                            {item.name || `Element ${index + 1}`}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Position
                          </div>
                          <span>
                            ({item.position.x.toFixed(0)},{" "}
                            {item.position.y.toFixed(0)})
                          </span>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              />
                            </svg>
                            Scale
                          </div>
                          <span>{item.scale.toFixed(2)}</span>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                              />
                            </svg>
                            Rotation
                          </div>
                          <span>{item.rotation}°</span>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Opacity
                          </div>
                          <span>{(item.opacity * 100).toFixed(0)}%</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">
                      No elements added to front design
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Back Design */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Back Design
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {currentDesign.designs.back.length} elements
                </span>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <img
                  src={currentDesign.backImageUrl}
                  alt="Back design"
                  className="w-full h-auto max-h-96 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-1.5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Design Elements
                </h3>
                {currentDesign.designs.back.length > 0 ? (
                  <ul className="space-y-3">
                    {currentDesign.designs.back.map((item, index) => (
                      <motion.li
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900">
                            {item.name || `Element ${index + 1}`}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Position
                          </div>
                          <span>
                            ({item.position.x.toFixed(0)},{" "}
                            {item.position.y.toFixed(0)})
                          </span>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              />
                            </svg>
                            Scale
                          </div>
                          <span>{item.scale.toFixed(2)}</span>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                              />
                            </svg>
                            Rotation
                          </div>
                          <span>{item.rotation}°</span>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Opacity
                          </div>
                          <span>{(item.opacity * 100).toFixed(0)}%</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">
                      No elements added to back design
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order and Shipping Info */}
          <motion.div
            className="bg-gray-50 border-t border-gray-200 p-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Details Card */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Details
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">T-Shirt Color</span>
                    <div className="flex items-center">
                      <span
                        className="inline-block w-5 h-5 rounded-full border border-gray-300 mr-2"
                        style={{ backgroundColor: currentDesign.color }}
                      ></span>
                      <span className="font-medium">{currentDesign.color}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">
                      {currentDesign.quantity}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per item</span>
                    <span className="font-medium">
                      Rs.{currentDesign.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Total Price
                    </span>
                    <span className="text-lg font-bold text-indigo-600">
                      Rs.{currentDesign.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Info Card */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9V7a2 2 0 012-2h10a2 2 0 012 2v2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V17a2 2 0 01-2 2h-1a2 2 0 01-4 0H9a2 2 0 01-4 0H4a2 2 0 01-2-2v-6a2 2 0 012-2h16"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shipping Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">
                      {currentDesign.shippingAddress.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Address</span>
                    <span className="font-medium text-right max-w-xs">
                      {currentDesign.shippingAddress.address}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">City</span>
                    <span className="font-medium">
                      {currentDesign.shippingAddress.city}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Postal Code</span>
                    <span className="font-medium">
                      {currentDesign.shippingAddress.postalCode}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Country</span>
                    <span className="font-medium">
                      {currentDesign.shippingAddress.country}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">
                      {currentDesign.shippingAddress.phone}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center mt-5 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => navigate("/my-custom-designs")}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to My Designs
              </motion.button>
              {/* WhatsApp Support Button */}
              <motion.button
                onClick={() => {
                  const orderNumber = (currentDesign._id || id)
                    .slice(-8)
                    .toUpperCase();
                  const message = `Order #${orderNumber}\nHi, I need help with my custom design order.`;
                  const phone = "94710701158";
                  const url = `https://wa.me/${phone}?text=${encodeURIComponent(
                    message
                  )}`;
                  window.open(url, "_blank");
                }}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
              >
                {/* WhatsApp Icon */}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.98L0 24l6.27-1.64A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.26-1.44l-.38-.22-3.73.97.99-3.63-.24-.37A9.93 9.93 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.02 4.23.7.24 1.25.38 1.68.48.71.15 1.36.13 1.87.08.57-.06 1.65-.67 1.89-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z" />
                </svg>
                Contact Support
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomDesign;
