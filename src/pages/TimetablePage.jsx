import { Box, Typography, Button, Alert } from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import TimetableGrid from '../features/timetable/TimetableGrid';
import { useSelector } from 'react-redux';

const TimetablePage = () => {
  const generationStatus = useSelector((state) => state.timetable.generationStatus);

  const handleExport = () => {
    // Mock export functionality
    alert('Export feature coming soon!');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Interactive Timetable
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Drag and drop classes to rearrange the schedule
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ textTransform: 'none' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(220 70% 45%), hsl(265 60% 50%))',
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {generationStatus === 'completed' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Timetable has been successfully generated! You can now drag and drop classes to make adjustments.
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: 'hsl(220 70% 50%)' }} />
            <Typography variant="body2">Major</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: 'hsl(265 60% 55%)' }} />
            <Typography variant="body2">Minor</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: 'hsl(180 65% 50%)' }} />
            <Typography variant="body2">Skill</Typography>
          </Box>
        </Box>
      </Box>

      <TimetableGrid />
    </Box>
  );
};

export default TimetablePage;
