import { useSearchParams } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaFire } from "react-icons/fa";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    if (sortBy) {
      searchParams.set("sortBy", sortBy);
    } else {
      searchParams.delete("sortBy");
    }
    setSearchParams(searchParams);
  };

  const getSortIcon = () => {
    const sortBy = searchParams.get("sortBy");
    switch (sortBy) {
      case "priceAsc":
        return <FaSortUp className="ml-2" />;
      case "priceDesc":
        return <FaSortDown className="ml-2" />;
      case "popularity":
        return <FaFire className="ml-2 text-orange-500" />;
      default:
        return <FaSort className="ml-2" />;
    }
  };

  return (
    <div className="mb-6 flex items-center justify-end">
      <div className="flex items-center">
        <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <div className="relative">
          <select
            id="sort"
            onChange={handleSortChange}
            value={searchParams.get("sortBy") || ""}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 cursor-pointer"
          >
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="popularity">Popularity</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {getSortIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;