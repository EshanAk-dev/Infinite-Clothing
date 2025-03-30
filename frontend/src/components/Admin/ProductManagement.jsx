import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const products = [
    {
      _id: 12342,
      name: "Denim",
      price: 120,
      sku: "2474839",
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?"))
      console.log("Delete product with ID:", id);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 uppercase">Product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4">Rs.{product.price.toFixed(2)}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {/* View Button */}
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                      >
                        <MdVisibility className="text-lg" /> View
                      </Link>

                      {/* Edit Button */}
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        <MdEdit className="text-lg" /> Edit
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                      >
                        <MdDelete className="text-lg" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={4}>
                  No Products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
