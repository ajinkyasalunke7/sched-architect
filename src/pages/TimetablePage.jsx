import { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import TimetableGrid from '../features/timetable/TimetableGrid';
import TimetableViewSwitcher from '../components/TimetableViewSwitcher';
import ExportMenu from '../components/ExportMenu';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTimetableAsync } from '../app/slices/timetableSlice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TimetablePage = () => {
  const dispatch = useDispatch();
  const generationStatus = useSelector((state) => state.timetable.generationStatus);
  const timetableData = useSelector((state) => state.timetable.data);
  const courses = useSelector((state) => state.courses.data);
  const faculty = useSelector((state) => state.faculty.data);
  const rooms = useSelector((state) => state.rooms.data);
  
  const [view, setView] = useState('weekly');
  const [exportAnchor, setExportAnchor] = useState(null);

  const handleRefresh = () => {
    dispatch(fetchTimetableAsync());
  };

  const handleExportClick = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('Academic Timetable', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

    const tableData = timeSlots.map(time => {
      const row = [time];
      days.forEach(day => {
        const slot = timetableData[day]?.[time];
        if (slot) {
          const course = courses.find(c => c.id === slot.courseId);
          const fac = faculty.find(f => f.id === slot.facultyId);
          const room = rooms.find(r => r.id === slot.roomId);
          row.push(`${course?.code || ''}\n${fac?.name?.split(' ').slice(-1)[0] || ''}\n${room?.name || ''}`);
        } else {
          row.push('-');
        }
      });
      return row;
    });

    doc.autoTable({
      head: [['Time', ...days]],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] },
      styles: { fontSize: 8 },
    });

    doc.save(`timetable-${Date.now()}.pdf`);
    setExportAnchor(null);
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TimetableViewSwitcher view={view} onChange={setView} />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ textTransform: 'none' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportClick}
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

      <ExportMenu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
        data={[]}
        type="Timetable"
      />

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

      <TimetableGrid view={view} />
    </Box>
  );
};

export default TimetablePage;
