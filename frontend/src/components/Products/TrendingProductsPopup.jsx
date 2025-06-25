import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const TrendingProductsPopup = ({ isOpen, onClose }) => {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch trending products when popup opens
  useEffect(() => {
    if (isOpen) {
      const fetchTrendingProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/trending`
          );
          setTrendingProducts(response.data);
        } catch (error) {
          console.error("Error fetching trending products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTrendingProducts();
    }
  }, [isOpen]);

  // Scroll functions
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount =
        direction === "left"
          ? -container.offsetWidth * 0.5
          : container.offsetWidth * 0.5;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Update scroll buttons visibility
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth + 1;
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container && isOpen) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      updateScrollButtons();
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [trendingProducts, isOpen]);

  // Auto scroll functionality
  useEffect(() => {
    if (!isOpen || loading || trendingProducts.length === 0) return;

    const autoScroll = setInterval(() => {
      if (canScrollRight) {
        scroll("right");
      } else {
        // Reset to beginning when reached end
        const container = scrollRef.current;
        if (container) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [canScrollRight, isOpen, loading, trendingProducts.length]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
            >
              <FiX className="text-xl group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Header */}
            <div className="relative p-6 pb-4 text-center text-white">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                  🔥 TRENDING NOW
                </h2>
                <p className="text-lg opacity-90 drop-shadow-sm">
                  Don&apos;t miss out on these hot products!
                </p>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-white/15 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-4 left-8 w-4 h-4 bg-white/25 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>

            {/* Content */}
            <div className="relative px-6 pb-6">
              {loading ? (
                // Loading skeleton
                <div className="flex overflow-hidden space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-64">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl h-80 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : trendingProducts.length > 0 ? (
                <div className="relative">
                  {/* Scroll buttons */}
                  {canScrollLeft && (
                    <motion.button
                      onClick={() => scroll("left")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiChevronLeft className="text-2xl text-white" />
                    </motion.button>
                  )}

                  {canScrollRight && (
                    <motion.button
                      onClick={() => scroll("right")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiChevronRight className="text-2xl text-white" />
                    </motion.button>
                  )}

                  {/* Scrollable content */}
                  <div
                    ref={scrollRef}
                    className="overflow-x-auto flex space-x-6 pb-4 scrollbar-hide"
                  >
                    {trendingProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex-shrink-0 w-64"
                      >
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                          {/* Product image */}
                          <div className="relative pt-[100%] overflow-hidden">
                            <Link to={`/product/${product._id}`} onClick={onClose}>
                              <img
                                src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.name}
                                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                draggable="false"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                            
                            {/* Trending badge */}
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                              🔥 TRENDING
                            </div>

                            {/* Discount badge */}
                            {product.discountPrice && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                {Math.round(
                                  ((product.discountPrice - product.price) /
                                    product.discountPrice) *
                                    100
                                )}
                                % OFF
                              </div>
                            )}
                          </div>

                          {/* Product info */}
                          <div className="p-4 flex-grow flex flex-col">
                            <div className="mb-3">
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 transition-colors duration-200 group-hover:text-gray-700">
                                {product.name}
                              </h3>
                              {product.brand && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {product.brand}
                                </p>
                              )}
                            </div>

                            <div className="mt-auto">
                              <div className="flex items-center gap-2 mb-3">
                                <p className="text-lg font-bold text-gray-900">
                                  Rs.{product.price.toFixed(2)}
                                </p>
                                {product.discountPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    Rs.{product.discountPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              <Link
                                to={`/product/${product._id}`}
                                onClick={onClose}
                                className="block w-full py-2 text-center rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
                              >
                                View Product
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-white">
                  <p className="text-lg opacity-75">No trending products available</p>
                </div>
              )}

              {/* Call to action */}
              {trendingProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-6"
                >
                  <Link
                    to="/trendings"
                    onClick={onClose}
                    className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View All Trending Products
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrendingProductsPopup;