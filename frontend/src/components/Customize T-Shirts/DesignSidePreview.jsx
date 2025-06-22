/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";

const DesignSidePreview = ({
  title,
  icon,
  imageUrl,
  elements = [],
  badgeColor = "bg-indigo-100 text-indigo-800",
  badgeText = "elements",
  delay = 0,
}) => {
  const [popupImage, setPopupImage] = useState(null);

  return (
    <motion.div
      className="flex-shrink-0 w-full max-w-md mx-2 snap-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Image Popup */}
      {popupImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setPopupImage(null)}
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={popupImage}
              alt="Design Preview"
              className="max-h-[70vh] w-auto rounded"
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            {icon}
            {title}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
          >
            {elements.length} {badgeText}
          </span>
        </div>

        <div
          className="bg-gray-50 p-6 rounded-xl border border-gray-200 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
          onClick={() => setPopupImage(imageUrl)}
          title="Click to enlarge"
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-96 object-contain"
            loading="lazy"
          />
        </div>

        {/* Design Elements */}
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-900 flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-1.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Design Elements
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-3">
              {elements.length > 0 ? (
                <ul className="space-y-3">
                  {elements.map((item, index) => (
                    <motion.li
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900">
                          {item.name || `Element ${index + 1}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          {/* Position Icon */}
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Position
                        </div>
                        <span>
                          ({item.position.x.toFixed(0)},{" "}
                          {item.position.y.toFixed(0)})
                        </span>
                        <div className="flex items-center">
                          {/* Scale Icon */}
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            />
                          </svg>
                          Scale
                        </div>
                        <span>{item.scale.toFixed(2)}</span>
                        <div className="flex items-center">
                          {/* Rotation Icon */}
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                          Rotation
                        </div>
                        <span>{item.rotation}°</span>
                        <div className="flex items-center">
                          {/* Opacity Icon */}
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Opacity
                        </div>
                        <span>{(item.opacity * 100).toFixed(0)}%</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    No elements added to {title.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </details>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignSidePreview;
