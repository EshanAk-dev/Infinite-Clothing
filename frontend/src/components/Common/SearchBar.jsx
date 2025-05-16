import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProductsByFilters, setFilters } from "../../redux/slices/productSlice";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  // Auto-focus input when search opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close search overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Save to recent searches
      const updatedSearches = [
        searchTerm,
        ...recentSearches.filter(term => term !== searchTerm)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      // Dispatch search action
      dispatch(setFilters({ search: searchTerm }));
      dispatch(fetchProductsByFilters({ search: searchTerm }));
      navigate(`/collections/all?search=${searchTerm}`);
      setIsOpen(false);
    }
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    dispatch(setFilters({ search: term }));
    dispatch(fetchProductsByFilters({ search: term }));
    navigate(`/collections/all?search=${term}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSearchToggle}
        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 relative overflow-hidden group"
        aria-label="Search"
      >
        <div className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors relative z-10">
          <SearchIcon />
        </div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: isOpen ? 1 : 0 }}
          className="absolute inset-0 bg-gray-200 rounded-full z-0"
        />
      </button>

      {/* Search overlay and input */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 pt-16 px-4 md:pt-20"
          >
            <motion.div
              ref={searchContainerRef}
              initial={{ scaleY: 0.95, opacity: 0.8 }}
              animate={{ scaleY: 1, opacity: 1 }}
              className="max-w-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.form
                onSubmit={handleSearch}
                className="relative rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="absolute left-4 w-6 h-6 text-gray-400">
                    <SearchIcon />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full py-4 pl-12 pr-12 text-lg bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
                  />
                  <AnimatePresence>
                    {searchTerm && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <CloseIcon />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {searchTerm ? (
                  <div className="p-4">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <div className="w-4 h-4 text-gray-500">
                        <SearchIcon />
                      </div>
                      <p className="text-sm">
                        Press <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">Enter</span> to search for "{searchTerm}"
                      </p>
                    </div>
                  </div>
                ) : recentSearches.length > 0 ? (
                  <div className="p-3">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">Recent Searches</h3>
                    <ul>
                      {recentSearches.map((term, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleRecentSearchClick(term)}
                            className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2 transition-colors"
                          >
                            <div className="w-4 h-4 text-gray-400">
                              <SearchIcon />
                            </div>
                            <span>{term}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Start typing to search
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;