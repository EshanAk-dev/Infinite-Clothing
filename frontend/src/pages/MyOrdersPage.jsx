import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders
    setTimeout(() => {
      const mockOrders = [
        {
          _id: "12345",
          createdAt: new Date(),
          shippingAddress: { city: "Kurunegala", country: "Sri Lanka" },
          orderItems: [
            {
              name: "Product 1",
              image: "https://picsum.photos/500/500?random=1",
            },
          ],
          totalPrice: "5400",
          isPaid: true,
        },
        {
          _id: "22563",
          createdAt: new Date(),
          shippingAddress: { city: "Kandy", country: "Sri Lanka" },
          orderItems: [
            {
              name: "Product 3",
              image: "https://picsum.photos/500/500?random=3",
            },
          ],
          totalPrice: "2400",
          isPaid: true,
        },
      ];

      setOrders(mockOrders);
    }, 1000);
  }, []);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      {/* Desktop Table Layout */}
      <div className="relative shadow-md sm:rounded-lg overflow-hidden hidden sm:block">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-300 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Order ID</th>
              <th className="py-2 px-4 sm:py-3">Created at</th>
              <th className="py-2 px-4 sm:py-3">Shipping address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3">Price</th>
              <th className="py-2 px-4 sm:py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b hover:border-gray-50 cursor-pointer"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order.createdAt).toLocaleDateString()} &nbsp;
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    Rs.{parseFloat(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  You have no orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              onClick={() => handleRowClick(order._id)}
              className="bg-white shadow-md rounded-lg p-4 mb-4"
            >
              <div className="flex items-center mb-4">
                <img
                  src={order.orderItems[0].image}
                  alt={order.orderItems[0].name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} &nbsp;
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Shipping Address:{" "}
                {order.shippingAddress
                  ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Items:</span>{" "}
                {order.orderItems.length}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Price:</span> Rs.
                {parseFloat(order.totalPrice).toFixed(2)}
              </p>
              <p className="text-sm font-semibold">
                Status:{" "}
                <span
                  className={`${
                    order.isPaid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">You have no orders.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
