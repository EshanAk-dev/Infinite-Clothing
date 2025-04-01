import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Join Our Community</h3>
            <p className="text-gray-600">
              Be the first to hear about new products, exclusive offers, and special events.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-sm text-gray-700">
                Sign up and get 15% off your first order.
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Men's Collection", path: "/collections/all?gender=Men" },
                { name: "Women's Collection", path: "/collections/all?gender=Women" },
                { name: "New Arrivals", path: "/collections/new" },
                { name: "Best Sellers", path: "/collections/bestsellers" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", path: "/contact" },
                { name: "FAQs", path: "/faqs" },
                { name: "Shipping Policy", path: "/shipping" },
                { name: "Returns & Exchanges", path: "/returns" },
                { name: "Size Guide", path: "/size-guide" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Connect With Us</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiPhoneCall className="text-gray-600" />
                <a href="tel:+94710701158" className="text-gray-600 hover:text-gray-900 transition-colors">
                  +94 71 070 1158
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <HiOutlineMail className="text-gray-600" />
                <a href="mailto:info@infinite.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                  info@infinite.com
                </a>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { icon: <TbBrandMeta className="h-5 w-5" />, url: "https://facebook.com" },
                  { icon: <IoLogoInstagram className="h-5 w-5" />, url: "https://instagram.com" },
                  { icon: <RiTwitterXLine className="h-5 w-5" />, url: "https://twitter.com" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-gray-900"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Infinite. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-gray-700">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;