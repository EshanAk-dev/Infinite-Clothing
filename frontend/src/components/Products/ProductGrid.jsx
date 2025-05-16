import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2 md:px-4 lg:px-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm h-full">
          <div className="relative pt-[125%] bg-gray-100 animate-pulse"></div>
          <div className="p-3 md:p-4 space-y-2 md:space-y-3">
            <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-3 md:h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
            <div className="h-8 md:h-10 bg-gray-100 rounded animate-pulse mt-2 md:mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center bg-red-100 text-red-700 p-4 rounded-lg max-w-md mx-auto">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Error loading products: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 px-2 md:px-4 lg:px-8">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex-shrink-0 group"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] h-full flex flex-col border border-gray-100 hover:border-gray-200">
            {/* Product Image with hover effect */}
            <div className="relative pt-[125%] overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.altText || product.name}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay effects */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              </Link>
              {product.discountPrice && (
                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                  {Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-5 flex-grow flex flex-col">
              <div className="mb-1 md:mb-2">
                <h3 className="font-medium text-sm md:text-base text-gray-900 line-clamp-2 transition-colors duration-200 group-hover:text-gray-700">
                  {product.name}
                </h3>
                {product.brand && (
                  <p className="text-xs text-gray-500 mt-0.5 md:mt-1">{product.brand}</p>
                )}
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                  <p className="text-sm md:text-lg font-bold text-gray-900">
                    Rs.{product.price.toFixed(2)}
                  </p>
                  {product.discountPrice && (
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      Rs.{product.discountPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <Link
                  to={`/product/${product._id}`}
                  className="block w-full py-1.5 md:py-2.5 text-xs md:text-sm text-center rounded-md bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-sm hover:shadow-md active:opacity-90"
                >
                  Select options
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;