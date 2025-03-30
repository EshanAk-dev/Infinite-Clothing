import { MdCheckCircle, MdVisibility } from "react-icons/md";
import { Link } from "react-router-dom";

const OrderManagement = () => {
  const orders = [
    {
      _id: 1253632,
      user: {
        name: "Eshan",
      },
      totalPrice: 120,
      status: "Processing",
    },
  ];

  const handleStatusChange = (orderId, status) => {
    console.log({ id: orderId, status });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 uppercase">Order Management</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-800 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">{order.user.name}</td>
                  <td className="p-4">Rs.{order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500
                      focus:border-blue-500 block p-2.5"
                    >
                      <option value="Processiong">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {/* View Button */}
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                      >
                        <MdVisibility className="text-lg" /> View
                      </Link>

                      {/* Mark as Delivered Button */}
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Delivered")
                        }
                        className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      >
                        <MdCheckCircle className="text-lg" /> Mark as Delivered
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                    No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
