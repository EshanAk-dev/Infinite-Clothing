import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaTshirt,
  FaUser,
  FaHome,
  FaChartLine
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="h-full w-64 bg-gray-800 text-white p-6 flex flex-col">
      {/* Logo and Title */}
      <div className="mb-8">
        <Link 
          to="/admin/dashboard" 
          className="text-2xl font-bold flex items-center space-x-2"
        >
          <span className="bg-blue-600 p-2 rounded-lg">
            <FaHome className="text-white" />
          </span>
          <span>INFINITE</span>
        </Link>
        <p className="text-sm text-gray-400 mt-2">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <FaChartLine className="text-lg" />
          <span>Dashboard</span>
        </NavLink>

        {/* Users */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <FaUser className="text-lg" />
          <span>Users</span>
        </NavLink>

        {/* Products */}
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <FaBoxOpen className="text-lg" />
          <span>Products</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <FaClipboardList className="text-lg" />
          <span>Orders</span>
        </NavLink>

        {/* Customized T-Shirts orders */}
        <NavLink
          to="/admin/customized-orders"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <FaTshirt className="text-lg" />
          <span>Customized Orders</span>
        </NavLink>

        {/* Shop */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <FaStore className="text-lg" />
          <span>Shop</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors shadow hover:shadow-md"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;