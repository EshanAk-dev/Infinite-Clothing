import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 10000,
  });

  const [priceRange, setPriceRange] = useState([0, 10000]);

  const categories = ["Top Wear", "Bottom Wear"];

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Black",
    "White",
    "Orange",
    "Purple",
    "Pink",
    "Brown",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const materials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Linen",
    "Silk",
    "Denim",
    "Leather",
    "Rayon",
  ];

  const brands = [
    "Infinite",
    "Nike",
    "Adidas",
    "Puma",
    "Levi's",
    "Gucci",
    "Zara",
  ];

  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 10000,
    });
    setPriceRange([0, params.maxPrice || 10000]);
  }, [searchParams]);

  // Handle filter changes
  const handleFiterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // Update URL according to filters
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  // Handle price changes
  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(filters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="taxt-xl font-medium text-gray-800 mb-4">Filters</h3>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFiterChange}
              checked={filters.category === category}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* Genders */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Genders</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFiterChange}
              checked={filters.gender === gender}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

      {/* Colors */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onChange={handleFiterChange}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105
                ${filters.color === color ? "ring-2 ring-blue-500" : ""}`}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              name="size"
              value={size}
              onChange={handleFiterChange}
              checked={filters.size.includes(size)}
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Materials */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              name="material"
              value={material}
              onChange={handleFiterChange}
              checked={filters.material.includes(material)}
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* Brand */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              name="brand"
              value={brand}
              onChange={handleFiterChange}
              checked={filters.brand.includes(brand)}
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>

      {/* Price range filter */}
      <div className="mb-8">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="priceRange"
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          min={0}
          max={10000}
          value={priceRange[1]}
          onChange={handlePriceChange}
        />
        <div className="flex justify-between text-gray-600 mt-2">
          <span>Rs.0</span>
          <span>Rs.{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
