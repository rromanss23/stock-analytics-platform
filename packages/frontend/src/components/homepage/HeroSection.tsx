import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3 } from 'lucide-react'; // Fixed icon names

const HeroSection: React.FC = () => {
  return (
    <div className="card p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-white" /> {/* Changed from TrendingUpIcon */}
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Stock Analytics Platform
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Advanced stock market analysis with AI-powered predictions and real-time insights.
        Track your favorite stocks and make informed investment decisions.
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          to="/stocks"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <BarChart3 className="w-5 h-5" /> {/* Changed from BarChart3Icon */}
          <span>View Stocks</span>
        </Link>
        
        <button className="btn-secondary">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default HeroSection;