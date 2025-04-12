import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDesignById } from "../../redux/slices/customDesignSlice";
import { motion } from "framer-motion";

const CustomDesign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentDesign, loading, error } = useSelector(
    (state) => state.customDesign
  );

  useEffect(() => {
    dispatch(fetchDesignById(id));
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
          <p className="text-gray-600 mt-2">
            Created on {formatDate(currentDesign.createdAt)}
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4 text-center">Front Design</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <img
                  src={currentDesign.frontImageUrl}
                  alt="Front design"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Design Elements:</h3>
                <ul className="space-y-2">
                  {currentDesign.designs.front.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.name || `Element ${index + 1}`} - Position: ({item.position.x}, {item.position.y}), Scale: {item.scale}, Rotation: {item.rotation}°
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4 text-center">Back Design</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <img
                  src={currentDesign.backImageUrl}
                  alt="Back design"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Design Elements:</h3>
                <ul className="space-y-2">
                  {currentDesign.designs.back.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.name || `Element ${index + 1}`} - Position: ({item.position.x}, {item.position.y}), Scale: {item.scale}, Rotation: {item.rotation}°
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm text-gray-500">
                T-Shirt Color:{" "}
                <span
                  className="inline-block w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: currentDesign.color }}
                ></span>
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/my-custom-designs")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to My Designs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;