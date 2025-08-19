// packages/frontend/src/components/homepage/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Sparkles, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 dark:from-primary-950 dark:via-dark-900 dark:to-indigo-950 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-300 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="relative card-glass p-12 text-center">
        {/* Icon with Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <TrendingUp className="w-10 h-10 text-white" />
              <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-gray-900 via-primary-700 to-blue-800 dark:from-white dark:via-primary-300 dark:to-blue-400 bg-clip-text text-transparent">
            Stock Analytics
          </span>
          <br />
          <span className="text-gray-700 dark:text-dark-200">
            Platform
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Advanced stock market analysis with{' '}
          <span className="font-semibold text-primary-600 dark:text-primary-400">AI-powered predictions</span>
          {' '}and real-time insights. Track your favorite stocks and make{' '}
          <span className="font-semibold text-success-600 dark:text-success-400">informed investment decisions</span>.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Real-time Data', 'AI Predictions', 'Portfolio Tracking', 'Market Insights'].map((feature) => (
            <div
              key={feature}
              className="badge badge-primary px-4 py-2 text-sm font-medium backdrop-blur-sm"
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/stocks"
            className="group btn-primary inline-flex items-center space-x-3 text-lg px-8 py-4 relative overflow-hidden"
          >
            <div className="flex items-center space-x-3 relative z-10">
              <BarChart3 className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
              <span>Explore Stocks</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <button className="group btn-outline inline-flex items-center space-x-3 text-lg px-8 py-4 relative overflow-hidden">
            <div className="flex items-center space-x-3 relative z-10">
              <Sparkles className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
              <span>Learn More</span>
            </div>
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Traders', value: '50K+', color: 'text-primary-600 dark:text-primary-400' },
            { label: 'Market Coverage', value: '99.9%', color: 'text-success-600 dark:text-success-400' },
            { label: 'Prediction Accuracy', value: '94%', color: 'text-accent-purple' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group transform transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <span className={stat.color}>{stat.value}</span>
              </div>
              <div className="text-gray-600 dark:text-dark-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;