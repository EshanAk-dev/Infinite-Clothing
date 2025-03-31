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

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium uppercase">
            Infinite
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-black text-sm uppercase"
          >
            Home
          </Link>
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top+Wear"
            className="text-gray-700 hover:text-black text-sm uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="/collections/all?category=Bottom+Wear"
            className="text-gray-700 hover:text-black text-sm uppercase"
          >
            Bottom Wear
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm uppercase"
          >
            Customize T-Shirt
          </Link>
        </div>

        {/* Icons in the right */}
        <div className="flex items-center space-x-5">
          <Link
            to="/admin"
            className="flex items-center bg-black px-2 py-1 rounded text-sm text-white"
          >
            <MdAdminPanelSettings className="mr-1" /> Admin
          </Link>
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-black text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search Icon */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          {/* Hamburger Icon for Mobile */}
          <button onClick={toggleNavDrawer} className="md:hidden">
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
          <button onClick={toggleNavDrawer}>
            {" "}
            {/* <-- Fix: Add onClick event */}
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links Inside Drawer */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-lg"
            >
              Home
            </Link>
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-lg"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-lg"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top+Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-lg"
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom+Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-lg"
            >
              Bottom Wear
            </Link>
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-lg"
            >
              Customize T-Shirt
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
