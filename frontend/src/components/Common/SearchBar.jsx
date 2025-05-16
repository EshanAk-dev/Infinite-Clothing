import { useState, useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slices/productSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Auto-focus input when search opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setFilters({ search: searchTerm }));
      dispatch(fetchProductsByFilters({ search: searchTerm }));
      navigate(`/collections/all?search=${searchTerm}`);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Search toggle button */}
      <button
        onClick={handleSearchToggle}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Search"
      >
        <HiMagnifyingGlass className="h-5 w-5 text-gray-700 hover:text-gray-900" />
      </button>

      {/* Search overlay and input */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={handleSearchToggle}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 left-0 right-0 z-50 pt-20 px-4"
          >
            <motion.form
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scaleX: 0.95 }}
                animate={{ scaleX: 1 }}
                className="relative"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full py-4 pl-6 pr-16 text-lg bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <HiMiniXMark className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="p-1 text-gray-700 hover:text-blue-600 transition-colors"
                    aria-label="Submit search"
                  >
                    <HiMagnifyingGlass className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>

            </motion.form>

            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto"
              >
                <p className="text-sm text-gray-500">
                  Press Enter to search for "{searchTerm}"
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;