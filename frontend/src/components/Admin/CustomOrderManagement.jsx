import {
  MdCheckCircle,
  MdVisibility,
  MdDelete,
  MdSearch,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAllDesigns,
  updateDesignStatus,
  deleteDesignAdmin,
} from "../../redux/slices/adminCustomDesignSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteConfirmationModal from "../../components/Common/DeleteConfirmationModal";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";

const CustomOrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    allDesigns: designs,
    loading,
    error,
  } = useSelector((state) => state.adminCustomDesign);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const designsPerPage = isMobile ? 4 : 6;
  const {
    isModalOpen,
    deleteConfig,
    openDeleteModal,
    closeDeleteModal,
    setLoading,
  } = useDeleteConfirmation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter designs based on search query (by last 8 chars of _id)
  const filteredDesigns = designs.filter((design) => {
    const designId = design._id.slice(-8).toLowerCase();
    return searchQuery === "" || designId.includes(searchQuery.toLowerCase());
  });

  const indexOfLastDesign = currentPage * designsPerPage;
  const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
  const currentDesigns = filteredDesigns
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(indexOfFirstDesign, indexOfLastDesign);

  const totalPages = Math.ceil(filteredDesigns.length / designsPerPage);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top on mobile when changing pages
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllDesigns());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (designId, status) => {
    dispatch(updateDesignStatus({ id: designId, status }));
    toast.success("Custom order status updated successfully!", {
      style: {
        background: "#ecfdf5",
        color: "#065f46",
        border: "1px solid #6ee7b7",
        borderRadius: "8px",
        padding: "16px",
      },
    });
  };

  const handleDeleteDesign = (designId) => {
    openDeleteModal({
      title: "Delete Custom Design Order",
      message:
        "Are you sure you want to delete this custom design order? This action cannot be undone.",
      itemName: `#${designId.slice(-8)}`,
      confirmText: "Delete Order",
      onConfirm: async () => {
        setLoading(true);
        try {
          await dispatch(deleteDesignAdmin(designId));
          toast.success("Custom design order deleted successfully!", {
            style: {
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #6ee7b7",
              borderRadius: "8px",
              padding: "16px",
            },
          });
        } catch (error) {
          toast.error("Failed to delete custom design order.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Render card view for mobile
  const renderMobileCards = () => {
    if (currentDesigns.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-500 text-center px-4">
            {searchQuery
              ? "No matching custom design orders found"
              : "No custom design orders found"}
          </p>
          <p className="text-gray-400 text-center px-4">
            {searchQuery
              ? "Try a different search term"
              : "All custom design orders will appear here"}
          </p>
        </div>
      );
    }

    return currentDesigns.map((design) => (
      <div
        key={design._id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-900">
                #{design._id.slice(-8)}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(design.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex space-x-1">
              <Link
                to={`/admin/custom-orders/${design._id}`}
                className="text-blue-600 p-1 rounded-md hover:bg-blue-50"
                title="View Details"
              >
                <MdVisibility className="h-5 w-5" />
              </Link>
              <button
                onClick={() => handleStatusChange(design._id, "Delivered")}
                className="text-green-600 p-1 rounded-md hover:bg-green-50"
                title="Mark as Delivered"
              >
                <MdCheckCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeleteDesign(design._id)}
                className="text-red-600 p-1 rounded-md hover:bg-red-50"
                title="Delete Order"
              >
                <MdDelete className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {design.user?.name?.charAt(0).toUpperCase() || "C"}
              </span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {design.user?.name || "Customer"}
              </div>
              <div className="text-xs text-gray-500">
                {design.user?.email || "No email provided"}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Order Details
              </div>
              <div className="text-xs text-gray-500">
                {design.color} | Qty: {design.quantity}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Rs.{design.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={design.status}
              onChange={(e) => handleStatusChange(design._id, e.target.value)}
              className={`w-full text-sm ${getStatusColor(
                design.status
              )} rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 border-transparent`}
            >
              <option value="Processing">Processing</option>
              <option value="Approved">Approved</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">
            Custom Design Orders
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage custom design orders and fulfillment
          </p>
        </div>
        {/* Search input */}
        <div className="relative w-full sm:w-auto sm:min-w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by order ID (#xxxxxxxx)"
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">{renderMobileCards()}</div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Design Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDesigns.length > 0 ? (
                currentDesigns.map((design) => (
                  <tr
                    key={design._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{design._id.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(design.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {design.user?.name?.charAt(0).toUpperCase() || "C"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {design.user?.name || "Customer"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {design.user?.email || "No email provided"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs.{design.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {design.color} | Qty: {design.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={design.status}
                        onChange={(e) =>
                          handleStatusChange(design._id, e.target.value)
                        }
                        className={`text-sm ${getStatusColor(
                          design.status
                        )} rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500 border-transparent`}
                      >
                        <option
                          value="Processing"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Processing
                        </option>
                        <option
                          value="Approved"
                          className="bg-blue-100 text-blue-800"
                        >
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
                        <option
                          value="Cancelled"
                          className="bg-red-100 text-red-800"
                        >
                          Cancelled
                        </option>
                        <option
                          value="Rejected"
                          className="bg-red-100 text-red-800"
                        >
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/custom-orders/${design._id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <MdVisibility className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() =>
                            handleStatusChange(design._id, "Delivered")
                          }
                          className="text-green-600 hover:text-green-900 p-2 rounded-md hover:bg-green-50 transition-colors"
                          title="Mark as Delivered"
                        >
                          <MdCheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDesign(design._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete Order"
                        >
                          <MdDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="mt-4 text-lg font-medium text-gray-500">
                        {searchQuery
                          ? "No matching custom design orders found"
                          : "No custom design orders found"}
                      </p>
                      <p className="text-gray-400">
                        {searchQuery
                          ? "Try a different search term"
                          : "All custom design orders will appear here"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDesigns.length > 0 && (
        <div className="flex justify-center mt-6 overflow-x-auto pb-2">
          <nav className="inline-flex space-x-1 sm:space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 sm:px-4 py-2 text-sm rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Prev
            </button>

            {/* Show limited page numbers on mobile */}
            {Array.from({ length: totalPages }, (_, index) => {
              // On mobile, show only current page, first, last, and one before/after current
              if (
                !isMobile ||
                index + 1 === 1 ||
                index + 1 === totalPages ||
                index + 1 === currentPage ||
                index + 1 === currentPage - 1 ||
                index + 1 === currentPage + 1
              ) {
                return (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-2 text-sm rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              } else if (
                isMobile &&
                (index + 1 === currentPage - 2 ||
                  index + 1 === currentPage + 2) &&
                index + 1 > 1 &&
                index + 1 < totalPages
              ) {
                // Show ellipsis
                return (
                  <span key={index + 1} className="flex items-center px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-4 py-2 text-sm rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteConfig.onConfirm}
        title={deleteConfig.title}
        message={deleteConfig.message}
        itemName={deleteConfig.itemName}
        confirmText={deleteConfig.confirmText}
        cancelText={deleteConfig.cancelText}
        isLoading={deleteConfig.isLoading}
      />
    </div>
  );
};

export default CustomOrderManagement;
