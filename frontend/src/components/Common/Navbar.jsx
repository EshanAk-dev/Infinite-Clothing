import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // NavLink component with hover underline effect
  const NavLink = ({ to, children, ...props }) => (
    <Link
      to={to}
      className="relative text-gray-700 hover:text-black text-sm uppercase group transition-colors duration-200"
      {...props}
    >
      {children}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  // MobileNavLink component for drawer
  const MobileNavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="block text-gray-700 hover:text-black text-lg relative py-2 group transition-colors duration-200"
    >
      {children}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-5 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="lg:ml-10">
          <Link to="/">
            <img
              src="/src/assets/infinite-logo.png"
              alt="Infinite Logo"
              className="h-12"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/collections/all">All</NavLink>
          <NavLink to="/collections/all?gender=Men">Men</NavLink>
          <NavLink to="/collections/all?gender=Women">Women</NavLink>
          <NavLink to="/collections/all?category=Top+Wear">Top Wear</NavLink>
          <NavLink to="/collections/all?category=Bottom+Wear">
            Bottom Wear
          </NavLink>
          <NavLink to="/customize-t-shirts">Customize T-Shirt</NavLink>
        </div>

        {/* Icons in the right */}
        <div className="flex items-center lg:mr-10 space-x-5">
          {user && user.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md group"
            >
              <MdAdminPanelSettings className="text-lg text-blue-400 group-hover:text-blue-300 transition-colors duration-200 mr-1" />
              <span>Admin</span>
            </Link>
          )}

          <Link
            to="/profile"
            className="hover:text-black transition-colors duration-200"
          >
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black transition-colors duration-200"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search Icon */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          {/* Hamburger Icon for Mobile */}
          <button
            onClick={toggleNavDrawer}
            className="md:hidden hover:text-black transition-colors duration-200"
          >
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleNavDrawer}
            className="hover:text-black transition-colors duration-200"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links Inside Drawer */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Menu</h2>
          <nav className="space-y-1">
            <MobileNavLink to="/" onClick={toggleNavDrawer}>
              Home
            </MobileNavLink>
            <hr className="my-2 border-gray-200" />

            <MobileNavLink to="/collections/all" onClick={toggleNavDrawer}>
              All
            </MobileNavLink>
            <hr className="my-2 border-gray-200" />

            <MobileNavLink
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
            >
              Men
            </MobileNavLink>
            <hr className="my-2 border-gray-200" />

            <MobileNavLink
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
            >
              Women
            </MobileNavLink>
            <hr className="my-2 border-gray-200" />

            <MobileNavLink
              to="/collections/all?category=Top+Wear"
              onClick={toggleNavDrawer}
            >
              Top Wear
            </MobileNavLink>
            <hr className="my-2 border-gray-200" />

            <MobileNavLink
              to="/collections/all?category=Bottom+Wear"
              onClick={toggleNavDrawer}
            >
              Bottom Wear
            </MobileNavLink>
            <hr className="my-2 border-gray-200" />

            <MobileNavLink to="/customize-t-shirts" onClick={toggleNavDrawer}>
              Customize T-Shirt
            </MobileNavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
