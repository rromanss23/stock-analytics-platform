// packages/frontend/src/components/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Bitcoin, DollarSign } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/stocks', icon: TrendingUp, label: 'Stocks' },
  ];

  const cryptoIcons = [
    { icon: Bitcoin, label: 'Bitcoin', color: 'text-orange-500' },
    { icon: DollarSign, label: 'Dollar', color: 'text-green-500' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Modern Logo */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                  StockAnalytics
                </span>
                <div className="text-xs text-gray-500 dark:text-dark-400 font-medium">
                  Financial Intelligence
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium 
                      transition-all duration-200 group
                      ${isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                        : 'text-gray-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-800'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Crypto Status Indicators */}
            <div className="hidden lg:flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200 dark:border-dark-700">
              {cryptoIcons.map((crypto, index) => {
                const Icon = crypto.icon;
                return (
                  <div
                    key={index}
                    className="group relative cursor-pointer"
                    title={crypto.label}
                  >
                    <div className="w-9 h-9 bg-gray-100 dark:bg-dark-800 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md dark:group-hover:shadow-dark-md">
                      <Icon className={`w-4 h-4 ${crypto.color} transition-transform duration-200 group-hover:scale-110`} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-success-400 to-success-500 rounded-full shadow-sm"></div>
                  </div>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div className="ml-4">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;