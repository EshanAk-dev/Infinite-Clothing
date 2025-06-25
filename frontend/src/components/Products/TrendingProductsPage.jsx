/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGrid, FiList, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const TrendingProductsPage = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch trending products
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/trending`
        );
        setTrendingProducts(response.data);
        setFilteredProducts(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching trending products:", error);
        setError("Failed to load trending products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  // Sort products
  useEffect(() => {
    let sorted = [...trendingProducts];

    switch (sortBy) {
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(sorted);
  }, [sortBy, trendingProducts]);

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm h-full">
      <div className="relative pt-[125%] bg-gray-100 animate-pulse"></div>
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-3 md:h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
        <div className="h-8 md:h-10 bg-gray-100 rounded animate-pulse mt-2 md:mt-4"></div>
      </div>
    </div>
  );

  // Product card component
  const ProductCard = ({ product, index }) => (
    <motion.div
      key={product._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex-shrink-0 group"
    >
      <div
        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] h-full flex border border-gray-100 hover:border-gray-200 ${
          viewMode === "list" ? "flex-row" : "flex-col"
        }`}
      >
        {/* Product Image */}
        <div
          className={`relative overflow-hidden ${
            viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "pt-[125%]"
          }`}
        >
          <Link to={`/product/${product._id}`}>
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className={`${
                viewMode === "list"
                  ? "w-full h-full"
                  : "absolute top-0 left-0 w-full h-full"
              } object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-110`}
              loading="lazy"
            />
            {/* Overlay effects */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          </Link>

          {/* Trending Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md flex items-center gap-1">
            <FiTrendingUp className="text-xs" />
            <span className="hidden md:inline">TRENDING</span>
            <span className="md:hidden">🔥</span>
          </div>

          {/* Discount Badge */}
          {product.discountPrice && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
              {Math.round(
                ((product.discountPrice - product.price) /
                  product.discountPrice) *
                  100
              )}
              % OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div
          className={`p-3 md:p-5 flex-grow flex flex-col ${
            viewMode === "list" ? "justify-between" : ""
          }`}
        >
          <div className="mb-1 md:mb-2">
            <h3 className="font-medium text-sm md:text-base text-gray-900 line-clamp-2 transition-colors duration-200 group-hover:text-gray-700">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-xs text-gray-500 mt-0.5 md:mt-1">
                {product.brand}
              </p>
            )}

            {viewMode === "list" && product.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
              <p className="text-sm md:text-lg font-bold text-gray-900">
                Rs.{product.price.toFixed(2)}
              </p>
              {product.discountPrice && (
                <span className="text-xs md:text-sm text-gray-500 line-through">
                  Rs.{product.discountPrice.toFixed(2)}
                </span>
              )}
            </div>

            <Link
              to={`/product/${product._id}`}
              className="block w-full py-1.5 md:py-2.5 text-xs md:text-sm text-center rounded-md bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-sm hover:shadow-md active:opacity-90"
            >
              Select options
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiTrendingUp className="text-4xl" />
              <h1 className="text-4xl md:text-6xl font-bold">
                🔥 Trending Products
              </h1>
            </div>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Discover the hottest products everyone&apos;s talking about. Don&apos;t miss
              out on these trending items!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              {loading ? "Loading..." : `${filteredProducts.length} Products`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiList className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div
            className={`grid gap-3 md:gap-8 px-2 md:px-4 lg:px-8 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center bg-red-100 text-red-700 p-4 rounded-lg max-w-md mx-auto">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Error loading products: {error}</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Trending Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              There are no trending products available at the moment.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div
            className={`grid gap-3 md:gap-8 px-2 md:px-4 lg:px-8 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!loading && !error && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">
              Don&apos;t See What You&apos;re Looking For?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Explore our full collection of amazing products
            </p>
            <Link
              to="/collections/all"
              className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse All Products
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrendingProductsPage;
