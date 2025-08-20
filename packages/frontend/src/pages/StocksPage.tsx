import { AssetPage } from '../components/AssetPage';
import { stockConfig } from '../config/assets';
import { mockStocksData } from '../data/mockData';
import { Stock, StockIndex } from '@/types/asset';

export function StocksPage() {
  const handleRowClick = (stock: Stock) => {
    // TODO: Navigate to detailed stock view
    console.log('Selected stock:', stock.symbol);
  };

  const handleIndexChange = (index: StockIndex) => {
    // TODO: Fetch data for selected index
    console.log('Index changed to:', index);
  };

  return (
    <AssetPage
      config={stockConfig}
      data={mockStocksData}
      onRowClick={handleRowClick}
      onIndexChange={handleIndexChange}
    />
  );
}