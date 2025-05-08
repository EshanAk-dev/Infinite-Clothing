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
    
    // Clean up function
    return () => {
      // You could dispatch an action to clear currentDesign when unmounting
    };
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Memoized status badge component
  const StatusBadge = useMemo(() => {
    if (!currentDesign?.status) return null;
    
    const statusStyles = {
      Processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
      "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-200",
      Shipped: "bg-blue-100 text-blue-800 border-blue-200",
      Delivered: "bg-purple-100 text-purple-800 border-purple-200",
      Cancelled: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    return (
      <span className={`px-3 py-1 text-sm rounded-full border ${statusStyles[currentDesign.status]}`}>
        {currentDesign.status}
      </span>
    );
  }, [currentDesign?.status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
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
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => navigate("/my-custom-designs")}
              className="mt-2 text-sm text-red-700 underline"
            >
              Go back to My Designs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDesign) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Custom Design
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-2">
            <p className="text-gray-600">
              Created on {formatDate(currentDesign.createdAt)}
            </p>
            {StatusBadge}
          </div>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 p-6">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-center">Front Design</h2>
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <img
                  src={currentDesign.frontImageUrl}
                  alt="Front design"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Design Elements:</h3>
                {currentDesign.designs.front.length > 0 ? (
                  <ul className="space-y-2">
                    {currentDesign.designs.front.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                        <span className="font-medium">{item.name || `Element ${index + 1}`}</span>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          <span>Position: ({item.position.x.toFixed(0)}, {item.position.y.toFixed(0)})</span>
                          <span>Scale: {item.scale.toFixed(2)}</span>
                          <span>Rotation: {item.rotation}°</span>
                          <span>Opacity: {(item.opacity * 100).toFixed(0)}%</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No elements added to front design</p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-center">Back Design</h2>
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <img
                  src={currentDesign.backImageUrl}
                  alt="Back design"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Design Elements:</h3>
                {currentDesign.designs.back.length > 0 ? (
                  <ul className="space-y-2">
                    {currentDesign.designs.back.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                        <span className="font-medium">{item.name || `Element ${index + 1}`}</span>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          <span>Position: ({item.position.x.toFixed(0)}, {item.position.y.toFixed(0)})</span>
                          <span>Scale: {item.scale.toFixed(2)}</span>
                          <span>Rotation: {item.rotation}°</span>
                          <span>Opacity: {(item.opacity * 100).toFixed(0)}%</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No elements added to back design</p>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-8 pt-4 px-6 pb-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Order Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">T-Shirt Color:</span>
                  <div className="flex items-center">
                    <span
                      className="inline-block w-6 h-6 rounded-full border border-gray-300 mr-2"
                      style={{ backgroundColor: currentDesign.color }}
                    ></span>
                    <span>{currentDesign.color}</span>
                  </div>
                  
                  <span className="text-gray-600">Quantity:</span>
                  <span>{currentDesign.quantity}</span>
                  
                  <span className="text-gray-600">Price per item:</span>
                  <span>Rs.{currentDesign.price.toFixed(2)}</span>
                  
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-bold">Rs.{currentDesign.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Shipping Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Name:</span>
                  <span>{currentDesign.shippingAddress.name}</span>
                  
                  <span className="text-gray-600">Address:</span>
                  <span>{currentDesign.shippingAddress.address}</span>
                  
                  <span className="text-gray-600">City:</span>
                  <span>{currentDesign.shippingAddress.city}</span>
                  
                  <span className="text-gray-600">Postal Code:</span>
                  <span>{currentDesign.shippingAddress.postalCode}</span>
                  
                  <span className="text-gray-600">Country:</span>
                  <span>{currentDesign.shippingAddress.country}</span>
                  
                  <span className="text-gray-600">Phone:</span>
                  <span>{currentDesign.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate("/my-custom-designs")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition duration-200"
              >
                Back to My Designs
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;