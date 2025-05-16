import { MdCheckCircle, MdVisibility, MdDelete, MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../redux/slices/adminOrderSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ordersPerPage = isMobile ? 4 : 6;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    const orderId = order._id.slice(-8).toLowerCase();
    return searchQuery === "" || orderId.includes(searchQuery.toLowerCase());
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
      toast.success("Order deleted successfully!", {
        style: {
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
          borderRadius: "8px",
          padding: "16px",
        },
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Out_for_Delivery':
        return 'bg-teal-100 text-teal-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mobile card view
  const renderMobileCards = () => {
    if (currentOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-500 text-center px-4">
            {searchQuery ? "No matching orders found" : "No orders found"}
          </p>
          <p className="text-gray-400 text-center px-4">
            {searchQuery ? "Try a different search term" : "All orders will appear here"}
          </p>
        </div>
      );
    }

    return currentOrders.map((order) => (
      <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</div>
              <div className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex space-x-1">
              <Link
                to={`/admin/orders/${order._id}`}
                className="text-blue-600 p-1 rounded-md hover:bg-blue-50"
                title="View Details"
              >
                <MdVisibility className="h-5 w-5" />
              </Link>
              <button
                onClick={() => handleStatusChange(order._id, "Delivered")}
                className="text-green-600 p-1 rounded-md hover:bg-green-50"
                title="Mark as Delivered"
              >
                <MdCheckCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeleteOrder(order._id)}
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
                {order.user?.name?.charAt(0).toUpperCase() || 'C'}
              </span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {order.user?.name || 'Customer'}
              </div>
              <div className="text-xs text-gray-500">
                {order.user?.email || ''}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-sm font-medium text-gray-900">Order Total</div>
              <div className="text-xs text-gray-500">
                {order.orderItems.length} items
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Rs.{order.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              className={`w-full text-sm ${getStatusColor(order.status)} rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 border-transparent`}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out_for_Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              order.paymentStatus === 'paid' 
                ? 'bg-green-100 text-green-800'
                : order.paymentStatus === 'pending COD'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.paymentStatus === 'paid' ? 'Paid' : 
              order.paymentStatus === 'pending COD' ? 'Pending COD' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">Order Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage customer orders and fulfillment</p>
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
      <div className="md:hidden">
        {renderMobileCards()}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {order.user?.name?.charAt(0).toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.name || 'Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user?.email || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs.{order.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.orderItems.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'pending COD'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 
                        order.paymentStatus === 'pending COD' ? 'Pending COD' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-sm ${getStatusColor(order.status)} rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500 border-transparent`}
                      >
                        <option value="Processing" className="bg-yellow-100 text-yellow-800">Processing</option>
                        <option value="Shipped" className="bg-blue-100 text-blue-800">Shipped</option>
                        <option value="Out_for_Delivery" className="bg-teal-100 text-teal-800">Out for Delivery</option>
                        <option value="Delivered" className="bg-green-100 text-green-800">Delivered</option>
                        <option value="Cancelled" className="bg-red-100 text-red-800">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <MdVisibility className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleStatusChange(order._id, "Delivered")}
                          className="text-green-600 hover:text-green-900 p-2 rounded-md hover:bg-green-50 transition-colors"
                          title="Mark as Delivered"
                        >
                          <MdCheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
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
                  <td className="px-6 py-4 text-center text-gray-500" colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="mt-4 text-lg font-medium text-gray-500">
                        {searchQuery ? "No matching orders found" : "No orders found"}
                      </p>
                      <p className="text-gray-400">
                        {searchQuery ? "Try a different search term" : "All orders will appear here"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {filteredOrders.length > 0 && (
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
            {Array.from({ length: totalPages }, (_, index) => {
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
                (isMobile && (index + 1 === currentPage - 2 || index + 1 === currentPage + 2)) &&
                (index + 1 > 1 && index + 1 < totalPages)
              ) {
                return <span key={index + 1} className="flex items-center px-2">...</span>;
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
    </div>
  );
};

export default OrderManagement;