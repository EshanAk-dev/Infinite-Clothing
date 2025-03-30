import { Link } from "react-router-dom";
import featured from "../../assets/featured.jpg";

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 mx-5 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-100 rounded-3xl">
        {/* Left content */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Trendsetting Fashion
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Elevate Your Style with Our Trending Collections
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Discover the latest trends crafted with comfort, elegance, and
            versatility in mind. Our featured collection showcases premium
            designs perfect for any occasion, from casual outings to statement
            pieces for special events. Experience high-quality fabrics,
            impeccable tailoring, and timeless fashion that keeps you ahead of
            the curve.
          </p>
          <Link
            to="/collections/all"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>

        {/* Right content */}
        <div className="lg:w-1/2">
          <img src={featured} alt="Featured Collection" className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
