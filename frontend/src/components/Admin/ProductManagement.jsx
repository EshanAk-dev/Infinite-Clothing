import {
  MdDelete,
  MdEdit,
  MdVisibility,
  MdSearch,
  MdFilterAlt,
} from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";
import DeleteConfirmationModal from "../../components/Common/DeleteConfirmationModal";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [skuFilter, setSkuFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const {
    isModalOpen,
    deleteConfig,
    openDeleteModal,
    closeDeleteModal,
    setLoading,
  } = useDeleteConfirmation();

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const skuMatch = product.sku
      .toLowerCase()
      .includes(skuFilter.toLowerCase());
    const categoryMatch = product.category
      .toLowerCase()
      .includes(categoryFilter.toLowerCase());

    return nameMatch && skuMatch && categoryMatch;
  });

  // Sort filtered products by createdAt in descending order
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter, skuFilter, categoryFilter]);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id, name) => {
    openDeleteModal({
      title: "Delete Product",
      message:
        "Are you sure you want to delete this product? This action cannot be undone.",
      itemName: name,
      confirmText: "Delete Product",
      onConfirm: async () => {
        setLoading(true);
        try {
          await dispatch(deleteProduct(id));
          toast.success("Product deleted successfully!", {
            style: {
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #6ee7b7",
              borderRadius: "8px",
              padding: "16px",
            },
          });
        } catch (error) {
          toast.error("Failed to delete product.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const clearFilters = () => {
    setNameFilter("");
    setSkuFilter("");
    setCategoryFilter("");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  const renderMobileCards = () => {
    if (currentProducts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-500 text-center px-4">
            No products found
          </p>
          <p className="text-gray-400 text-center px-4">
            {nameFilter || skuFilter || categoryFilter
              ? "Try adjusting your search filters"
              : "Add your first product to get started"}
          </p>
        </div>
      );
    }

    return currentProducts.map((product) => (
      <div
        key={product._id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden"
      >
        <div className="p-4 flex items-center">
          <div className="flex-shrink-0 h-14 w-14">
            {product.images?.[0]?.url && (
              <img
                className="h-14 w-14 rounded-md object-cover"
                src={product.images[0].url}
                alt={product.name}
              />
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="text-base font-medium text-gray-900">
              {product.name}
            </div>
            <div className="text-xs text-gray-500">{product.category}</div>
            <div className="text-xs text-blue-700 mt-1">{product.sku}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm font-semibold text-gray-900">
              Rs.{product.price.toFixed(2)}
            </div>
            {product.discountPrice && (
              <div className="text-xs text-gray-500 line-through">
                Rs.{product.discountPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        <div className="px-4 pb-4 flex justify-end gap-2">
          <Link
            to={`/admin/products/${product._id}`}
            className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
            title="View"
          >
            <MdVisibility className="h-5 w-5" />
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="text-yellow-600 hover:text-yellow-900 p-2 rounded-md hover:bg-yellow-50 transition-colors"
            title="Edit"
          >
            <MdEdit className="h-5 w-5" />
          </Link>
          <button
            onClick={() => handleDelete(product._id, product.name)}
            className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <MdDelete className="h-5 w-5" />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Product Management
          </h2>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <MdFilterAlt className="text-xl" />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <MdAdd className="text-xl" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="nameFilter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="nameFilter"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by name..."
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="skuFilter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                SKU
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="skuFilter"
                  value={skuFilter}
                  onChange={(e) => setSkuFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by SKU..."
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="categoryFilter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="categoryFilter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by category..."
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {filteredProducts.length} products found
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden">{renderMobileCards()}</div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SKU
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.images?.[0]?.url && (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.images[0].url}
                              alt={product.name}
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        Rs.{product.price.toFixed(2)}
                      </div>
                      {product.discountPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          Rs.{product.discountPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <MdVisibility className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900 p-2 rounded-md hover:bg-yellow-50 transition-colors"
                          title="Edit"
                        >
                          <MdEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <MdDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={4}
                  >
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <p className="mt-4 text-lg font-medium text-gray-500">
                        No products found
                      </p>
                      <p className="text-gray-400">
                        {nameFilter || skuFilter || categoryFilter
                          ? "Try adjusting your search filters"
                          : "Add your first product to get started"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {sortedProducts.length > 0 && (
        <div className="flex justify-center mt-6 overflow-x-auto pb-2">
          <nav className="inline-flex space-x-1 sm:space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 sm:px-4 py-2 text-sm rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              if (
                window.innerWidth >= 768 ||
                index + 1 === 1 ||
                index + 1 === totalPages ||
                index + 1 === currentPage ||
                index + 1 === currentPage - 1 ||
                index + 1 === currentPage + 1
              ) {
                return (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-2 text-sm rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              } else if (
                window.innerWidth < 768 &&
                (index + 1 === currentPage - 2 ||
                  index + 1 === currentPage + 2) &&
                index + 1 > 1 &&
                index + 1 < totalPages
              ) {
                return (
                  <span key={index + 1} className="flex items-center px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-4 py-2 text-sm rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteConfig.onConfirm}
        title={deleteConfig.title}
        message={deleteConfig.message}
        itemName={deleteConfig.itemName}
        confirmText={deleteConfig.confirmText}
        cancelText={deleteConfig.cancelText}
        isLoading={deleteConfig.isLoading}
      />
    </div>
  );
};

export default ProductManagement;
