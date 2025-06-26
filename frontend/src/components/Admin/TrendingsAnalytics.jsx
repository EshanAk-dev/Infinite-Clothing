import React, { useState, useEffect } from 'react';
import { TrendingUp, Globe, Palette, ShoppingBag, BarChart3, RefreshCw, Users, Star, Calendar } from 'lucide-react';

const TrendingsAnalytics = () => {
  const [trendsData, setTrendsData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [seasonalTrends, setSeasonalTrends] = useState(null);
  const [influencerImpact, setInfluencerImpact] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (selectedRegion !== 'all') {
      fetchRegionData();
    } else {
      fetchTrendsData();
    }
  }, [selectedRegion]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTrendsData(),
        fetchAnalytics(),
        fetchSeasonalTrends(),
        fetchInfluencerImpact()
      ]);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendsData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trends`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setTrendsData(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch trends data');
      console.error('Error fetching trends:', err);
    }
  };

  const fetchRegionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/trends/${selectedRegion}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setTrendsData({ [data.region]: data.data });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch region data');
      console.error('Error fetching region data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchSeasonalTrends = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/seasonal-trends`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setSeasonalTrends(data.data);
      }
    } catch (err) {
      console.error('Error fetching seasonal trends:', err);
    }
  };

  const fetchInfluencerImpact = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/influencer-impact`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setInfluencerImpact(data.data);
      }
    } catch (err) {
      console.error('Error fetching influencer impact:', err);
    }
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  const formatRegionName = (region) => {
    return region.replace(/[_&]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRegionApiName = (regionName) => {
    const mapping = {
      'Middle East': 'Middle_East',
      'Eastern Europe': 'Eastern_Europe',
      'Southeast Asia': 'Southeast_Asia',
      'Australia & Oceania': 'Australia_Oceania'
    };
    return mapping[regionName] || regionName.toLowerCase().replace(/ /g, '_');
  };

  const renderRegionCard = (regionName, regionData) => (
    <div key={regionName} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-500" />
          {regionName}
        </h3>
        <div className="text-sm text-gray-500">
          {regionData.trending_items?.length || 0} trends
        </div>
      </div>

      <div className="space-y-4">
        {/* Trending Items */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <ShoppingBag className="w-4 h-4 mr-1" />
            Trending Items
          </h4>
          <div className="flex flex-wrap gap-2">
            {regionData.trending_items?.slice(0, 8).map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Trending Colors */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <Palette className="w-4 h-4 mr-1" />
            Trending Colors
          </h4>
          <div className="flex flex-wrap gap-2">
            {regionData.trending_colors?.slice(0, 6).map((color, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        {/* Trending Categories */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <BarChart3 className="w-4 h-4 mr-1" />
            Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {regionData.trending_categories?.slice(0, 6).map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Growth Chart */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Top Growth Items
          </h4>
          <div className="space-y-2">
            {regionData.trending_items?.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1 mr-2">{item}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(regionData.growth_percentage?.[index] || 0, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-green-600 min-w-[40px]">
                    {regionData.growth_percentage?.[index] || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading fashion trends...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={fetchAllData}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fashion Trends Analytics</h1>
          <p className="text-gray-600">Real-time fashion trending data across different regions</p>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Trends</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.total_trends_tracked}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Avg Growth</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.global_average_growth}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <Globe className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Regions</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.total_regions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <Palette className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Colors</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.total_colors_tracked}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Performing Regions */}
        {analytics && analytics.top_performing_regions && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Top Performing Regions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {analytics.top_performing_regions.map((region, index) => (
                <div key={region.region} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                  <div className="text-sm font-medium text-gray-700">{region.region}</div>
                  <div className="text-xl font-bold text-green-600">{region.average_growth}%</div>
                  <div className="text-xs text-gray-500">{region.total_trends} trends</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Influencer Impact */}
        {influencerImpact && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-500" />
                Celebrity Endorsements
              </h2>
              <div className="space-y-3">
                {influencerImpact.celebrity_endorsements.map((celeb, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{celeb.name}</div>
                      <div className="text-sm text-gray-600">{celeb.impact_item}</div>
                    </div>
                    <div className="text-lg font-bold text-pink-600">+{celeb.growth_boost}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Social Media Trends
              </h2>
              <div className="space-y-3">
                {influencerImpact.social_media_trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{trend.platform}</div>
                      <div className="text-sm text-gray-600">{trend.trending_hashtag}</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{trend.influence_score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Trends */}
        {seasonalTrends && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
              Seasonal Trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(seasonalTrends).map(([season, data]) => (
                <div key={season} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">{season}</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Colors:</div>
                      <div className="flex flex-wrap gap-1">
                        {data.colors.slice(0, 3).map((color, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Items:</div>
                      <div className="flex flex-wrap gap-1">
                        {data.items.slice(0, 2).map((item, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Region Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRegionChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRegion === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Regions
            </button>
            {analytics?.data_coverage?.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionChange(getRegionApiName(region))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRegion === getRegionApiName(region)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Trends Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trendsData && (
            Object.entries(trendsData).map(([regionName, regionData]) =>
              renderRegionCard(regionName, regionData)
            )
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchAllData}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center mx-auto transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingsAnalytics;