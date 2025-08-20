import { useNavigate } from 'react-router-dom';
import { AssetPage } from '../components/AssetPage';
import { stockConfig } from '../config/assets';
import { mockStocksData } from '../data/mockData';
import { Stock, StockIndex } from '@/types/asset';

export function StocksPage() {
  const navigate = useNavigate();

  const handleRowClick = (stock: Stock) => {
    navigate(`/stocks/${stock.symbol}`);
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