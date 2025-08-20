// packages/frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Homepage } from './pages/Homepage';
import { StocksPage } from './pages/StocksPage';
import { CryptoPage } from './pages/CryptoPage';
import { CommoditiesPage } from './pages/CommoditiesPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { Layout } from './components/Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/stocks/:symbol" element={<AssetDetailPage assetType="stock" />} />
            <Route path="/crypto" element={<CryptoPage />} />
            <Route path="/crypto/:symbol" element={<AssetDetailPage assetType="crypto" />} />
            <Route path="/commodities" element={<CommoditiesPage />} />
            <Route path="/commodities/:symbol" element={<AssetDetailPage assetType="commodity" />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;