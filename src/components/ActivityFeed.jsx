import { useEffect, useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AutoAwesome as GenerateIcon,
} from '@mui/icons-material';

const getActivityIcon = (type) => {
  switch (type) {
    case 'create':
      return <AddIcon sx={{ color: 'hsl(var(--success))' }} />;
    case 'update':
      return <EditIcon sx={{ color: 'hsl(var(--info))' }} />;
    case 'delete':
      return <DeleteIcon sx={{ color: 'hsl(var(--destructive))' }} />;
    case 'generate':
      return <GenerateIcon sx={{ color: 'hsl(var(--warning))' }} />;
    default:
      return <AddIcon />;
  }
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Load activities from localStorage
    const stored = localStorage.getItem('activities');
    if (stored) {
      setActivities(JSON.parse(stored).slice(0, 10));
    }
  }, []);

  if (activities.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'hsl(var(--card))' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent activity
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'hsl(var(--card))' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Recent Activity
      </Typography>
      <List sx={{ py: 0 }}>
        {activities.map((activity, index) => (
          <ListItem
            key={index}
            sx={{
              px: 0,
              py: 1.5,
              borderBottom: index < activities.length - 1 ? '1px solid hsl(var(--border))' : 'none',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getActivityIcon(activity.type)}
            </ListItemIcon>
            <ListItemText
              primary={activity.message}
              secondary={activity.timestamp}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
            <Chip
              label={activity.category}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ActivityFeed;

// Helper function to log activities
export const logActivity = (type, message, category) => {
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  const newActivity = {
    type,
    message,
    category,
    timestamp: new Date().toLocaleString(),
  };
  activities.unshift(newActivity);
  localStorage.setItem('activities', JSON.stringify(activities.slice(0, 50)));
};
