import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../redux/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";
import {
  FiShoppingBag,
  FiRefreshCw,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiGift,
  FiBell,
  FiAlertTriangle,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NotificationDrawer = ({ drawerOpen, toggleDrawer }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount, loading, error } = useSelector(
    (state) => state.notifications
  );

  const [deleteAnimation, setDeleteAnimation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && drawerOpen) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user, drawerOpen]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDeleteNotification = (notificationId) => {
    setDeleteAnimation(notificationId);
    setTimeout(() => {
      dispatch(deleteNotification(notificationId));
      toast.success("Notification deleted");
      setDeleteAnimation(null);
    }, 300);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order_placed":
        return <FiShoppingBag />;
      case "order_processing":
        return <FiRefreshCw />;
      case "order_shipped":
        return <FiTruck />;
      case "order_out_for_delivery":
        return <FiTruck />;
      case "order_delivered":
        return <FiCheckCircle />;
      case "order_cancelled":
        return <FiXCircle />;
      case "promo":
        return <FiGift />;
      default:
        return <FiBell />;
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "order_placed":
        return "bg-blue-100 text-blue-600";
      case "order_processing":
        return "bg-blue-100 text-blue-600";
      case "order_shipped":
        return "bg-purple-100 text-purple-600";
      case "order_out_for_delivery":
        return "bg-teal-100 text-teal-600";
      case "order_delivered":
        return "bg-green-100 text-green-600";
      case "order_cancelled":
        return "bg-red-100 text-red-600";
      case "promo":
        return "bg-pink-100 text-pink-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getOrderStatusChip = (status) => {
    let color, icon;

    switch (status?.toLowerCase()) {
      case "processing":
        color = "text-blue-600 bg-blue-50";
        icon = <FiRefreshCw className="w-3 h-3" />;
        break;
      case "shipped":
        color = "text-purple-600 bg-purple-50";
        icon = <FiTruck className="w-3 h-3" />;
        break;
      case "out_for_delivery":
        color = "text-teal-600 bg-teal-50";
        icon = <FiTruck className="w-3 h-3" />;
        break;
      case "delivered":
        color = "text-green-600 bg-green-50";
        icon = <FiCheckCircle className="w-3 h-3" />;
        break;
      case "cancelled":
        color = "text-red-600 bg-red-50";
        icon = <FiXCircle className="w-3 h-3" />;
        break;
      default:
        color = "text-gray-600 bg-gray-50";
        icon = <FiBell className="w-3 h-3" />;
    }

    return (
      <div
        className={`inline-flex items-center px-2.5 py-1 rounded-md ${color}`}
      >
        {icon}
        <span className="ml-1 text-xs font-medium">{status}</span>
      </div>
    );
  };

  const handleRefresh = () => {
    dispatch(fetchNotifications());
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification._id);
    if (notification.orderId) {
      navigate(`/order/${notification.orderId}`);
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-4 border-b">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <div className="flex space-x-4 items-center">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={toggleDrawer}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoMdClose className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Notification Contents */}
            <div className="flex-grow overflow-y-auto relative">
              {loading ? (
                // Loading state
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-2xl"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                // Error state
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <FiAlertTriangle className="h-16 w-16 text-red-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Failed to load notifications
                  </h3>
                  <p className="text-gray-600 mb-6">Pull down to try again</p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <FiBell className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No notifications yet
                  </h3>
                  <p className="text-gray-600">
                    We'll notify you when something arrives!
                  </p>
                </div>
              ) : (
                // Notifications list
                <motion.div
                  className="p-4 space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      layout
                      animate={
                        deleteAnimation === notification._id
                          ? {
                              x: "100%",
                              opacity: 0,
                            }
                          : {}
                      }
                      className="relative"
                    >
                      {/* Notification card */}
                      <motion.div
                        className={`relative rounded-2xl shadow-sm ${
                          !notification.isRead ? "bg-blue-50" : "bg-white"
                        } overflow-hidden`}
                      >
                        {/* Delete button */}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification._id)
                          }
                          className="absolute bottom-2 right-10 p-1 rounded-full hover:bg-red-100 transition-colors z-10"
                          aria-label="Delete notification"
                        >
                          <FiTrash2 className="text-red-400 h-5 w-5" />
                        </button>
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex">
                            <div
                              className={`h-12 w-12 rounded-xl flex items-center justify-center ${getStatusColor(
                                notification.type
                              )}`}
                            >
                              <span className="text-xl">
                                {getNotificationIcon(notification.type)}
                              </span>
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-semibold text-gray-900">
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">
                                {notification.message}
                              </p>
                              {notification.orderStatus && (
                                <div className="mt-3">
                                  {getOrderStatusChip(notification.orderStatus)}
                                </div>
                              )}
                              {!notification.isRead && (
                                <div className="flex justify-end mt-3">
                                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationDrawer;
