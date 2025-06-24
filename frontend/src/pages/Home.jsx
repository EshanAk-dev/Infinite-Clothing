import { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import { motion } from "framer-motion";
import TrendingProductsPopup from "../components/Products/TrendingProductsPopUp";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [showTrendingPopup, setShowTrendingPopup] = useState(false);

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Top Wear",
        limit: 8,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    // Always show popup after 1.5 seconds when Home mounts
    const timer = setTimeout(() => {
      setShowTrendingPopup(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseTrendingPopup = () => {
    setShowTrendingPopup(false);
  };

  return (
    <div className="font-sans">
      <Hero />

      <GenderCollectionSection />

      <NewArrivals />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Top Wears For Women
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Discover our curated collection of premium tops
          </motion.p>
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </section>

      <FeaturedCollection />

      <FeaturesSection />

      {/* Trending Products Popup */}
      <TrendingProductsPopup
        isOpen={showTrendingPopup}
        onClose={handleCloseTrendingPopup}
      />
    </div>
  );
};

export default Home;
