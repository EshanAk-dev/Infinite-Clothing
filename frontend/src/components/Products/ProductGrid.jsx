import { Link } from "react-router-dom";

const ProductGrid = ({products, loading, error}) => {
  if (loading) {
    <p>Loading...</p>
  }

  if(error) {
    <p>Error: {error}</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {products.map((product, index) => (
    <Link
      key={index}
      to={`/product/${product._id}`}
      className="block group"
    >
      <div
        className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 
        transition-transform duration-500 ease-out hover:scale-105 hover:shadow-2xl"
      >
        {/* Product Image */}
        <div className="w-full h-72 rounded-lg overflow-hidden">
          <img
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            className="w-full h-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-90"
          />
        </div>

        {/* Product Info */}
        <h3 className="text-md font-normal text-gray-800 group-hover:text-blue-600 transition-colors duration-300 ease-in-out mt-1">
          {product.name}
        </h3>

        <p className="text-gray-600 font-medium text-sm">
          Rs.{" "}
          <span className="text-md font-bold text-gray-900">
            {product.price.toFixed(2)}
          </span>
        </p>
      </div>
    </Link>
  ))}
</div>

  );
};

export default ProductGrid;
