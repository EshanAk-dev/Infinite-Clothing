import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <p className="text-center py-8 animate-pulse">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-8">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex-shrink-0 group"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] h-full flex flex-col transform group-hover:-translate-y-1.5">
            {/* Product Image */}
            <div className="relative pt-[125%] overflow-hidden">
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </div>

            {/* Product Info */}
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-gray-700">
                {product.name}
              </h3>
              <div className="mt-auto">
                <p className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-gray-800">
                  Rs.{product.price.toFixed(2)}
                  {product.discountPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      Rs.{product.discountPrice.toFixed(2)}
                    </span>
                  )}
                </p>
                <Link
                  to={`/product/${product._id}`}
                  className="mt-3 inline-block w-full py-2.5 text-center rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;