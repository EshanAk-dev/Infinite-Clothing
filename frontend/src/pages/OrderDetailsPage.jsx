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
} from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">Error loading order: {error}</p>
        </div>
        <Link
          to="/my-orders"
          className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to My Orders
        </Link>
      </div>
    );

  if (!orderDetails)
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Order not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find details for this order
          </p>
          <Link
            to="/my-orders"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Orders
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <Link
          to="/my-orders"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to My Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <Package className="mr-2 h-6 w-6 text-indigo-600" />
            Order #{orderDetails._id.substring(0, 8)}...
          </h2>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(orderDetails.createdAt).toLocaleDateString()} at{" "}
            {new Date(orderDetails.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
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
                <CheckCircle className="mr-1 h-4 w-4" /> Paid
              </>
            ) : orderDetails.paymentStatus === "pending COD" ? (
              <>
                <Clock className="mr-1 h-4 w-4" /> Pending COD
              </>
            ) : (
              <>
                <Clock className="mr-1 h-4 w-4" /> Payment Pending
              </>
            )}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              orderDetails.isDelivered
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {orderDetails.isDelivered ? (
              <>
                <CheckCircle className="mr-1 h-4 w-4" /> Delivered
              </>
            ) : (
              <>
                <Truck className="mr-1 h-4 w-4" /> Shipping
              </>
            )}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="font-medium text-gray-900">
                  Payment Information
                </h4>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Method:</span>{" "}
                  {orderDetails.paymentMethod}
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>
                  {orderDetails.paymentStatus === "pending COD"
                    ? "Pending COD"
                    : orderDetails.paymentStatus === "paid"
                    ? "Paid"
                    : "Pending"}
                </p>
                {orderDetails.paidAt && (
                  <p>
                    <span className="text-gray-500">Paid on:</span>{" "}
                    {new Date(orderDetails.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Truck className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="font-medium text-gray-900">
                  Shipping Information
                </h4>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Address:</span>{" "}
                  {`
                  ${orderDetails.shippingAddress.address}, 
                  ${orderDetails.shippingAddress.city}, 
                  ${orderDetails.shippingAddress.postalCode}, 
                  ${orderDetails.shippingAddress.country}
                `}
                </p>
                {orderDetails.deliveredAt && (
                  <p>
                    <span className="text-gray-500">Delivered on:</span>{" "}
                    {new Date(orderDetails.deliveredAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Items
          </h3>
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
                  <tr key={item.productId}>
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
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs. {item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Total */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 pr-20">
          <div className="flex justify-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between pt-2">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold">
                  Rs. {orderDetails.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
