// packages/frontend/src/components/stocks/StockCard.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import clsx from 'clsx';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  marketCap?: string;
}

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  marketCap,
}) => {
  const isPositive = change >= 0;
  const isNeutral = change === 0;

  return (
    <div className="group card card-hover p-6 relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className={clsx(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        isPositive && "bg-gradient-to-br from-success-500 to-success-600",
        change < 0 && "bg-gradient-to-br from-danger-500 to-danger-600",
        isNeutral && "bg-gradient-to-br from-gray-500 to-gray-600"
      )}></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {symbol}
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-400 line-clamp-1">
            {name}
          </p>
        </div>
        
        {/* Trend Icon */}
        <div className={clsx(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
          isPositive && "bg-success-100 dark:bg-success-900/30",
          change < 0 && "bg-danger-100 dark:bg-danger-900/30",
          isNeutral && "bg-gray-100 dark:bg-dark-700"
        )}>
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
          ) : change < 0 ? (
            <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
          ) : (
            <Activity className="w-5 h-5 text-gray-600 dark:text-dark-400" />
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-4 relative z-10">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-mono">
          ${price.toFixed(2)}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={clsx(
            "text-sm font-semibold",
            isPositive && "text-success-600 dark:text-success-400",
            change < 0 && "text-danger-600 dark:text-danger-400",
            isNeutral && "text-gray-600 dark:text-dark-400"
          )}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}
          </span>
          
          <span className={clsx(
            "text-xs font-medium px-2 py-1 rounded-full",
            isPositive && "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
            change < 0 && "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400",
            isNeutral && "bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-dark-400"
          )}>
            {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Additional Info */}
      {(volume || marketCap) && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-dark-700 relative z-10">
          {volume && (
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-500 uppercase tracking-wider font-medium">
                Volume
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {volume}
              </p>
            </div>
          )}
          
          {marketCap && (
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-500 uppercase tracking-wider font-medium">
                Market Cap
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {marketCap}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hover Effect Line */}
      <div className={clsx(
        "absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300",
        isPositive && "bg-gradient-to-r from-success-500 to-success-600",
        change < 0 && "bg-gradient-to-r from-danger-500 to-danger-600",
        isNeutral && "bg-gradient-to-r from-gray-500 to-gray-600"
      )}></div>
    </div>
  );
};

export default StockCard;