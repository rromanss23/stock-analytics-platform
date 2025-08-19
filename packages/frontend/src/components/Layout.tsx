// packages/frontend/src/components/Layout.tsx
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-transparent to-transparent dark:from-primary-950 dark:via-transparent dark:to-transparent opacity-30"></div>
        
        <div className="relative container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 dark:border-dark-800 bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-dark-400 mb-4 md:mb-0">
              © 2024 StockAnalytics Platform. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;