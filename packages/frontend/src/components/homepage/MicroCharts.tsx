import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MicroCharts: React.FC = () => {
  const mockStocks = [
    { symbol: 'AAPL', price: 185.25, change: 2.45, changePercent: 1.34 },
    { symbol: 'GOOGL', price: 142.80, change: -1.20, changePercent: -0.83 },
    { symbol: 'MSFT', price: 378.91, change: 5.67, changePercent: 1.52 },
    { symbol: 'TSLA', price: 248.50, change: -3.21, changePercent: -1.27 },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Followed Assets
      </h2>
      
      <div className="space-y-4">
        {mockStocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900">{stock.symbol}</div>
              <div className="text-sm text-gray-600">${stock.price}</div>
            </div>
            
            <div className="flex items-center space-x-2">
              {stock.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-500" />
              )}
              
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  stock.change >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change}
                </div>
                <div className={`text-xs ${
                  stock.change >= 0 ? 'text-success-500' : 'text-danger-500'
                }`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicroCharts;