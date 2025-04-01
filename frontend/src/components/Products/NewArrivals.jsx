import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);
  
  // Fetch new arrivals
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNewArrivals();
  }, []);

  // Functions for mouse handle
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Functions for scroll buttons
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Update Scroll Buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="py-12 px-4 lg:px-8 mb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">New Arrivals</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest trends and must-have pieces to refresh your wardrobe.
          </p>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              canScrollLeft 
                ? "opacity-100 hover:scale-110 active:scale-95" 
                : "opacity-0 pointer-events-none"
            }`}
          >
            <FiChevronLeft className="text-2xl text-gray-700" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              canScrollRight 
                ? "opacity-100 hover:scale-110 active:scale-95" 
                : "opacity-0 pointer-events-none"
            }`}
          >
            <FiChevronRight className="text-2xl text-gray-700" />
          </button>

          {/* Scrollable Content */}
          <div
            ref={scrollRef}
            className={`overflow-x-auto flex space-x-6 pb-6 scrollbar-hide ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            {newArrivals.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-64 sm:w-72 md:w-80"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] h-full flex flex-col hover:-translate-y-1.5">
                  <div className="relative pt-[125%] overflow-hidden">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.altText || product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-105"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-5 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 transition-colors duration-200 hover:text-gray-700">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-gray-800">
                        Rs.{product.price.toFixed(2)}
                        {product.discountPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            Rs.{product.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </p>
                      <Link
                        to={`/product/${product._id}`}
                        className="mt-3 inline-block w-full py-2.5 text-center rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;