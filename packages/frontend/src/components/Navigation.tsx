import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Bitcoin, DollarSign } from 'lucide-react'; // Fixed icon names

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' }, // Changed from HomeIcon
    { path: '/stocks', icon: TrendingUp, label: 'Stocks' }, // Changed from TrendingUpIcon
  ];

  const cryptoIcons = [
    { icon: Bitcoin, label: 'Bitcoin' }, // Changed from BitcoinIcon
    { icon: DollarSign, label: 'Dollar' }, // Changed from DollarSignIcon
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" /> {/* Changed from TrendingUpIcon */}
              </div>
              <span className="text-xl font-bold text-gray-900">
                StockAnalytics
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Crypto Icons */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              {cryptoIcons.map((crypto, index) => {
                const Icon = crypto.icon;
                return (
                  <div
                    key={index}
                    className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"
                    title={crypto.label}
                  >
                    <Icon className="w-4 h-4 text-orange-600" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;