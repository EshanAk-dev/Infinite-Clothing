from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import requests
import json
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for React app

# Sample data structure
SAMPLE_TRENDS_DATA = {
    "North America": {
        "trending_items": [
            "Oversized Blazers", "Cargo Pants", "Platform Sneakers", "Bucket Hats", 
            "Cropped Hoodies", "Wide-leg Trousers", "Chunky Gold Jewelry", "Denim Jackets",
            "Leather Boots", "Midi Skirts", "Puffer Vests", "Turtleneck Sweaters"
        ],
        "trending_colors": [
            "Sage Green", "Terracotta", "Electric Blue", "Cream", "Rust Orange", 
            "Deep Purple", "Warm Beige", "Charcoal Gray"
        ],
        "trending_categories": [
            "Streetwear", "Minimalist", "Y2K Revival", "Sustainable Fashion", 
            "Athleisure", "Vintage Americana", "Urban Casual", "Eco-Conscious",
            "Gender-Neutral", "Workwear", "Comfort Wear", "Retro-Futurism"
        ],
        "growth_percentage": [45, 38, 52, 29, 41, 35, 48, 33, 39, 44, 31, 37]
    },
    "Europe": {
        "trending_items": [
            "Trench Coats", "Wide-leg Jeans", "Chunky Sneakers", "Mini Bags",
            "Silk Scarves", "Tailored Blazers", "Ankle Boots", "Pleated Skirts",
            "Cashmere Sweaters", "Statement Coats", "Designer Sneakers", "Crossbody Bags"
        ],
        "trending_colors": [
            "Burgundy", "Forest Green", "Camel", "Off-White", "Navy Blue",
            "Mustard Yellow", "Dove Gray", "Rich Brown"
        ],
        "trending_categories": [
            "Classic", "Eco-friendly", "Luxury Casual", "Vintage", "Minimalist Chic",
            "Scandinavian Style", "French Girl", "Italian Luxury", "British Heritage",
            "Sustainable Luxury", "Artisanal", "Timeless Elegance"
        ],
        "growth_percentage": [42, 35, 48, 33, 46, 39, 43, 38, 41, 36, 44, 40]
    },
    "Asia": {
        "trending_items": [
            "Cropped Jackets", "High-waist Skirts", "Combat Boots", "Statement Earrings",
            "Oversized Shirts", "Platform Sandals", "Colorful Hair Accessories", "Layered Necklaces",
            "Kawaii Bags", "Tech Wear Pants", "Anime-inspired Apparel", "Holographic Accessories"
        ],
        "trending_colors": [
            "Pastel Pink", "Lavender", "Mint Green", "Coral", "Baby Blue",
            "Soft Yellow", "Lilac", "Peach"
        ],
        "trending_categories": [
            "K-Fashion", "Kawaii", "Street Style", "Tech Wear", "Harajuku",
            "J-Fashion", "Cute Culture", "Futuristic", "Anime-inspired",
            "Pastel Goth", "Decora", "Visual Kei"
        ],
        "growth_percentage": [55, 41, 47, 36, 52, 45, 49, 38, 43, 40, 46, 42]
    },
    "South America": {
        "trending_items": [
            "Flowy Dresses", "Denim Jackets", "Espadrilles", "Crossbody Bags",
            "Crochet Tops", "High-waist Bikinis", "Colorful Scarves", "Sandals",
            "Embroidered Blouses", "Maxi Skirts", "Fringe Accessories", "Woven Belts"
        ],
        "trending_colors": [
            "Sunset Orange", "Ocean Blue", "Golden Yellow", "Pure White",
            "Tropical Green", "Coral Pink", "Turquoise", "Warm Red"
        ],
        "trending_categories": [
            "Bohemian", "Tropical", "Festival Wear", "Beachwear", "Artisanal",
            "Folk-inspired", "Carnival Fashion", "Resort Wear", "Handmade",
            "Cultural Fusion", "Sustainable Crafts", "Vibrant Prints"
        ],
        "growth_percentage": [39, 44, 31, 28, 42, 37, 35, 40, 38, 33, 36, 34]
    },
    "Middle East": {
        "trending_items": [
            "Modest Wear", "Luxury Abayas", "Designer Hijabs", "Kaftan Dresses",
            "Embellished Tunics", "Wide-leg Pants", "Statement Jewelry", "Pointed Flats",
            "Silk Blouses", "Long Cardigans", "Beaded Accessories", "Metallic Bags"
        ],
        "trending_colors": [
            "Deep Emerald", "Rich Gold", "Royal Blue", "Ivory", "Bronze",
            "Jewel Tones", "Midnight Black", "Pearl White"
        ],
        "trending_categories": [
            "Modest Fashion", "Luxury Modest", "Traditional Fusion", "Contemporary Islamic",
            "Elegant Casual", "Formal Modest", "Cultural Heritage", "Modern Abaya",
            "Hijab Fashion", "Ramadan Special", "Eid Collection", "Desert Elegance"
        ],
        "growth_percentage": [48, 45, 52, 38, 43, 41, 46, 35, 40, 37, 44, 39]
    },
    "Africa": {
        "trending_items": [
            "Ankara Prints", "Dashiki Shirts", "Kente Accessories", "Beaded Jewelry",
            "Mud Cloth Bags", "Colorful Headwraps", "Traditional Sandals", "Wax Print Dresses",
            "Cowrie Shell Jewelry", "Leather Goods", "Handwoven Fabrics", "Cultural Robes"
        ],
        "trending_colors": [
            "Vibrant Orange", "Deep Red", "Golden Yellow", "Royal Purple",
            "Earth Brown", "Bright Green", "Indigo Blue", "Sunset Pink"
        ],
        "trending_categories": [
            "Afrocentric", "Traditional Prints", "Cultural Heritage", "Handcrafted",
            "Tribal Fusion", "Contemporary African", "Sustainable Crafts", "Diaspora Fashion",
            "Pan-African", "Artisanal", "Heritage Wear", "Modern Traditional"
        ],
        "growth_percentage": [51, 47, 44, 39, 42, 46, 38, 43, 40, 45, 41, 37]
    },
    "Australia & Oceania": {
        "trending_items": [
            "Surf Wear", "Linen Shirts", "Flip Flops", "Sun Hats",
            "Maxi Dresses", "Denim Shorts", "Casual Sneakers", "Beach Cover-ups",
            "Outdoor Gear", "Relaxed Blazers", "Canvas Bags", "Minimal Jewelry"
        ],
        "trending_colors": [
            "Ocean Blue", "Sandy Beige", "Coral", "Seafoam Green",
            "Sunset Orange", "Natural White", "Dusty Rose", "Eucalyptus Green"
        ],
        "trending_categories": [
            "Beach Casual", "Surf Culture", "Outdoor Lifestyle", "Relaxed Luxury",
            "Sustainable Beach", "Minimalist", "Island Living", "Adventure Wear",
            "Laid-back Chic", "Natural Fabrics", "Eco-Friendly", "Coastal Style"
        ],
        "growth_percentage": [43, 38, 41, 35, 39, 42, 37, 40, 36, 44, 33, 38]
    },
    "Eastern Europe": {
        "trending_items": [
            "Fur-lined Coats", "Knee-high Boots", "Wool Sweaters", "Statement Hats",
            "Layered Scarves", "Leather Jackets", "Warm Accessories", "Tailored Coats",
            "Chunky Knits", "Designer Boots", "Vintage Jewelry", "Structured Bags"
        ],
        "trending_colors": [
            "Deep Burgundy", "Charcoal Gray", "Forest Green", "Cream",
            "Rich Brown", "Navy Blue", "Wine Red", "Stone Gray"
        ],
        "trending_categories": [
            "Winter Chic", "Soviet Vintage", "Slavic Heritage", "Luxury Warmth",
            "Folk Revival", "Contemporary Classic", "Urban Elegance", "Cultural Fusion",
            "Heritage Craft", "Modern Traditional", "Artisanal", "Sophisticated Casual"
        ],
        "growth_percentage": [44, 41, 47, 36, 43, 39, 45, 38, 42, 40, 37, 41]
    },
    "Southeast Asia": {
        "trending_items": [
            "Batik Prints", "Silk Scarves", "Woven Bags", "Traditional Jewelry",
            "Tropical Prints", "Sandals", "Light Fabrics", "Cultural Accessories",
            "Embroidered Tops", "Flowing Pants", "Natural Fibers", "Artisan Crafts"
        ],
        "trending_colors": [
            "Tropical Green", "Sunset Orange", "Ocean Blue", "Golden Yellow",
            "Coral Pink", "Jade Green", "Warm Brown", "Ivory White"
        ],
        "trending_categories": [
            "Tropical Chic", "Cultural Heritage", "Artisanal", "Sustainable Fashion",
            "Traditional Fusion", "Island Style", "Handcrafted", "Natural Fabrics",
            "Cultural Pride", "Modern Traditional", "Eco-Conscious", "Heritage Wear"
        ],
        "growth_percentage": [46, 43, 40, 37, 44, 41, 38, 45, 39, 42, 36, 40]
    },
    "Caribbean": {
        "trending_items": [
            "Vibrant Prints", "Flowing Dresses", "Sandals", "Straw Hats",
            "Bright Accessories", "Beach Wear", "Colorful Jewelry", "Light Fabrics",
            "Cultural Prints", "Casual Wear", "Tropical Accessories", "Island Style"
        ],
        "trending_colors": [
            "Caribbean Blue", "Sunset Yellow", "Coral Pink", "Lime Green",
            "Turquoise", "Bright Orange", "Hot Pink", "Pure White"
        ],
        "trending_categories": [
            "Island Fashion", "Caribbean Culture", "Tropical Casual", "Festival Wear",
            "Beach Chic", "Carnival Fashion", "Vibrant Prints", "Cultural Heritage",
            "Relaxed Luxury", "Sustainable Island", "Handmade", "Diaspora Style"
        ],
        "growth_percentage": [42, 39, 45, 36, 43, 40, 37, 44, 38, 41, 35, 39]
    }
}

# Seasonal trends
SEASONAL_TRENDS = {
    "Spring": {
        "colors": ["Pastel Pink", "Soft Green", "Lavender", "Baby Blue", "Cream"],
        "items": ["Light Cardigans", "Floral Dresses", "Canvas Sneakers", "Denim Jackets"],
        "categories": ["Romantic", "Fresh", "Casual", "Layering"]
    },
    "Summer": {
        "colors": ["Bright Yellow", "Coral", "Turquoise", "White", "Neon Green"],
        "items": ["Sundresses", "Sandals", "Shorts", "Tank Tops", "Sun Hats"],
        "categories": ["Beach Wear", "Casual", "Tropical", "Minimalist"]
    },
    "Fall": {
        "colors": ["Rust Orange", "Deep Red", "Forest Green", "Brown", "Burgundy"],
        "items": ["Sweaters", "Boots", "Scarves", "Coats", "Layered Jewelry"],
        "categories": ["Cozy", "Layered", "Warm Tones", "Classic"]
    },
    "Winter": {
        "colors": ["Navy Blue", "Charcoal", "Cream", "Deep Purple", "Emerald"],
        "items": ["Heavy Coats", "Boots", "Knitwear", "Accessories", "Formal Wear"],
        "categories": ["Luxury", "Warmth", "Formal", "Holiday"]
    }
}

# Influencer and celebrity impact data
INFLUENCER_IMPACT = {
    "celebrity_endorsements": [
        {"name": "Taylor Swift", "impact_item": "Cardigans", "growth_boost": 65},
        {"name": "Rihanna", "impact_item": "Fenty Beauty", "growth_boost": 78},
        {"name": "Zendaya", "impact_item": "Vintage Fashion", "growth_boost": 52},
        {"name": "Harry Styles", "impact_item": "Gender-Neutral Fashion", "growth_boost": 71},
        {"name": "Billie Eilish", "impact_item": "Oversized Clothing", "growth_boost": 68}
    ],
    "social_media_trends": [
        {"platform": "TikTok", "trending_hashtag": "#OOTD", "influence_score": 85},
        {"platform": "Instagram", "trending_hashtag": "#ThriftFlip", "influence_score": 72},
        {"platform": "Pinterest", "trending_hashtag": "#SustainableFashion", "influence_score": 69},
        {"platform": "YouTube", "trending_hashtag": "#StyleChallenge", "influence_score": 63}
    ]
}

@app.route('/')
def home():
    return jsonify({
        "message": "Fashion Trends API - Enhanced Version",
        "version": "2.0",
        "regions_covered": list(SAMPLE_TRENDS_DATA.keys()),
        "total_regions": len(SAMPLE_TRENDS_DATA),
        "endpoints": [
            "/api/trends",
            "/api/trends/<region>",
            "/api/trending-colors",
            "/api/trending-items",
            "/api/analytics",
            "/api/seasonal-trends",
            "/api/influencer-impact",
            "/api/regional-comparison"
        ]
    })

@app.route('/api/trends', methods=['GET'])
def get_all_trends():
    """Get trending data for all regions"""
    try:
        region = request.args.get('region', 'all')
        
        if region.lower() == 'all':
            return jsonify({
                "status": "success",
                "data": SAMPLE_TRENDS_DATA,
                "regions_count": len(SAMPLE_TRENDS_DATA),
                "timestamp": datetime.now().isoformat()
            })
        else:
            region_data = SAMPLE_TRENDS_DATA.get(region.title().replace('_', ' '))
            if region_data:
                return jsonify({
                    "status": "success",
                    "region": region.title().replace('_', ' '),
                    "data": region_data,
                    "timestamp": datetime.now().isoformat()
                })
            else:
                return jsonify({
                    "status": "error",
                    "message": "Region not found",
                    "available_regions": list(SAMPLE_TRENDS_DATA.keys())
                }), 404
                
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/trends/<region>', methods=['GET'])
def get_region_trends(region):
    """Get trending data for specific region"""
    try:
        region_formatted = region.title().replace('_', ' ')
        # Handle special cases for region names
        region_mapping = {
            'Middle_East': 'Middle East',
            'Eastern_Europe': 'Eastern Europe',
            'Southeast_Asia': 'Southeast Asia',
            'Australia_Oceania': 'Australia & Oceania'
        }
        
        if region in region_mapping:
            region_formatted = region_mapping[region]
        
        region_data = SAMPLE_TRENDS_DATA.get(region_formatted)
        
        if region_data:
            return jsonify({
                "status": "success",
                "region": region_formatted,
                "data": region_data,
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "status": "error",
                "message": f"Region '{region}' not found",
                "available_regions": list(SAMPLE_TRENDS_DATA.keys())
            }), 404
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/trending-colors', methods=['GET'])
def get_trending_colors():
    """Get trending colors across all regions"""
    try:
        region_filter = request.args.get('region', 'all')
        all_colors = []
        
        regions_to_process = SAMPLE_TRENDS_DATA.keys() if region_filter.lower() == 'all' else [region_filter.title().replace('_', ' ')]
        
        for region in regions_to_process:
            if region in SAMPLE_TRENDS_DATA:
                data = SAMPLE_TRENDS_DATA[region]
                for color in data['trending_colors']:
                    all_colors.append({
                        "color": color,
                        "region": region,
                        "popularity_score": random.randint(70, 95),
                        "season_relevance": random.choice(["Spring", "Summer", "Fall", "Winter"])
                    })
        
        # Sort by popularity score
        all_colors.sort(key=lambda x: x['popularity_score'], reverse=True)
        
        return jsonify({
            "status": "success",
            "data": all_colors,
            "total_colors": len(all_colors),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/trending-items', methods=['GET'])
def get_trending_items():
    """Get trending fashion items across all regions"""
    try:
        region_filter = request.args.get('region', 'all')
        limit = request.args.get('limit', type=int)
        
        all_items = []
        regions_to_process = SAMPLE_TRENDS_DATA.keys() if region_filter.lower() == 'all' else [region_filter.title().replace('_', ' ')]
        
        for region in regions_to_process:
            if region in SAMPLE_TRENDS_DATA:
                data = SAMPLE_TRENDS_DATA[region]
                for i, item in enumerate(data['trending_items']):
                    all_items.append({
                        "item": item,
                        "region": region,
                        "growth_percentage": data['growth_percentage'][i],
                        "category": data['trending_categories'][i] if i < len(data['trending_categories']) else "General",
                        "price_range": random.choice(["Budget", "Mid-range", "Luxury"]),
                        "sustainability_score": random.randint(60, 95)
                    })
        
        # Sort by growth percentage
        all_items.sort(key=lambda x: x['growth_percentage'], reverse=True)
        
        # Apply limit if specified
        if limit:
            all_items = all_items[:limit]
        
        return jsonify({
            "status": "success",
            "data": all_items,
            "total_items": len(all_items),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data for dashboard"""
    try:
        # Calculate overall statistics
        total_trends = sum(len(data['trending_items']) for data in SAMPLE_TRENDS_DATA.values())
        total_colors = sum(len(data['trending_colors']) for data in SAMPLE_TRENDS_DATA.values())
        avg_growth = sum(sum(data['growth_percentage']) for data in SAMPLE_TRENDS_DATA.values()) / total_trends
        
        # Top performing regions
        region_performance = []
        for region, data in SAMPLE_TRENDS_DATA.items():
            avg_region_growth = sum(data['growth_percentage']) / len(data['growth_percentage'])
            region_performance.append({
                "region": region,
                "average_growth": round(avg_region_growth, 2),
                "total_trends": len(data['trending_items']),
                "total_colors": len(data['trending_colors']),
                "diversity_score": round(len(set(data['trending_categories'])) / len(data['trending_categories']) * 100, 2)
            })
        
        region_performance.sort(key=lambda x: x['average_growth'], reverse=True)
        
        # Calculate top categories globally
        all_categories = []
        for data in SAMPLE_TRENDS_DATA.values():
            all_categories.extend(data['trending_categories'])
        
        category_counts = {}
        for category in all_categories:
            category_counts[category] = category_counts.get(category, 0) + 1
        
        top_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return jsonify({
            "status": "success",
            "data": {
                "total_trends_tracked": total_trends,
                "total_colors_tracked": total_colors,
                "total_regions": len(SAMPLE_TRENDS_DATA),
                "global_average_growth": round(avg_growth, 2),
                "top_performing_regions": region_performance[:5],
                "top_categories": [{"category": cat[0], "frequency": cat[1]} for cat in top_categories],
                "last_updated": datetime.now().isoformat(),
                "data_coverage": list(SAMPLE_TRENDS_DATA.keys()),
                "growth_range": {
                    "min": min(min(data['growth_percentage']) for data in SAMPLE_TRENDS_DATA.values()),
                    "max": max(max(data['growth_percentage']) for data in SAMPLE_TRENDS_DATA.values())
                }
            }
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/seasonal-trends', methods=['GET'])
def get_seasonal_trends():
    """Get seasonal fashion trends"""
    try:
        season = request.args.get('season', 'all')
        
        if season.lower() == 'all':
            return jsonify({
                "status": "success",
                "data": SEASONAL_TRENDS,
                "timestamp": datetime.now().isoformat()
            })
        else:
            season_data = SEASONAL_TRENDS.get(season.title())
            if season_data:
                return jsonify({
                    "status": "success",
                    "season": season.title(),
                    "data": season_data,
                    "timestamp": datetime.now().isoformat()
                })
            else:
                return jsonify({
                    "status": "error",
                    "message": "Season not found",
                    "available_seasons": list(SEASONAL_TRENDS.keys())
                }), 404
                
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/influencer-impact', methods=['GET'])
def get_influencer_impact():
    """Get influencer and celebrity impact on fashion trends"""
    try:
        return jsonify({
            "status": "success",
            "data": INFLUENCER_IMPACT,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/regional-comparison', methods=['GET'])
def get_regional_comparison():
    """Compare fashion trends between regions"""
    try:
        regions = request.args.getlist('regions')
        if not regions:
            regions = list(SAMPLE_TRENDS_DATA.keys())[:3]  # Default to first 3 regions
        
        comparison_data = {}
        for region in regions:
            if region in SAMPLE_TRENDS_DATA:
                data = SAMPLE_TRENDS_DATA[region]
                comparison_data[region] = {
                    "top_items": data['trending_items'][:5],
                    "top_colors": data['trending_colors'][:5],
                    "avg_growth": round(sum(data['growth_percentage']) / len(data['growth_percentage']), 2),
                    "dominant_categories": list(set(data['trending_categories'][:5]))
                }
        
        return jsonify({
            "status": "success",
            "data": comparison_data,
            "regions_compared": len(comparison_data),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "available_endpoints": [
            "/api/trends",
            "/api/trends/<region>",
            "/api/trending-colors",
            "/api/trending-items",
            "/api/analytics",
            "/api/seasonal-trends",
            "/api/influencer-impact",
            "/api/regional-comparison"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)