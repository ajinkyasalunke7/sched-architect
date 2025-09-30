import { useSelector } from 'react-redux';
import { Paper, Typography, Box, Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['hsl(220 70% 50%)', 'hsl(265 60% 55%)', 'hsl(180 65% 50%)', 'hsl(35 90% 55%)'];

const DashboardCharts = () => {
  const courses = useSelector((state) => state.courses.data);
  const faculty = useSelector((state) => state.faculty.data);
  const rooms = useSelector((state) => state.rooms.data);

  // Course type distribution
  const courseTypes = courses.reduce((acc, course) => {
    acc[course.type] = (acc[course.type] || 0) + 1;
    return acc;
  }, {});

  const courseTypeData = Object.entries(courseTypes).map(([name, value]) => ({
    name,
    value,
  }));

  // Room capacity data
  const roomData = rooms.map((room) => ({
    name: room.name,
    capacity: room.capacity,
  }));

  // Faculty hours data
  const facultyData = faculty.map((f) => ({
    name: f.name.split(' ').slice(-1)[0],
    maxHours: f.maxHours,
  }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'hsl(var(--card))' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Course Distribution by Type
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={courseTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {courseTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'hsl(var(--card))' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Room Capacity Overview
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="capacity" fill="hsl(180 65% 50%)" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'hsl(var(--card))' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Faculty Maximum Hours
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={facultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="maxHours" fill="hsl(265 60% 55%)" name="Max Hours" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;
