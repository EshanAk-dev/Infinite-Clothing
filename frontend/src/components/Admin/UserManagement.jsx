import { useEffect, useState } from "react";
import { MdDelete, MdAdd, MdSearch, MdFilterAlt } from "react-icons/md";
import { X } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/Common/DeleteConfirmationModal";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  // Delete confirmation modal
  const { isModalOpen, deleteConfig, openDeleteModal, closeDeleteModal, setLoading } = useDeleteConfirmation();

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Clear filters handler
  const clearFilters = () => {
    setNameFilter("");
    setEmailFilter("");
    setRoleFilter("");
  };

  // Filter users by name, email, and role
  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(nameFilter.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(emailFilter.toLowerCase());
    const roleMatch = roleFilter ? user.role === roleFilter : true;
    return nameMatch && emailMatch && roleMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = [...filteredUsers].reverse().slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter, emailFilter, roleFilter]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData)).then(() => {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });
      setIsAddingUser(false);
    });
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  const handleDeleteUser = (userId, userName) => {
    openDeleteModal({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action will permanently remove the user from the system.",
      itemName: userName,
      confirmText: "Delete User",
      onConfirm: async () => {
        setLoading(true);
        try {
          await dispatch(deleteUser(userId));
          // You can add a success toast here if needed
        } catch (error) {
          console.error("Error deleting user:", error);
          // Handle error
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const renderMobileCards = () => {
    if (currentUsers.length === 0) {
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-500 text-center px-4">
            No users found
          </p>
          <p className="text-gray-400 text-center px-4">
            {nameFilter || emailFilter || roleFilter
              ? "Try adjusting your search filters"
              : "Add your first user to get started"}
          </p>
        </div>
      );
    }

    return currentUsers.map((user) => (
      <div
        key={user._id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden"
      >
        <div className="p-4 flex items-center">
          <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4 flex-1">
            <div className="text-base font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="text-xs text-gray-700">{user.email}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user._id, e.target.value)}
              className="text-xs border-gray-300 p-1 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="px-4 pb-4 flex justify-end gap-2">
          <button
            onClick={() => handleDeleteUser(user._id, user.name)}
            className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <MdDelete className="h-5 w-5" />
          </button>
        </div>
      </div>
    ));
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

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            User Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage system users and permissions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <MdFilterAlt className="text-xl" />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
          <button
            onClick={() => setIsAddingUser(!isAddingUser)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center"
          >
            {isAddingUser ? (
              <X className="text-xl" />
            ) : (
              <MdAdd className="text-xl" /> 
            )}
            <span>{isAddingUser ? "Cancel" : "Add New User"}</span>
          </button>
        </div>
      </div>

      {/* Filter fields */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Name
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
              <label htmlFor="emailFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="emailFilter"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by email..."
                />
              </div>
            </div>
            <div>
              <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
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
            {filteredUsers.length} users found
          </div>
        </div>
      )}

      {/* Add new user form */}
      {isAddingUser && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Create New User
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md shadow hover:shadow-md transition-all duration-300"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User list */}
      <div className="md:hidden">
        {renderMobileCards()}
      </div>
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="text-sm border-gray-300 p-1 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <p className="mt-4 text-lg font-medium text-gray-500">
                        No users found
                      </p>
                      <p className="text-gray-400">
                        {nameFilter || emailFilter || roleFilter
                          ? "Try adjusting your search filters"
                          : "Add your first user to get started"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > 0 && (
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

      {/* Delete Confirmation Modal */}
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

export default UserManagement;