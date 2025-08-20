import { AssetPage } from '../components/AssetPage';
import { commodityConfig } from '../config/assets';
import { mockCommoditiesData } from '../data/mockData';
import { Commodity, CommodityIndex } from '@/types/asset';

export function CommoditiesPage() {
  const handleRowClick = (commodity: Commodity) => {
    // TODO: Navigate to detailed commodity view
    console.log('Selected commodity:', commodity.symbol);
  };

  const handleIndexChange = (index: CommodityIndex) => {
    // TODO: Fetch data for selected sector
    console.log('Sector changed to:', index);
  };

  return (
    <AssetPage
      config={commodityConfig}
      data={mockCommoditiesData}
      onRowClick={handleRowClick}
      onIndexChange={handleIndexChange}
    />
  );
}