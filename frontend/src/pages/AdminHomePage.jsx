import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { fetchAllDesigns } from "../redux/slices/adminCustomDesignSlice";
import { FiPackage, FiShoppingCart } from "react-icons/fi";
import { FaTshirt } from "react-icons/fa";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);
  const {
    allDesigns: customDesigns,
    loading: customDesignsLoading,
    error: customDesignsError,
  } = useSelector((state) => state.adminCustomDesign);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchAllDesigns());
  }, [dispatch]);

  if (productsLoading || ordersLoading || customDesignsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (productsError || ordersError || customDesignsError) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          {productsError && <p>Products: {productsError}</p>}
          {ordersError && <p>Orders: {ordersError}</p>}
          {customDesignsError && <p>Custom Designs: {customDesignsError}</p>}
        </div>
      </div>
    );
  }

  // Get recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Overview of your store performance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {/* Revenue Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Total Revenue
              </p>
              <h3 className="text-lg sm:text-2xl font-bold mt-1 text-gray-800">
                Rs.
                {totalSales.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="p-2 sm:p-3 ml-2 lg:mt-0 rounded-lg bg-blue-100 text-blue-600">
              <span className="text-xl sm:text-2xl font-bold">LKR</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Total Orders
              </p>
              <h3 className="text-lg sm:text-2xl font-bold mt-1 text-gray-800">
                {totalOrders}
              </h3>
              <Link
                to="/admin/orders"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                View all orders
              </Link>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-green-100 text-green-600">
              <FiShoppingCart className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Total Products
              </p>
              <h3 className="text-lg sm:text-2xl font-bold mt-1 text-gray-800">
                {products.length}
              </h3>
              <Link
                to="/admin/products"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                Manage products
              </Link>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-purple-100 text-purple-600">
              <FiPackage className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        {/* Custom Orders Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Total Custom Orders
              </p>
              <h3 className="text-lg sm:text-2xl font-bold mt-1 text-gray-800">
                {customDesigns.length}
              </h3>
              <Link
                to="/admin/custom-orders"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                Manage custom orders
              </Link>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-orange-100 text-orange-600">
              <FaTshirt className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 hidden xs:block">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-xs sm:text-sm">
                            {order.user?.name?.charAt(0).toUpperCase() || "C"}
                          </span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {order.user?.name || "Customer"}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {order.user?.email || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900">
                        Rs.{order.totalPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-3 sm:px-6 py-3 sm:py-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                      <svg
                        className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400"
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
                      <p className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-500">
                        No recent orders
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 text-right">
          <Link
            to="/admin/orders"
            className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-900"
          >
            View all orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
