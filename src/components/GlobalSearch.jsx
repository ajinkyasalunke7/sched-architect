import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  MenuBook as CourseIcon,
  Person as FacultyIcon,
  MeetingRoom as RoomIcon,
  EventNote as ScheduleIcon,
} from '@mui/icons-material';

const GlobalSearch = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const courses = useSelector((state) => state.courses.data);
  const faculty = useSelector((state) => state.faculty.data);
  const rooms = useSelector((state) => state.rooms.data);
  const schedules = useSelector((state) => state.specialSchedules.data);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchLower = query.toLowerCase();
    const allResults = [];

    courses.forEach((item) => {
      if (
        item.code?.toLowerCase().includes(searchLower) ||
        item.title?.toLowerCase().includes(searchLower)
      ) {
        allResults.push({ type: 'course', data: item, icon: <CourseIcon /> });
      }
    });

    faculty.forEach((item) => {
      if (item.name?.toLowerCase().includes(searchLower)) {
        allResults.push({ type: 'faculty', data: item, icon: <FacultyIcon /> });
      }
    });

    rooms.forEach((item) => {
      if (item.name?.toLowerCase().includes(searchLower)) {
        allResults.push({ type: 'room', data: item, icon: <RoomIcon /> });
      }
    });

    schedules.forEach((item) => {
      if (item.name?.toLowerCase().includes(searchLower)) {
        allResults.push({ type: 'schedule', data: item, icon: <ScheduleIcon /> });
      }
    });

    setResults(allResults.slice(0, 10));
  }, [query, courses, faculty, rooms, schedules]);

  const handleSelect = (result) => {
    const typeMap = {
      course: 'courses',
      faculty: 'faculty',
      room: 'rooms',
      schedule: 'schedules',
    };
    navigate(`/manage/${typeMap[result.type]}`);
    onClose();
    setQuery('');
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setQuery('');
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '70vh' },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid hsl(var(--border))' }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search courses, faculty, rooms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: '1.1rem' },
            }}
          />
        </Box>

        {query && results.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No results found</Typography>
          </Box>
        )}

        {results.length > 0 && (
          <List sx={{ py: 1 }}>
            {results.map((result, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleSelect(result)} sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>{result.icon}</ListItemIcon>
                  <ListItemText
                    primary={result.data.name || result.data.code || result.data.title}
                    secondary={result.type}
                  />
                  <Chip
                    label={result.type}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
