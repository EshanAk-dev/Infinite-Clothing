import { Link } from "react-router-dom";
import featured from "../../assets/featured.jpg";

const FeaturedCollection = () => {
  return (
    <section className="py-10 px-2 sm:py-16 sm:px-4 lg:px-0">
      <div className="container mx-auto flex flex-col lg:flex-row items-center bg-green-100 rounded-3xl overflow-hidden">
        {/* Right content (Image) */}
        <div className="w-full lg:w-1/2">
          <img
            src={featured}
            alt="Featured Collection"
            className="w-full h-56 sm:h-80 lg:h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>

        {/* Left content */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 text-center lg:text-left flex flex-col items-center lg:items-start">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            Trendsetting Fashion
          </h2>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Elevate Your Style with Our Trending Collections
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-5 sm:mb-6 max-w-xl">
            Discover the latest trends crafted with comfort, elegance, and
            versatility in mind. Our featured collection showcases premium
            designs perfect for any occasion, from casual outings to statement
            pieces for special events. Experience high-quality fabrics,
            impeccable tailoring, and timeless fashion that keeps you ahead of
            the curve.
          </p>
          <Link
            to="/collections/all"
            className="bg-black text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg hover:bg-gray-800 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;