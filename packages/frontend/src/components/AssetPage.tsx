// packages/frontend/src/components/AssetPage.tsx
import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import { BaseAsset, AssetConfig } from '@/types/asset';

interface AssetPageProps<T extends BaseAsset, I extends string> {
  config: AssetConfig<T, I>;
  data: T[];
  onRowClick?: (asset: T) => void;
  onIndexChange?: (index: I) => void;
}

export function AssetPage<T extends BaseAsset, I extends string>({
  config,
  data,
  onRowClick,
  onIndexChange
}: AssetPageProps<T, I>) {
  const [selectedIndex, setSelectedIndex] = useState<I>(config.defaultIndex);

  const handleIndexChange = (newIndex: I) => {
    setSelectedIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const handleRowClick = (params: GridRowParams) => {
    onRowClick?.(params.row as T);
  };

  // Convert config columns to DataGrid columns with proper type handling
  const columns: GridColDef[] = config.columns.map((col) => ({
    field: col.field as string,
    headerName: col.headerName,
    width: col.width,
    align: col.align || 'left',
    headerAlign: col.headerAlign || col.align || 'left',
    renderCell: col.renderCell ? (params: GridRenderCellParams) => {
      // Transform MUI params to our simplified format
      const transformedParams = {
        value: params.value,
        row: params.row as T
      };
      return col.renderCell!(transformedParams);
    } : undefined,
  }));

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          {config.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {config.description}
        </Typography>
      </Box>

      {/* Index/Category Selector */}
      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>
                Select {config.assetType === 'stock' ? 'Index' : 
                       config.assetType === 'crypto' ? 'Category' : 'Sector'}
              </InputLabel>
              <Select
                value={selectedIndex}
                label={`Select ${config.assetType === 'stock' ? 'Index' : 
                              config.assetType === 'crypto' ? 'Category' : 'Sector'}`}
                onChange={(e) => handleIndexChange(e.target.value as I)}
              >
                {config.indexOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Chip 
              label={`${data.length} ${config.assetType}${data.length !== 1 ? 's' : ''}`} 
              variant="outlined" 
              color="primary" 
            />
          </Box>
        </CardContent>
      </Card>

      {/* Assets Data Grid */}
      <Card elevation={1}>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
              sorting: {
                sortModel: [{ 
                  field: config.assetType === 'stock' ? 'marketCap' : 'currentPrice', 
                  sort: 'desc' 
                }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            onRowClick={handleRowClick}
            sx={{
              border: 'none',
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
                cursor: 'pointer'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.50',
                borderBottom: '2px solid',
                borderColor: 'divider'
              },
              '& .MuiDataGrid-cell': {
                borderColor: 'divider'
              }
            }}
            disableRowSelectionOnClick
            autoHeight
          />
        </CardContent>
      </Card>
    </Box>
  );
}