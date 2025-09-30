import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesAsync } from '../app/slices/coursesSlice';
import { fetchFacultyAsync } from '../app/slices/facultySlice';
import { fetchRoomsAsync } from '../app/slices/roomsSlice';
import { Box, Grid, Paper, Typography, Button, Card, CardContent } from '@mui/material';
import {
  MenuBook as CoursesIcon,
  Person as FacultyIcon,
  MeetingRoom as RoomsIcon,
  AutoAwesome as GenerateIcon,
  CalendarMonth as TimetableIcon,
  Storage as ManageIcon,
  Groups as StudentsIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card
    elevation={0}
    sx={{
      background: 'white',
      borderRadius: 3,
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px hsl(220 20% 15% / 0.12)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: color || 'hsl(220 70% 50%)' }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color || 'hsl(220 70% 50%)'}15`,
            color: color || 'hsl(220 70% 50%)',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.data);
  const faculty = useSelector((state) => state.faculty.data);
  const rooms = useSelector((state) => state.rooms.data);
  const timetableStatus = useSelector((state) => state.timetable.generationStatus);

  useEffect(() => {
    dispatch(fetchCoursesAsync());
    dispatch(fetchFacultyAsync());
    dispatch(fetchRoomsAsync());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's an overview of your academic data.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Courses" value={courses.length} icon={<CoursesIcon sx={{ fontSize: 32 }} />} color="hsl(220 70% 50%)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Faculty Members" value={faculty.length} icon={<FacultyIcon sx={{ fontSize: 32 }} />} color="hsl(265 60% 55%)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Available Rooms" value={rooms.length} icon={<RoomsIcon sx={{ fontSize: 32 }} />} color="hsl(180 65% 50%)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Students" value="450" icon={<StudentsIcon sx={{ fontSize: 32 }} />} color="hsl(35 90% 55%)" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
              color: 'white',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<GenerateIcon />}
                  onClick={() => navigate('/generate')}
                  sx={{
                    py: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Generate Timetable
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<TimetableIcon />}
                  onClick={() => navigate('/timetable')}
                  sx={{
                    py: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  View Timetable
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ManageIcon />}
                  onClick={() => navigate('/manage/courses')}
                  sx={{
                    py: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Manage Data
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Timetable Status
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: timetableStatus === 'completed' ? 'hsl(140 60% 95%)' : 'hsl(220 20% 97%)',
                border: `2px solid ${timetableStatus === 'completed' ? 'hsl(140 60% 50%)' : 'hsl(220 15% 88%)'}`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: timetableStatus === 'completed' ? 'hsl(140 60% 30%)' : 'text.primary' }}>
                {timetableStatus === 'completed' ? '✓ Timetable Generated' : 'No Active Timetable'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timetableStatus === 'completed' ? 'Last generated today' : 'Generate a new timetable to get started'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
