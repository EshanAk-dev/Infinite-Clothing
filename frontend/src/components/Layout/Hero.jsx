import { Link } from "react-router-dom";
import heroImg from "../../assets/infinite-hero.jpg";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image with Gradient Overlay */}
      <div className="relative w-full h-[60vh] min-h-[320px] max-h-[800px] sm:h-[70vh] md:h-[87vh]">
        <img
          src={heroImg}
          alt="Infinite Fashion Collection"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-3 sm:mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            ELEVATED ELEGANCE
          </motion.h1>

          <motion.p
            className="text-base xs:text-lg sm:text-xl lg:text-2xl text-gray-100 mb-6 sm:mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover our premium collection with fast island-wide delivery
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/collections/all"
              className="inline-block lg:w-1/3 xs:w-auto px-6 py-3 sm:px-6 sm:py-3 bg-white text-gray-900 text-base sm:text-lg font-medium rounded-md hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce w-5 h-5 sm:w-6 sm:h-6 border-2 border-white rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
