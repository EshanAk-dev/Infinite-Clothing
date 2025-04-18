import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUserDesigns,
  deleteUserDesign,
} from "../../redux/slices/customDesignSlice";
import { motion } from "framer-motion";
import { toast } from "sonner";

const MyCustomDesigns = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { designs, loading, error } = useSelector(
    (state) => state.customDesign
  );

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=my-custom-designs");
    } else {
      dispatch(fetchUserDesigns());
    }
  }, [user, navigate, dispatch]);

  const handleDelete = (designId) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      dispatch(deleteUserDesign(designId));
      toast.success("Custom design deleted successfully!", {
        style: {
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
          borderRadius: "8px",
          padding: "16px",
        },
      });
    }
    dispatch(fetchUserDesigns());
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

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
            My Custom Designs
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage your saved t-shirt designs
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
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
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {designs.length > 0 ? (
              designs.map((design) => (
                <motion.div
                  key={design._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <img
                      src={design.frontImageUrl}
                      alt="Front design"
                      className="w-full h-64 object-contain bg-gray-100"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-semibold">
                        {formatDate(design.createdAt)}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Color:{" "}
                        <span
                          className="inline-block w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: design.color }}
                        ></span>
                      </span>
                      <span className="text-sm text-gray-500">
                        {design.designs.front.length +
                          design.designs.back.length}{" "}
                        designs
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() =>
                          navigate(`/my-custom-designs/${design._id}`)
                        }
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(design._id)}
                        className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12"
                variants={itemVariants}
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No designs yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first custom t-shirt design.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/customize-t-shirts")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Design
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyCustomDesigns;
