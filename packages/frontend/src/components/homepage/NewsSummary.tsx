import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react'; // Changed NewsIcon to Newspaper

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  impact: 'positive' | 'negative' | 'neutral';
}

const NewsSummary: React.FC = () => {
  // Mock data - will be replaced with real API data
  const mockNews: NewsItem[] = [
    {
      id: 1,
      title: "Tech Stocks Rally on AI Breakthrough",
      summary: "Major technology companies see significant gains following latest AI developments...",
      timestamp: "2 hours ago",
      impact: "positive"
    },
    {
      id: 2,
      title: "Federal Reserve Holds Interest Rates Steady",
      summary: "Markets respond positively to Fed's decision to maintain current interest rates...",
      timestamp: "4 hours ago",
      impact: "neutral"
    },
    {
      id: 3,
      title: "Energy Sector Faces Headwinds",
      summary: "Oil prices decline affects energy stocks across the board...",
      timestamp: "6 hours ago",
      impact: "negative"
    }
  ];

  const getImpactColor = (impact: NewsItem['impact']) => {
    switch (impact) {
      case 'positive': return 'text-success-600 bg-success-50';
      case 'negative': return 'text-danger-600 bg-danger-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Newspaper className="w-6 h-6 text-primary-500" /> {/* Changed from NewsIcon */}
        <h2 className="text-2xl font-bold text-gray-900">
          Market News Summary
        </h2>
      </div>

      <div className="space-y-4">
        {mockNews.map((news) => (
          <div
            key={news.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 flex-1">
                {news.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(news.impact)}`}>
                {news.impact}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">
              {news.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{news.timestamp}</span>
              <ExternalLink className="w-4 h-4 text-gray-400" /> {/* Changed from ExternalLinkIcon */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSummary;