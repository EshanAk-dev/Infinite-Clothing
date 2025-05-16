import { LogOut, User, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { fetchUserOrders } from "../redux/slices/orderSlice";

import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Truck, 
  Box 
} from "lucide-react";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=profile");
    } else {
      dispatch(fetchUserOrders());
    }
  }, [user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Box className="h-4 w-4 text-blue-500" />;
      case "Shipped":
        return <Truck className="h-4 w-4 text-indigo-500" />;
      case "Out_for_Delivery":
        return <Truck className="h-4 w-4 text-orange-500" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Out_for_Delivery":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-100";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-100";
      case "pending COD":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "failed":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={32} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-indigo-100">{user?.role}</p>
                  </div>
                </div>
              </div>
             
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail size={18} className="text-gray-400" />
                  <span>{user?.email}</span>
                </div>
               
                <div className="pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 py-2.5 px-4 rounded-lg font-medium transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
           
            {/* Additional profile sections can be added here */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-medium text-lg mb-4">Account Settings</h3>
              <ul className="space-y-3">
                <li className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer">Change Password</li>
                <li className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer">Payment Methods</li>
              </ul>
            </div>
          </div>
         
          {/* Orders Section */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center">
                      <Package className="mr-2 h-5 w-5 text-indigo-600" />
                      My Orders
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">View and manage your order history</p>
                  </div>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-600 font-medium">
                      {orders?.length || 0} {orders?.length === 1 ? "order" : "orders"} found
                    </p>
                  </div>
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-red-700">Error loading orders: {error}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table Layout */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
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
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {orders && orders.length > 0 ? (
                            orders.map((order) => (
                              <tr
                                key={order._id}
                                onClick={() => handleRowClick(order._id)}
                                className="hover:bg-indigo-50 cursor-pointer transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img
                                        className="h-10 w-10 rounded-lg object-cover shadow-sm border border-gray-100"
                                        src={
                                          order.orderItems[0]?.image ||
                                          "/placeholder-product.jpg"
                                        }
                                        alt={order.orderItems[0]?.name}
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        #{order._id.slice(-8)}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {order.shippingAddress?.city || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {order.orderItems.length}{" "}
                                    {order.orderItems.length === 1 ? "item" : "items"}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {order.orderItems[0]?.name?.substring(0, 20)}
                                    {order.orderItems[0]?.name?.length > 20 ? "..." : ""}
                                    {order.orderItems.length > 1 ? ` +${order.orderItems.length - 1} more` : ""}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    Rs. {parseFloat(order.totalPrice).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {order.paymentMethod}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}
                                  >
                                    {order.paymentStatus === "paid" ? (
                                      <span className="flex items-center">
                                        <CheckCircle className="mr-1 h-3 w-3" /> Paid
                                      </span>
                                    ) : order.paymentStatus === "pending COD" ? (
                                      <span className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3" /> Pending COD
                                      </span>
                                    ) : order.paymentStatus === "failed" ? (
                                      <span className="flex items-center">
                                        <XCircle className="mr-1 h-3 w-3" /> Failed
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3" /> Pending
                                      </span>
                                    )}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${getStatusColor(order.status)}`}
                                  >
                                    <span className="flex items-center">
                                      {getStatusIcon(order.status)}
                                      <span className="ml-1">
                                        {order.status === "Out_for_Delivery" ? "Out For Delivery" : order.status}
                                      </span>
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                  <Package className="h-16 w-16 mb-4 text-gray-300" />
                                  <p className="text-xl font-medium text-gray-500">No orders yet</p>
                                  <p className="text-sm mt-2 text-gray-400 max-w-md">
                                    When you place an order, it will appear here for you to track and manage
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-4 p-4">
                      {orders && orders.length > 0 ? (
                        orders.map((order) => (
                          <div
                            key={order._id}
                            onClick={() => handleRowClick(order._id)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-indigo-200 transition-colors"
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                                    Order #{order._id.slice(-8)}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString()} •{" "}
                                    {new Date(order.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${getStatusColor(order.status)}`}
                                >
                                  <span className="flex items-center">
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1">
                                      {order.status === "Out_for_Delivery" ? "Out For Delivery" : order.status}
                                    </span>
                                  </span>
                                </span>
                              </div>

                              <div className="mt-4 flex items-center">
                                <img
                                  className="h-12 w-12 rounded-lg object-cover shadow-sm border border-gray-100"
                                  src={
                                    order.orderItems[0]?.image || "/placeholder-product.jpg"
                                  }
                                  alt={order.orderItems[0]?.name}
                                />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {order.orderItems.length}{" "}
                                    {order.orderItems.length === 1 ? "item" : "items"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {order.shippingAddress?.city || "N/A"}
                                  </p>
                                </div>
                                <div className="ml-auto text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    Rs. {parseFloat(order.totalPrice).toFixed(2)}
                                  </p>
                                  <span
                                    className={`px-2 py-0.5 mt-1 inline-flex text-xs leading-4 font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}
                                  >
                                    {order.paymentStatus === "paid" ? (
                                      <span className="flex items-center">
                                        <CheckCircle className="mr-1 h-2 w-2" /> Paid
                                      </span>
                                    ) : order.paymentStatus === "pending COD" ? (
                                      <span className="flex items-center">
                                        <Clock className="mr-1 h-2 w-2" /> COD
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <Clock className="mr-1 h-2 w-2" /> Pending
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                          <Package className="mx-auto h-16 w-16 text-gray-300" />
                          <h3 className="mt-4 text-xl font-medium text-gray-700">
                            No orders yet
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            When you place an order, it will appear here for you to track and manage
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;