import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import {
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  CheckCircle,
  ArrowLeft,
  Truck,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));

      // Reset selections when product changes
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);
    }
  }, [dispatch, productFetchId]);

  // Set main image when product loads
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // Handle quantity changes
  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Add to Cart function
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both color and size", {
        description: "These options are required before adding to cart",
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 sm:p-6 rounded-lg shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-medium text-lg">Unable to load product</p>
          </div>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!selectedProduct) return null;

  const discountPercentage =
    selectedProduct.discountPrice > selectedProduct.price
      ? Math.round(
          ((selectedProduct.discountPrice - selectedProduct.price) /
            selectedProduct.discountPrice) *
            100
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-0 right-0 mx-auto w-11/12 max-w-md z-50 flex items-center bg-green-50 border border-green-200 text-green-800 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-lg"
          >
            <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
            <span className="font-medium">
              Added to your cart successfully!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Back to shopping</span>
        </button>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery - Left Side */}
          <div className="w-full lg:w-3/5 xl:w-3/5 p-3 sm:p-6 lg:p-8">
            <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4">
              {/* Thumbnails - Desktop */}
              <div className="hidden lg:flex flex-col space-y-3 mr-4">
                {selectedProduct.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setMainImage(image.url)}
                    className={`w-16 h-16 xl:w-20 xl:h-20 rounded-lg xl:rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === image.url
                        ? "border-indigo-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <motion.div
                  className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                >
                  <img
                    src={mainImage}
                    alt={selectedProduct.name}
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      isImageZoomed ? "scale-110" : "scale-100"
                    }`}
                  />

                  {discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                      -{discountPercentage}%
                    </div>
                  )}
                </motion.div>

                {/* Thumbnails - Mobile & Tablet */}
                <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 lg:hidden">
                  {selectedProduct.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setMainImage(image.url)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 ${
                        mainImage === image.url
                          ? "border-indigo-500 shadow-sm"
                          : "border-gray-200"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `Thumbnail ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info - Right Side */}
          <div className="w-full lg:w-2/5 xl:w-2/5 p-4 sm:p-6 lg:p-8 bg-white border-t lg:border-t-0 lg:border-l border-gray-100">
            <div>
              {/* Brand & Name */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm font-medium text-indigo-600 mb-1">
                  {selectedProduct.brand || "Premium Collection"}
                </h3>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  Rs.{selectedProduct.price.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                    Rs.{selectedProduct.discountPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description - Not shown on small devices, shown on tablets/desktop */}
              <p className="hidden sm:block text-gray-600 mb-6 sm:mb-8">
                {selectedProduct.description}
              </p>

              {/* Color Selection */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  {selectedColor && (
                    <span className="text-xs sm:text-sm text-gray-500">
                      Selected:{" "}
                      <span className="font-medium">{selectedColor}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {selectedProduct.colors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color
                          ? "border-indigo-500 ring-2 sm:ring-4 ring-indigo-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {selectedColor === color && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center"
                        >
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-md" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  {selectedSize && (
                    <span className="text-xs sm:text-sm text-gray-500">
                      Selected:{" "}
                      <span className="font-medium">{selectedSize}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-lg border transition-all ${
                        selectedSize === size
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col space-y-4 sm:space-y-6">
                {/* Quantity Selector */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3">
                    Quantity
                  </h3>
                  <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <motion.button
                      onClick={() => handleQuantityChange("minus")}
                      className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      disabled={quantity <= 1}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    <div className="px-4 sm:px-6 py-2 sm:py-3 text-gray-900 font-medium bg-gray-50 border-x border-gray-200 min-w-[40px] text-center">
                      {quantity}
                    </div>
                    <motion.button
                      onClick={() => handleQuantityChange("plus")}
                      className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isButtonDisabled}
                    className={`sm:col-span-3 flex items-center justify-center py-3 px-6 rounded-xl font-medium shadow-sm transition-all ${
                      isButtonDisabled
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                    whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
                  >
                    {isButtonDisabled ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="flex items-center"
                      >
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        <span>Adding...</span>
                      </motion.div>
                    ) : (
                      <div className="flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        <span>Add to Cart</span>
                      </div>
                    )}
                  </motion.button>

                  <motion.button
                    className="sm:col-span-1 flex items-center justify-center py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="h-5 w-5" />
                    <span className="sr-only md:not-sr-only md:ml-2">Save</span>
                  </motion.button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 sm:mt-8 border-t border-gray-100 pt-4 sm:pt-6">
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    Free shipping on orders over Rs.4000
                  </li>
                  <li className="flex items-center text-xs sm:text-sm text-gray-600">
                    <RefreshCw className="h-4 w-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    30-day easy returns
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Description shown on small devices only - Mobile Optimized */}
        <div className="block sm:hidden border-t border-gray-100 px-4 py-4">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-base font-medium mb-2">Description</h3>
            <p className="text-sm text-gray-600">
              {selectedProduct.description}
            </p>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="border-t border-gray-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Mobile Tabs */}
          <div className="overflow-x-auto sm:hidden pb-2">
            <div className="inline-flex min-w-full border-b border-gray-200">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeTab === "details"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeTab === "specs"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Specs
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeTab === "shipping"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Shipping
              </button>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === "details"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === "specs"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === "shipping"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>

          <div className="py-4 sm:py-6">
            {activeTab === "details" && (
              <div className="prose prose-sm sm:prose max-w-none">
                <p>{selectedProduct.description}</p>
                <p>
                  Experience premium quality with our {selectedProduct.name},
                  designed with attention to detail and comfort in mind.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                    Materials & Construction
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">
                        {selectedProduct.brand || "Premium Brand"}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Material</span>
                      <span className="font-medium">
                        {selectedProduct.material || "Premium Material"}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Made in</span>
                      <span className="font-medium">Sri Lanka</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                    Fit & Sizing
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">
                        {selectedProduct.category || "Fashion"}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Gender</span>
                      <span className="font-medium">
                        {selectedProduct.gender || "Unisex"}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Available Sizes</span>
                      <span className="font-medium">
                        {selectedProduct.sizes.join(", ")}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="prose prose-sm sm:prose max-w-none">
                <h3 className="font-semibold">Shipping Policy</h3>
                <p className="text-gray-600">
                  We offer free shipping on all orders above Rs.4000. Standard
                  shipping takes 3-5 business days.
                </p>

                <h3 className="font-semibold">Return Policy</h3>
                <p className="text-gray-600">
                  We accept returns within 30 days of purchase. Items must be in
                  original condition with tags attached.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        <div className="border-t border-gray-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-10">
            You May Also Like
          </h2>
          <ProductGrid
            products={similarProducts?.slice(0, 4)}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
