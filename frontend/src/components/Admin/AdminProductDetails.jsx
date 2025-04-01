import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "../Products/ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";

const AdminProductDetails = ({ productId }) => {
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

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // Set main image
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // Set quantity changes
  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Add to Cart function
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a color and size before adding to cart!", {
        duration: 1500,
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
        toast.success("Product added to the cart!", {
          duration: 2000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {selectedProduct && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row p-6">
            {/* Image Gallery */}
            <div className="lg:w-1/2 flex flex-col-reverse lg:flex-row">
              {/* Thumbnails */}
              <div className="hidden lg:flex flex-col space-y-4 mr-4 mt-0">
                {selectedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(image.url)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === image.url
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="w-full lg:flex-1">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Mobile Thumbnails */}
                <div className="lg:hidden flex space-x-2 mt-4 overflow-x-auto py-2">
                  {selectedProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image.url)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        mainImage === image.url
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `Thumbnail ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 lg:pl-8 mt-6 lg:mt-0">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h1>
                
                <div className="flex items-center space-x-3 mb-4">
                  {selectedProduct.discountPrice > selectedProduct.price && (
                    <span className="text-lg text-gray-500 line-through">
                      Rs.{selectedProduct.discountPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xl font-semibold text-gray-900">
                    Rs.{selectedProduct.price.toFixed(2)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                
                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border transition-all ${
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center border border-gray-300 rounded-md w-max">
                    <button
                      onClick={() => handleQuantityChange("minus")}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-gray-900 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("plus")}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isButtonDisabled}
                  className={`w-full flex items-center justify-center py-3 px-6 rounded-md font-medium transition-colors ${
                    isButtonDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <FiShoppingCart className="mr-2 h-5 w-5" />
                  {isButtonDisabled ? "Adding..." : "Add to Cart"}
                </button>
              </div>
              
              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Brand</p>
                    <p className="text-gray-900">{selectedProduct.brand || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Material</p>
                    <p className="text-gray-900">{selectedProduct.material || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="text-gray-900">{selectedProduct.category || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="text-gray-900">{selectedProduct.gender || "Unisex"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar Products */}
          <div className="border-t border-gray-200 px-6 py-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              You May Also Like
            </h2>
            <ProductGrid 
              products={similarProducts} 
              loading={loading} 
              error={error} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetails;