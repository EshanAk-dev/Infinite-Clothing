import { Link } from "react-router-dom";
import mensCollectionImg from "../../assets/mens-collection.jpg";
import womensCollectionImg from "../../assets/womens-collection.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="py-10 px-2 sm:py-16 sm:px-4 lg:px-10 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">Shop By Collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Women's Collection */}
          <div className="relative group overflow-hidden rounded-xl">
            <img
              src={womensCollectionImg}
              alt="Women's Collection"
              className="w-full h-60 xs:h-72 sm:h-[400px] md:h-[600px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-8 sm:left-8 sm:translate-x-0 bg-white bg-opacity-90 p-4 sm:p-6 rounded-lg shadow-md w-[90%] sm:max-w-[80%]">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Women's Collection</h3>
              <Link
                to="/collections/all?gender=Women"
                className="inline-block w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base text-center"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Men's Collection */}
          <div className="relative group overflow-hidden rounded-xl">
            <img
              src={mensCollectionImg}
              alt="Men's Collection"
              className="w-full h-60 xs:h-72 sm:h-[400px] md:h-[600px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-8 sm:left-8 sm:translate-x-0 bg-white bg-opacity-90 p-4 sm:p-6 rounded-lg shadow-md w-[90%] sm:max-w-[80%]">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Men's Collection</h3>
              <Link
                to="/collections/all?gender=Men"
                className="inline-block w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base text-center"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;