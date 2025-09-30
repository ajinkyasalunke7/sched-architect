import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, InputAdornment, Paper, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';

const DataTable = ({ columns, rows, loading, onRowClick }) => {
  const [searchText, setSearchText] = useState('');
  const [filterColumn, setFilterColumn] = useState('all');
  const [sortModel, setSortModel] = useState([]);

  const filterableColumns = columns.filter(col => col.field !== 'actions');

  const filteredRows = rows.filter((row) => {
    const searchLower = searchText.toLowerCase();
    
    if (filterColumn === 'all') {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      );
    } else {
      const value = row[filterColumn];
      return String(value).toLowerCase().includes(searchLower);
    }
  });

  return (
    <Paper elevation={0} sx={{ width: '100%', bgcolor: 'hsl(var(--card))', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid hsl(var(--border))', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by column</InputLabel>
          <Select
            value={filterColumn}
            label="Filter by column"
            onChange={(e) => setFilterColumn(e.target.value)}
            startAdornment={<FilterIcon sx={{ mr: 1, ml: 1 }} />}
          >
            <MenuItem value="all">All columns</MenuItem>
            {filterableColumns.map((col) => (
              <MenuItem key={col.field} value={col.field}>
                {col.headerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {searchText && (
          <Chip
            label={`Searching: "${searchText}"`}
            onDelete={() => setSearchText('')}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        onRowClick={onRowClick}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid hsl(var(--border))',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'hsl(var(--muted))',
            borderBottom: '2px solid hsl(var(--border))',
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: 'hsl(var(--muted) / 0.5)',
            cursor: 'pointer',
          },
        }}
      />
    </Paper>
  );
};

export default DataTable;
