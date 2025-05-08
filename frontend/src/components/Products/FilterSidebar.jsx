import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sliders, X } from "lucide-react";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    sizes: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 10000,
  });

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    gender: true,
    color: true,
    sizes: true,
    material: true,
    brand: true,
    price: true
  });

  const categories = ["Top Wear", "Bottom Wear", "Dresses", "Hats", "Aprons"];
  const colors = [
    { name: "Red", value: "Red" },
    { name: "Blue", value: "Blue" },
    { name: "Green", value: "Green" },
    { name: "Yellow", value: "Yellow" },
    { name: "Black", value: "Black" },
    { name: "White", value: "White" },
    { name: "Orange", value: "Orange" },
    { name: "Purple", value: "Purple" },
    { name: "Pink", value: "Pink" },
    { name: "Brown", value: "Brown" },
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const materials = ["Cotton", "Polyester", "Wool", "Linen", "Silk", "Denim", "Leather", "Rayon"];
  const brands = ["Infinite"];
  const genders = ["Men", "Women", "Unisex"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      sizes: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 10000,
    });
    setPriceRange([params.minPrice || 0, params.maxPrice || 10000]);
  }, [searchParams]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter(item => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    
    // Handle individual string parameters
    if (newFilters.category) params.append("category", newFilters.category);
    if (newFilters.gender) params.append("gender", newFilters.gender);
    if (newFilters.color) params.append("color", newFilters.color);
    if (newFilters.minPrice) params.append("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.append("maxPrice", newFilters.maxPrice);
    
    // Handle array parameters
    if (newFilters.sizes && newFilters.sizes.length > 0) {
      params.append("size", newFilters.sizes.join(","));
    }
    if (newFilters.material && newFilters.material.length > 0) {
      params.append("material", newFilters.material.join(","));
    }
    if (newFilters.brand && newFilters.brand.length > 0) {
      params.append("brand", newFilters.brand.join(","));
    }
    
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
    const newFilters = { ...filters, minPrice: values[0], maxPrice: values[1] };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      category: "",
      gender: "",
      color: "",
      sizes: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 10000,
    });
    setPriceRange([0, 10000]);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="w-70 md:w-55 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sliders className="h-5 w-5 mr-2 text-indigo-600" />
          Filters
        </h3>
        {(searchParams.toString() && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            Clear all
            <X className="h-4 w-4 ml-1" />
          </button>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("price")}
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
          <span className="text-gray-500">
            {expandedSections.price ? "−" : "+"}
          </span>
        </div>
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="px-1">
              <input
                type="range"
                min={0}
                max={10000}
                step={100}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange([priceRange[0], e.target.value])}
                className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Rs. {priceRange[0]}</span>
              <span>Rs. {priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("category")}
        >
          <h4 className="font-medium text-gray-900">Categories</h4>
          <span className="text-gray-500">
            {expandedSections.category ? "−" : "+"}
          </span>
        </div>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="radio"
                  id={`category-${category}`}
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-700">
                  {category}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("gender")}
        >
          <h4 className="font-medium text-gray-900">Gender</h4>
          <span className="text-gray-500">
            {expandedSections.gender ? "−" : "+"}
          </span>
        </div>
        {expandedSections.gender && (
          <div className="space-y-2">
            {genders.map(gender => (
              <div key={gender} className="flex items-center">
                <input
                  type="radio"
                  id={`gender-${gender}`}
                  name="gender"
                  value={gender}
                  checked={filters.gender === gender}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`gender-${gender}`} className="ml-3 text-sm text-gray-700">
                  {gender}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("color")}
        >
          <h4 className="font-medium text-gray-900">Colors</h4>
          <span className="text-gray-500">
            {expandedSections.color ? "−" : "+"}
          </span>
        </div>
        {expandedSections.color && (
          <div className="grid grid-cols-5 gap-2">
            {colors.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  const newFilters = { ...filters, color: filters.color === color.value ? "" : color.value };
                  setFilters(newFilters);
                  updateURLParams(newFilters);
                }}
                className={`w-8 h-8 rounded-full border-2 ${filters.color === color.value ? "border-indigo-600 ring-2 ring-indigo-200" : "border-gray-200"} transition-all`}
                style={{ backgroundColor: color.value.toLowerCase() }}
                aria-label={color.name}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("sizes")}
        >
          <h4 className="font-medium text-gray-900">Sizes</h4>
          <span className="text-gray-500">
            {expandedSections.sizes ? "−" : "+"}
          </span>
        </div>
        {expandedSections.sizes && (
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(size => (
              <div key={size} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  name="sizes"
                  value={size}
                  checked={filters.sizes.includes(size)}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`size-${size}`} className="ml-2 text-sm text-gray-700">
                  {size}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Materials */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("material")}
        >
          <h4 className="font-medium text-gray-900">Materials</h4>
          <span className="text-gray-500">
            {expandedSections.material ? "−" : "+"}
          </span>
        </div>
        {expandedSections.material && (
          <div className="space-y-2">
            {materials.map(material => (
              <div key={material} className="flex items-center">
                <input
                  type="checkbox"
                  id={`material-${material}`}
                  name="material"
                  value={material}
                  checked={filters.material.includes(material)}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`material-${material}`} className="ml-3 text-sm text-gray-700">
                  {material}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("brand")}
        >
          <h4 className="font-medium text-gray-900">Brands</h4>
          <span className="text-gray-500">
            {expandedSections.brand ? "−" : "+"}
          </span>
        </div>
        {expandedSections.brand && (
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  name="brand"
                  value={brand}
                  checked={filters.brand.includes(brand)}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-700">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;