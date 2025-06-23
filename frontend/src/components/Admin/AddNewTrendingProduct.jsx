import { useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTrendingProduct } from "../../redux/slices/adminProductSlice";
import axios from "axios";
import { toast } from "sonner"; // Import toast notification

const AddNewTrendingProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.adminProducts);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
    isFeatured: false,
    isPublished: false,
    tags: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    weight: 0,
    user: user?._id,
  });

  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // For mobile tabs navigation

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="w-full px-4 sm:max-w-7xl sm:mx-auto p-4 sm:p-6">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      dimensions: {
        ...prevData.dimensions,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];

    try {
      setUploading(true);
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        uploadedImages.push({ url: data.imageUrl, altText: "" });
      }

      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...uploadedImages],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...productData.images];
    updatedImages.splice(index, 1);
    setProductData({ ...productData, images: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTrendingProduct(productData))
      .unwrap()
      .then(() => {
        toast.success("Trending product added successfully!", {
          style: {
            background: "#f3e8ff",
            color: "#581c87",
            border: "1px solid #c084fc",
            borderRadius: "8px",
            padding: "16px",
          },
        });
        navigate("/admin/trendings");
      })
      .catch((err) => {
        toast.error("Failed to add trending product!", {
          style: {
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "16px",
          },
          icon: "⚠️",
        });
        console.error(err);
      });
  };

  // Tab navigation for mobile
  const renderTabSelector = () => {
    const tabs = [
      { id: "basic", label: "Basic" },
      { id: "categories", label: "Categories" },
      { id: "variants", label: "Variants" },
      { id: "images", label: "Images" },
      { id: "shipping", label: "Shipping" },
      { id: "seo", label: "SEO" },
      { id: "status", label: "Status" },
    ];

    return (
      <div className="lg:hidden overflow-x-auto scrollbar-hide mb-6">
        <div className="flex space-x-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:max-w-7xl sm:mx-auto py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-3 sm:mb-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Add New Trending Product
          </h2>
          <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
            🔥 TRENDING
          </span>
        </div>
        <button
          onClick={() => navigate("/admin/trendings")}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to Trendings
        </button>
      </div>

      {/* Trending Product Info Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">🔥</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">
              Creating a Trending Product
            </h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>
                This product will be automatically marked as trending and will
                appear in the trending products section on website.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tab selector */}
      {renderTabSelector()}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 p-4 sm:p-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div
                className={`border border-gray-200 rounded-lg p-4 ${
                  activeTab !== "basic" && "lg:block hidden"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    rows={4}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price*
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        Rs.
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Old Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        Rs.
                      </span>
                      <input
                        type="number"
                        name="discountPrice"
                        value={productData.discountPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU*
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={productData.sku}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity*
                    </label>
                    <input
                      type="number"
                      name="countInStock"
                      value={productData.countInStock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div
                className={`border border-gray-200 rounded-lg p-4 ${
                  activeTab !== "categories" && "lg:block hidden"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Categories
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category*
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collections
                  </label>
                  <input
                    type="text"
                    name="collections"
                    value={productData.collections}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={productData.material}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={productData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Variants */}
              <div
                className={`border border-gray-200 rounded-lg p-4 ${
                  activeTab !== "variants" && "lg:block hidden"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Variants
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes* (comma separated)
                  </label>
                  <input
                    type="text"
                    name="sizes"
                    value={productData.sizes.join(", ")}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        sizes: e.target.value
                          .split(",")
                          .map((size) => size.trim()),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colors* (comma separated)
                  </label>
                  <input
                    type="text"
                    name="colors"
                    value={productData.colors.join(", ")}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        colors: e.target.value
                          .split(",")
                          .map((color) => color.trim()),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={productData.tags.join(", ")}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Images */}
              <div
                className={`border border-gray-200 rounded-lg p-4 ${
                  activeTab !== "images" && "lg:block hidden"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Images
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (Multiple)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-28 sm:h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50">
                      <div className="flex flex-col items-center justify-center pt-5 sm:pt-7">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="pt-1 text-xs sm:text-sm text-purple-600">
                          Click to upload or drag and drop
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        multiple
                        className="opacity-0"
                      />
                    </label>
                  </div>
                  {uploading && (
                    <div className="mt-2 text-sm text-purple-600 flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading images...
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image.url}
                        alt={image.altText || "Product image"}
                        className="w-full h-24 sm:h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-100 group-hover:opacity-100 transition-opacity lg:opacity-0"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div
                className={`border border-gray-200 rounded-lg p-4 ${
                  activeTab !== "shipping" && "lg:block hidden"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Shipping Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      name="length"
                      value={productData.dimensions.length}
                      onChange={handleDimensionChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      name="width"
                      value={productData.dimensions.width}
                      onChange={handleDimensionChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={productData.dimensions.height}
                      onChange={handleDimensionChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={productData.weight}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* SEO */}
              <div
                className={`border border-gray-200 rounded-lg p-4 ${
                  activeTab !== "seo" && "lg:block hidden"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  SEO Information
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={productData.metaTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={productData.metaDescription}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={productData.metaKeywords}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div
                className={`border border-gray-200 rounded-lg p-4 ${
                  activeTab !== "status" && "lg:block hidden"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Status
                </h3>

                {/* Trending Status - Always True */}
                <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔥</span>
                    <div>
                      <span className="block text-sm font-medium text-purple-800">
                        Trending Product
                      </span>
                      <span className="text-xs text-purple-600">
                        This product will be marked as trending automatically
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={productData.isFeatured}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-3 block text-sm text-gray-700"
                  >
                    Featured Product
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={productData.isPublished}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        isPublished: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPublished"
                    className="ml-3 block text-sm text-gray-700"
                  >
                    Publish Product
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Fixed at bottom on mobile */}
          <div className="p-4 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 sticky bottom-0">
            <button
              type="button"
              onClick={() => navigate("/admin/trendings")}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <MdAdd className="-ml-1 mr-2 h-5 w-5" />
              Add Trending Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewTrendingProduct;
