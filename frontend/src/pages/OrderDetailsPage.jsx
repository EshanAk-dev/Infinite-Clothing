import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  MapPin,
  Calendar,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  // Contact Support via WhatsApp function
  const contactSupport = () => {
    if (!orderDetails) return;

    // Create order-specific message
    const orderNumber = orderDetails._id.slice(-8).toUpperCase();
    const message = `Order #${orderNumber}\nHi, I need help with my order.`;
    const phone = "94710701158"; // Support phone number
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(url, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-indigo-600 font-medium">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700 font-medium">
              Error loading order: {error}
            </p>
          </div>
          <Link
            to="/my-orders"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Order not found state
  if (!orderDetails) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 mt-12">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <div className="bg-gray-50 p-6 inline-flex rounded-full mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Order not found</h3>
          <p className="mt-2 text-gray-500">
            We couldn't find details for this order
          </p>
          <Link
            to="/my-orders"
            className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Format the order ID for display
  const formattedOrderId = orderDetails._id.slice(-8).toUpperCase();

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-20">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          to="/my-orders"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to My Orders
        </Link>
      </div>

      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Order #{formattedOrderId}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>
              {formatDate(orderDetails.createdAt)} at{" "}
              {formatTime(orderDetails.createdAt)}
            </span>
          </div>
          <div className="flex gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                orderDetails.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : orderDetails.paymentStatus === "pending COD"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {orderDetails.paymentStatus === "paid" ? (
                <>
                  <CheckCircle className="mr-1 h-3.5 w-3.5" /> Paid
                </>
              ) : orderDetails.paymentStatus === "pending COD" ? (
                <>
                  <Clock className="mr-1 h-3.5 w-3.5" /> Pending COD
                </>
              ) : (
                <>
                  <Clock className="mr-1 h-3.5 w-3.5" /> Payment Pending
                </>
              )}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                orderDetails.isDelivered
                  ? "bg-green-100 text-green-800"
                  : "bg-indigo-100 text-indigo-800"
              }`}
            >
              {orderDetails.isDelivered ? (
                <>
                  <CheckCircle className="mr-1 h-3.5 w-3.5" /> Delivered
                </>
              ) : (
                <>
                  <Truck className="mr-1 h-3.5 w-3.5" /> Shipping
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items - Left Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {/* Order Items Header */}
            <div className="p-6 border-b border-gray-100 flex items-center">
              <ShoppingBag className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
            </div>

            {/* Items List */}
            <div className="p-6">
              <div className="space-y-6">
                {orderDetails.orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row sm:items-center pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center flex-grow mb-4 sm:mb-0">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center mt-1.5 text-sm text-gray-500">
                          <span className="mr-2">Qty: {item.quantity}</span>
                          <span>Price: Rs. {item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-base font-medium text-gray-900">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-indigo-600">
                      Rs. {orderDetails.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="bg-green-50 rounded-2xl mt-5 p-6 flex flex-col items-center text-center">
  <h4 className="font-medium text-green-900 mb-2">
    Need help with your order?
  </h4>
  <p className="text-sm text-green-700 mb-4">
    Our customer support team is here to help you with any questions
    about your order.
  </p>
  <button
    onClick={contactSupport}
    className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
  >
    <MessageCircle className="h-5 w-5 mr-2" />
    Contact via WhatsApp
  </button>
</div>
        </div>

        {/* Order Details - Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center">
              <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Payment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-medium text-gray-900">
                  {orderDetails.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    orderDetails.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {orderDetails.paymentStatus === "pending COD"
                    ? "Pending COD"
                    : orderDetails.paymentStatus === "paid"
                    ? "Paid"
                    : "Pending"}
                </span>
              </div>
              {orderDetails.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid on</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(orderDetails.paidAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center">
              <Truck className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Shipping</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-gray-600 block mb-2">Address</span>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900">
                    {orderDetails.shippingAddress.address},<br />
                    {orderDetails.shippingAddress.city},<br />
                    {orderDetails.shippingAddress.postalCode},<br />
                    {orderDetails.shippingAddress.country}
                  </span>
                </div>
              </div>
              {orderDetails.isDelivered && orderDetails.deliveredAt && (
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-600">Delivered on</span>
                  <span className="font-medium text-green-600">
                    {formatDate(orderDetails.deliveredAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Tracking Timeline */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center">
              <Clock className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Placed */}
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Order Placed</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(orderDetails.createdAt)}
                  </p>
                </div>
              </div>

              {/* Payment Confirmed */}
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`${
                      orderDetails.paymentStatus === "paid"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } rounded-full h-8 w-8 flex items-center justify-center`}
                  >
                    {orderDetails.paymentStatus === "paid" ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Clock className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Payment{" "}
                    {orderDetails.paymentStatus === "paid"
                      ? "Confirmed"
                      : "Pending"}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {orderDetails.paymentStatus === "paid" &&
                    orderDetails.paidAt
                      ? formatDate(orderDetails.paidAt)
                      : "Awaiting payment confirmation"}
                  </p>
                </div>
              </div>

              {/* Shipped */}
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`${
                      orderDetails.isDelivered ? "bg-green-500" : "bg-gray-300"
                    } rounded-full h-8 w-8 flex items-center justify-center`}
                  >
                    {orderDetails.isDelivered ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Truck className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Shipped</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {orderDetails.isDelivered
                      ? "Your order has been shipped"
                      : "Preparing for shipment"}
                  </p>
                </div>
              </div>

              {/* Delivered */}
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`${
                      orderDetails.isDelivered ? "bg-green-500" : "bg-gray-300"
                    } rounded-full h-8 w-8 flex items-center justify-center`}
                  >
                    {orderDetails.isDelivered ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Clock className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Delivered</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {orderDetails.isDelivered && orderDetails.deliveredAt
                      ? formatDate(orderDetails.deliveredAt)
                      : "Your order is on the way"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
