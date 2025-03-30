import { Link } from "react-router-dom";
import heroImg from "../../assets/infinite-hero.jpg";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="Infinite"
        className="w-full h-[400px] md:h-[600px] lg:h-[650px] object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center">
        <div className="text-center text-gray-200 md:text-gray-200">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4 ">
          Elevated Elegance
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our new trendy outfits with fast worldwide shipping.
          </p>
          <Link to="#" className="bg-gray-200 text-gray-950 px-6 py-2 rounded-sm text-lg">Shop Now</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
