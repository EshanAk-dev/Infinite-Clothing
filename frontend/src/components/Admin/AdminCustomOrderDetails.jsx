import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdDelete,
  MdLocalShipping,
  MdCheckCircle,
  MdClose,
} from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "sonner";
import {
  fetchDesignDetailsAdmin,
  updateDesignStatus,
  deleteDesignAdmin,
  resetAdminDesignState,
} from "../../redux/slices/adminCustomDesignSlice";
import DesignSidePreview from "../Customize T-Shirts/DesignSidePreview";

const AdminCustomOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [popupImage, setPopupImage] = useState(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const scrollRef = useRef(null);

  const {
    currentDesign: design,
    loading,
    error,
    success,
    deleteSuccess,
  } = useSelector((state) => state.adminCustomDesign);
  const { user } = useSelector((state) => state.auth);

  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchDesignDetailsAdmin(id));
      return () => {
        dispatch(resetAdminDesignState());
      };
    }
  }, [id, dispatch, user, navigate]);

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
  }, [design]);

  useEffect(() => {
    if (success && statusUpdating) {
      toast.success("Order status updated successfully!", {
        style: {
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
          borderRadius: "8px",
          padding: "16px",
        },
      });
      setStatusUpdating(false);
    }
  }, [success, statusUpdating]);

  useEffect(() => {
    if (deleteSuccess) {
      navigate("/admin/custom-orders");
      toast.success("Custom order deleted successfully!", {
        style: {
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
          borderRadius: "8px",
          padding: "16px",
        },
      });
    }
  }, [deleteSuccess, navigate]);

  const handleDeleteDesign = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this custom design order?"
      )
    ) {
      dispatch(deleteDesignAdmin(id));
    }
  };

  const handleStatusChange = (status) => {
    setStatusUpdating(true);
    dispatch(updateDesignStatus({ id, status }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800";
      case "Out for Delivery":
        return "bg-teal-100 text-teal-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount =
      direction === "left"
        ? -container.offsetWidth * 0.8
        : container.offsetWidth * 0.8;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!design)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-bold">Design not found</p>
          <p>The requested custom design could not be found.</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Image Popup */}
      {popupImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setPopupImage(null)}
              aria-label="Close"
            >
              <MdClose className="w-6 h-6" />
            </button>
            <img
              src={popupImage}
              alt="Design Preview"
              className="max-h-[70vh] w-auto rounded"
            />
          </div>
        </div>
      )}

      {/* Back button and top actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Link
          to="/admin/custom-orders"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <MdArrowBack className="mr-2 h-5 w-5" />
          Back to Orders
        </Link>

        <div className="flex space-x-3">
          <button
            onClick={handleDeleteDesign}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <MdDelete className="mr-2 h-5 w-5" />
            Delete Order
          </button>
        </div>
      </div>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Custom Design Order&nbsp;
              <span className="font-mono text-blue-600">
                #{design._id.slice(-8)}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Created on {new Date(design.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-700">Status:</span>
              <select
                value={design.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`text-sm ${getStatusColor(
                  design.status
                )} rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 border-transparent`}
              >
                <option
                  value="Processing"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Processing
                </option>
                <option value="Approved" className="bg-blue-100 text-blue-800">
                  Approved
                </option>
                <option
                  value="Shipped"
                  className="bg-indigo-100 text-indigo-800"
                >
                  Shipped
                </option>

                <option
                  value="Out for Delivery"
                  className="bg-teal-100 text-indigo-800"
                >
                  Out for Delivery
                </option>
                <option
                  value="Delivered"
                  className="bg-green-100 text-green-800"
                >
                  Delivered
                </option>
                <option value="Cancelled" className="bg-red-100 text-red-800">
                  Cancelled
                </option>
                <option value="Rejected" className="bg-red-100 text-red-800">
                  Rejected
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer & Shipping Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Customer Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {design.user?.name?.charAt(0).toUpperCase() || "C"}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {design.user?.name || "Customer"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {design.user?.email || "No email provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Shipping Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {design.shippingAddress.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {design.shippingAddress.phone}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-600">
                  {design.shippingAddress.address}
                </p>
                <p className="text-sm text-gray-600">
                  {design.shippingAddress.city},{" "}
                  {design.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">
                  {design.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Product</span>
                <span className="text-sm font-medium text-gray-900">
                  Custom T-shirt Design
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Color</span>
                <span className="text-sm font-medium text-gray-900">
                  {design.color}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantity</span>
                <span className="text-sm font-medium text-gray-900">
                  {design.quantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Price Per Item</span>
                <span className="text-sm font-medium text-gray-900">
                  Rs. {design.price.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-sm font-medium text-gray-800">
                  Total Amount
                </span>
                <span className="text-sm font-bold text-gray-900">
                  Rs. {design.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Design Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Design Preview
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Swipe or use arrows to view all design sides
            </p>

            {/* Scrollable Design Container */}
            <div className="relative">
              {/* Scroll buttons */}
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? "hover:bg-gray-50 active:bg-gray-100"
                    : "cursor-not-allowed opacity-30"
                }`}
              >
                <FiChevronLeft className="text-xl text-gray-700" />
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? "hover:bg-gray-50 active:bg-gray-100"
                    : "cursor-not-allowed opacity-30"
                }`}
              >
                <FiChevronRight className="text-xl text-gray-700" />
              </button>

              {/* Scrollable content */}
              <div
                ref={scrollRef}
                className="overflow-x-auto flex space-x-8 pb-6 scrollbar-hide snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitScrollbar: { display: "none" },
                }}
              >
                <DesignSidePreview
                  title="Front Design"
                  icon={
                    <svg
                      className="w-5 h-5 mr-2 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  imageUrl={design.frontImageUrl}
                  elements={design.designs.front || []}
                  badgeColor="bg-indigo-100 text-indigo-800"
                  badgeText="elements"
                  delay={0}
                />
                <DesignSidePreview
                  title="Back Design"
                  icon={
                    <svg
                      className="w-5 h-5 mr-2 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  imageUrl={design.backImageUrl}
                  elements={design.designs.back || []}
                  badgeColor="bg-indigo-100 text-indigo-800"
                  badgeText="elements"
                  delay={0.1}
                />
                {design.leftArmImageUrl && (
                  <DesignSidePreview
                    title="Left Arm Design"
                    icon={
                      <svg
                        className="w-5 h-5 mr-2 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2"
                        />
                      </svg>
                    }
                    imageUrl={design.leftArmImageUrl}
                    elements={design.designs?.leftArm || []}
                    badgeColor="bg-purple-100 text-purple-800"
                    badgeText="elements"
                    delay={0.2}
                  />
                )}
                {design.rightArmImageUrl && (
                  <DesignSidePreview
                    title="Right Arm Design"
                    icon={
                      <svg
                        className="w-5 h-5 mr-2 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4zM17 3V1m0 18v2"
                        />
                      </svg>
                    }
                    imageUrl={design.rightArmImageUrl}
                    elements={design.designs?.rightArm || []}
                    badgeColor="bg-orange-100 text-orange-800"
                    badgeText="elements"
                    delay={0.3}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between">
        <Link
          to="/admin/custom-orders"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3 sm:mb-0"
        >
          <MdArrowBack className="mr-2 h-5 w-5" />
          Back to All Orders
        </Link>

        {design.status === "Approved" && (
          <button
            onClick={() => handleStatusChange("Shipped")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <MdLocalShipping className="mr-2 h-5 w-5" />
            Mark as Shipped
          </button>
        )}

        {design.status === "Shipped" && (
          <button
            onClick={() => handleStatusChange("Delivered")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <MdCheckCircle className="mr-2 h-5 w-5" />
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminCustomOrderDetails;