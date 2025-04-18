import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdDelete,
  MdLocalShipping,
  MdCheckCircle,
} from "react-icons/md";
import { toast } from "sonner";
import {
  fetchDesignDetailsAdmin,
  updateDesignStatus,
  deleteDesignAdmin,
  resetAdminDesignState,
} from "../../redux/slices/adminCustomDesignSlice";

const AdminCustomOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate("/admin/customized-orders");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Front Design
                </h3>
                <div className="bg-gray-100 rounded-lg p-2">
                  <img
                    src={design.frontImageUrl}
                    alt="Front Design"
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Back Design
                </h3>
                <div className="bg-gray-100 rounded-lg p-2">
                  <img
                    src={design.backImageUrl}
                    alt="Back Design"
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Design Elements
            </h2>

            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Front Elements
              </h3>
              {design.designs.front && design.designs.front.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {design.designs.front.map((element, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {element.name || `Element ${index + 1}`}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-600">
                          Position: x={element.position?.x?.toFixed(2) || "N/A"}
                          , y={element.position?.y?.toFixed(2) || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Scale: {element.scale?.toFixed(2) || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Rotation: {element.rotation?.toFixed(2) || "N/A"}°
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No front elements found.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Back Elements
              </h3>
              {design.designs.back && design.designs.back.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {design.designs.back.map((element, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {element.name || `Element ${index + 1}`}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-600">
                          Position: x={element.position?.x?.toFixed(2) || "N/A"}
                          , y={element.position?.y?.toFixed(2) || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Scale: {element.scale?.toFixed(2) || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Rotation: {element.rotation?.toFixed(2) || "N/A"}°
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No back elements found.</p>
              )}
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
