import { Link } from "react-router-dom";
import mensCollectionImg from "../../assets/mens-collection.jpg";
import womensCollectionImg from "../../assets/womens-collection.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-10 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop By Collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Women's Collection */}
          <div className="relative group overflow-hidden rounded-xl">
            <img
              src={womensCollectionImg}
              alt="Women's Collection"
              className="w-full h-[500px] md:h-[600px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-6 rounded-lg shadow-md max-w-[80%]">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Women's Collection</h3>
              <Link
                to="/collections/all?gender=Women"
                className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
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
              className="w-full h-[500px] md:h-[600px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-6 rounded-lg shadow-md max-w-[80%]">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Men's Collection</h3>
              <Link
                to="/collections/all?gender=Men"
                className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
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