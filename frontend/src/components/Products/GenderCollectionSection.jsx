import { Link } from "react-router-dom";
import mensCollectionImg from "../../assets/mens-collection.jpg";
import womensCollectionImg from "../../assets/womens-collection.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-10">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women's Collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionImg}
            alt="Women's Collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women&apos;s Collection
            </h2>
            <Link to="/collection/all?gender=Women" className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>
        {/* Men's Collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionImg}
            alt="Men's Collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men&apos;s Collection
            </h2>
            <Link to="/collection/all?gender=Men" className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
