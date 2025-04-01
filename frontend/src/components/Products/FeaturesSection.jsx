import {
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: <HiShoppingBag className="h-6 w-6" />,
      title: "FREE SRI LANKAN WIDE DELIVERY",
      description: "On all orders over Rs.4000.00",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <HiArrowPathRoundedSquare className="h-6 w-6" />,
      title: "30 DAYS RETURN POLICY",
      description: "Money back guarantee",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <HiOutlineCreditCard className="h-6 w-6" />,
      title: "SECURE ONLINE CHECKOUT",
      description: "100% secured online checkout process",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className={`p-3 rounded-full ${feature.bgColor} ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h4 className="font-medium text-gray-900 mb-2 text-lg">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm max-w-xs">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;