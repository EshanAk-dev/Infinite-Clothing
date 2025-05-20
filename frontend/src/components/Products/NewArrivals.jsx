import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch new arrivals
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Scroll functions
  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount =
      direction === "left"
        ? -container.offsetWidth * 0.2
        : container.offsetWidth * 0.2;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
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
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      updateScrollButtons();
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [newArrivals]);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (canScrollRight) {
        scroll("right");
      }
    }, 3000);

    return () => clearInterval(autoScroll);
  }, [canScrollRight]);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-16 px-4 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-full w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded-full w-96 max-w-full mx-auto animate-pulse"></div>
          </div>
          <div className="flex overflow-hidden space-x-6 pb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <div className="bg-gray-100 rounded-xl h-96 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-2 sm:py-16 sm:px-4 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-gray-900">
            New Arrivals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest trends and must-have pieces to refresh your
            wardrobe
          </p>
        </motion.div>

        <div className="relative">
          {/* Scroll buttons */}
          <motion.button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollLeft ? 1 : 0 }}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
              canScrollLeft ? "hover:bg-gray-50 active:bg-gray-100" : ""
            }`}
            whileHover={canScrollLeft ? { scale: 1.1 } : {}}
            whileTap={canScrollLeft ? { scale: 0.95 } : {}}
          >
            <FiChevronLeft className="text-xl sm:text-2xl text-gray-700" />
          </motion.button>

          <motion.button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollRight ? 1 : 0 }}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
              canScrollRight ? "hover:bg-gray-50 active:bg-gray-100" : ""
            }`}
            whileHover={canScrollRight ? { scale: 1.1 } : {}}
            whileTap={canScrollRight ? { scale: 0.95 } : {}}
          >
            <FiChevronRight className="text-xl sm:text-2xl text-gray-700" />
          </motion.button>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            className="overflow-x-auto flex space-x-4 sm:space-x-8 pb-6 sm:pb-8 scrollbar-hide"
          >
            {newArrivals.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex-shrink-0 w-60 xs:w-64 sm:w-80"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                  {/* Product image with gradient overlay */}
                  <div className="relative pt-[125%] overflow-hidden">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.images[0]?.url}
                        alt={product.images[0]?.altText || product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        draggable="false"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    {/* Discount badge */}
                    {product.discountPrice && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
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
                  <div className="p-3 sm:p-5 flex-grow flex flex-col">
                    <div className="mb-2 sm:mb-3">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 transition-colors duration-200 group-hover:text-gray-700">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {product.brand}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-2 sm:mb-4">
                        <p className="text-base sm:text-xl font-bold text-gray-900">
                          Rs.{product.price.toFixed(2)}
                        </p>
                        {product.discountPrice && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            Rs.{product.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/product/${product._id}`}
                        className="block w-full py-2 sm:py-3 text-center rounded-md bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-sm hover:shadow-md active:opacity-90 text-sm sm:text-base"
                      >
                        Select options
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View all button */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            to="/collections/all"
            className="inline-block w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md text-base sm:text-lg"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
