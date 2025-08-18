import React from 'react';
import HeroSection from './homepage/HeroSection';
import NewsSummary from './homepage/NewsSummary';
import MicroCharts from '../components/homepage/MicroCharts';

const Homepage: React.FC = () => {
  return (
    <div className="space-y-8">
      <HeroSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NewsSummary />
        <MicroCharts />
      </div>
    </div>
  );
};

export default Homepage;