import { Link } from "react-router-dom";
import heroImg from "../../assets/infinite-hero.jpg";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image with Gradient Overlay */}
      <div className="relative w-full h-[87vh] min-h-[400px] max-h-[800px]">
        <img
          src={heroImg}
          alt="Infinite Fashion Collection"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white mb-4 md:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            ELEVATED ELEGANCE
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-8 md:mb-10 max-w-2xl mx-auto"
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
              className="inline-block px-8 py-3 md:px-10 md:py-4 bg-white text-gray-900 text-lg md:text-xl font-medium rounded-sm hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator (optional) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce w-6 h-6 border-2 border-white rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;