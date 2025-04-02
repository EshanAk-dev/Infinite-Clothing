import { LogOut, User, Mail } from "lucide-react";
import MyOrdersPage from "./MyOrdersPage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="w-full lg:w-1/3">
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
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Your Orders</h2>
                <p className="text-sm text-gray-500 mt-1">View and manage your order history</p>
              </div>
              <div className="p-6">
                <MyOrdersPage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;