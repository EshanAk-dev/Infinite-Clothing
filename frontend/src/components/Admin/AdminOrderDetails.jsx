import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  updateOrderStatus,
  deleteOrder,
} from "../../redux/slices/adminOrderSlice";
import { fetchOrderDetails } from "../../redux/slices/orderSlice";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  // Listen for status update success from adminOrders slice
  const adminOrders = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  // Refetch order details after successful status update
  useEffect(() => {
    if (adminOrders && adminOrders.orders && adminOrders.orders.length > 0) {
      const updatedOrder = adminOrders.orders.find((order) => order._id === id);
      if (updatedOrder) {
        dispatch(fetchOrderDetails(id));
      }
    }
    // eslint-disable-next-line
  }, [adminOrders.orders]);

  const handleStatusChange = (status) => {
    dispatch(updateOrderStatus({ id, status })).then((action) => {
      if (!action.error) {
        toast.success("Order status updated successfully!", {
          style: {
            background: "#ecfdf5",
            color: "#065f46",
            border: "1px solid #6ee7b7",
            borderRadius: "8px",
            padding: "16px",
          },
        });
      }
    });
  };

  const handleDeleteOrder = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
      toast.success("Order deleted successfully!", {
        style: {
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
          borderRadius: "8px",
          padding: "16px",
        },
      });
      navigate("/admin/orders");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Out_for_Delivery":
        return "bg-teal-100 text-teal-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
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
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!orderDetails)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No order details found
          </h3>
          <p className="mt-1 text-gray-500">
            The order you're looking for doesn't exist
          </p>
          <Link
            to="/admin/orders"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Order Details
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and view order information
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Link
            to="/admin/orders"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Orders
          </Link>
          <button
            onClick={handleDeleteOrder}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <MdDelete className="mr-2 h-5 w-5" />
            Delete Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Order Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Order{" "}
                <span className="font-mono text-blue-600">
                  #{orderDetails._id.slice(-8).toUpperCase()}
                </span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Placed on{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 space-y-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetails.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : orderDetails.paymentStatus === "pending COD"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {orderDetails.paymentStatus === "paid" ? (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Paid
                  </>
                ) : orderDetails.paymentStatus === "pending COD" ? (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pending COD
                  </>
                ) : (
                  "Payment Pending"
                )}
              </span>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">Status:</span>
                <select
                  value={orderDetails.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-sm ${getStatusColor(
                    orderDetails.status
                  )} rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500 border-transparent`}
                >
                  <option
                    value="Processing"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Processing
                  </option>
                  <option value="Shipped" className="bg-blue-100 text-blue-800">
                    Shipped
                  </option>
                  <option
                    value="Out_for_Delivery"
                    className="bg-teal-100 text-teal-800"
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
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-gray-200">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Customer Information
            </h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700">Name:</span>{" "}
                {orderDetails.shippingAddress?.firstName || "N/A"}{" "}
                {orderDetails.shippingAddress?.lastName || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Email:</span>{" "}
                {orderDetails.user?.email || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Phone:</span>{" "}
                {orderDetails.shippingAddress?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Shipping Information
            </h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700">Method:</span>{" "}
                {orderDetails.shippingMethod || "Standard Shipping"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Address:</span>{" "}
                {`
                ${orderDetails.shippingAddress?.address}, 
                ${orderDetails.shippingAddress?.city}, 
                ${orderDetails.shippingAddress?.postalCode}, 
                ${orderDetails.shippingAddress?.country}
              `}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Payment Information
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Payment Method
                </p>
                <p className="text-sm mt-1">
                  {orderDetails.paymentMethod || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Payment Status
                </p>
                <p className="text-sm mt-1">
                  {orderDetails.isPaid ? (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        orderDetails.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : orderDetails.paymentStatus === "pending COD"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {orderDetails.paymentStatus === "paid" ? (
                        <>
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Paid
                        </>
                      ) : orderDetails.paymentStatus === "pending COD" ? (
                        <>
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Pending COD
                        </>
                      ) : (
                        "Payment Pending"
                      )}
                    </span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </p>
              </div>
              {orderDetails.paidAt && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Paid On</p>
                  <p className="text-sm mt-1">
                    {new Date(orderDetails.paidAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Order Items
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderDetails.orderItems.map((item) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={item.image}
                            alt={item.name}
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {item.name}
                          </Link>
                          {item.color && (
                            <p className="text-xs text-gray-500 mt-1">
                              Color: {item.color}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs.{item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full max-w-md lg:mr-28 space-y-2">
              <div className="flex justify-between pt-2  border-t border-gray-200">
                <span className="text-base font-semibold">Total</span>
                <span className="text-base font-semibold">
                  Rs.{orderDetails.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
