import { AssetPage } from '../components/AssetPage';
import { cryptoConfig } from '../config/assets';
import { mockCryptoData } from '../data/mockData';
import { Crypto, CryptoIndex } from '@/types/asset';

export function CryptoPage() {
  const handleRowClick = (crypto: Crypto) => {
    // TODO: Navigate to detailed crypto view
    console.log('Selected crypto:', crypto.symbol);
  };

  const handleIndexChange = (index: CryptoIndex) => {
    // TODO: Fetch data for selected category
    console.log('Category changed to:', index);
  };

  return (
    <AssetPage
      config={cryptoConfig}
      data={mockCryptoData}
      onRowClick={handleRowClick}
      onIndexChange={handleIndexChange}
    />
  );
}