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
      toast.success("Design deleted successfully");
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
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-black via-gray-700 to-white text-white">
  <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
    <motion.div
      className="max-w-3xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold">
        My Custom Designs
      </h1>
      <p className="mt-4 text-lg text-gray-200">
        Your personalized t-shirt collection, ready to wear
      </p>
    </motion.div>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-black animate-spin"></div>
              <div
                className="h-16 w-16 rounded-full border-t-4 border-b-4 border-white animate-spin absolute top-0 left-0"
                style={{ animationDuration: "0.8s" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <motion.div
            className="bg-white shadow-lg rounded-xl border-l-4 border-red-500 p-6 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
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
                <p className="text-base text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {designs.length > 0 ? (
              designs.map((design) => (
                <motion.div
                  key={design._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group transition"
                  variants={itemVariants}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div className="relative">
                    <img
                      src={design.frontImageUrl}
                      alt="Front design"
                      className="w-full h-72 object-contain bg-white"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300"></div>

                    {/* Floating badge with design count */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-md">
                      <span className="text-sm font-medium text-indigo-700">
                        {design.designs.front.length +
                          design.designs.back.length}{" "}
                        elements
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {formatDate(design.createdAt)}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Color:</span>
                        <span
                          className="inline-block w-6 h-6 rounded-full border border-gray-200 shadow-inner"
                          style={{ backgroundColor: design.color }}
                        ></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <motion.button
                        onClick={() =>
                          navigate(`/my-custom-designs/${design._id}`)
                        }
                        className="py-3 px-6 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 flex items-center justify-center transition"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 5C7.63636 5 4 8.5 2 12C4 15.5 7.63636 19 12 19C16.3636 19 20 15.5 22 12C20 8.5 16.3636 5 12 5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        View
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(design._id)}
                        className="py-3 px-6 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 flex items-center justify-center transition"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.74 9L14.394 18M9.606 18L9.26 9M19.228 5.79C19.57 5.842 19.91 5.897 20.25 5.956M19.228 5.79L18.16 19.673C18.1164 20.2383 17.8611 20.7662 17.445 21.1512C17.029 21.5363 16.4829 21.7502 15.916 21.75H8.084C7.5171 21.7502 6.97102 21.5363 6.55498 21.1512C6.13894 20.7662 5.88359 20.2383 5.84 19.673L4.772 5.79M19.228 5.79C18.0739 5.61552 16.9138 5.4831 15.75 5.393M4.772 5.79C4.43 5.841 4.09 5.896 3.75 5.955M4.772 5.79C5.92613 5.61552 7.08623 5.4831 8.25 5.393M15.75 5.393V4.477C15.75 3.297 14.84 2.313 13.66 2.276C12.5536 2.24064 11.4464 2.24064 10.34 2.276C9.16 2.313 8.25 3.297 8.25 4.477V5.393M15.75 5.393C13.2537 5.20008 10.7463 5.20008 8.25 5.393"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full bg-white rounded-xl shadow-lg p-10 text-center"
                variants={itemVariants}
              >
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                  <svg
                    className="relative w-full h-full text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3c-1.023 0-2.047.118-3.05.353a7.022 7.022 0 00-2.78 1.353c-.739.558-1.345 1.253-1.784 2.086A5.668 5.668 0 004 9.17c0 1.032.3 2.022.837 2.82.538.797 1.281 1.42 2.142 1.818l-.35.356a8.394 8.394 0 00-2.165 3.31 8.92 8.92 0 00-.677 3.397V21h16.427v-.127c0-1.154-.229-2.294-.677-3.397a8.394 8.394 0 00-2.165-3.31l-.35-.356c.86-.398 1.604-1.02 2.142-1.818.537-.798.836-1.788.836-2.82 0-.805-.134-1.59-.387-2.378-.439-.833-1.045-1.528-1.784-2.086a7.021 7.021 0 00-2.78-1.353A10.896 10.896 0 0012 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.5 10a.5.5 0 11-1 0 .5.5 0 011 0zM15.5 10a.5.5 0 11-1 0 .5.5 0 011 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  No designs yet
                </h3>
                <p className="mt-3 text-base text-gray-500 max-w-md mx-auto">
                  Time to unleash your creativity! Start designing your own
                  custom t-shirts with our easy-to-use editor.
                </p>
                <div className="mt-8">
                  <motion.button
                    onClick={() => navigate("/customize-t-shirts")}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg
                      className="mr-2 h-5 w-5"
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
                    Create First Design
                  </motion.button>
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
