import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, InputAdornment, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const DataTable = ({ columns, rows, loading, onRowClick }) => {
  const [searchText, setSearchText] = useState('');

  const filteredRows = rows.filter((row) => {
    const searchLower = searchText.toLowerCase();
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchLower)
    );
  });

  return (
    <Paper elevation={0} sx={{ width: '100%', bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid hsl(220 15% 88%)' }}>
        <TextField
          fullWidth
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
          sx={{ maxWidth: 400 }}
        />
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        onRowClick={onRowClick}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid hsl(220 15% 92%)',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'hsl(220 20% 97%)',
            borderBottom: '2px solid hsl(220 15% 88%)',
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: 'hsl(220 20% 98%)',
            cursor: 'pointer',
          },
        }}
      />
    </Paper>
  );
};

export default DataTable;
