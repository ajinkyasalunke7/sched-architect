import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailAlerts: false,
    autoSave: true,
    compactView: false,
    defaultView: 'weekly',
    itemsPerPage: 10,
  });

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    toast.success('Preferences saved successfully!');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Preferences
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Customize your application settings
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'hsl(var(--card))' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          General Settings
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
              />
            }
            label="Enable notifications"
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.emailAlerts}
                onChange={(e) => handleChange('emailAlerts', e.target.checked)}
              />
            }
            label="Receive email alerts"
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.autoSave}
                onChange={(e) => handleChange('autoSave', e.target.checked)}
              />
            }
            label="Auto-save changes"
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.compactView}
                onChange={(e) => handleChange('compactView', e.target.checked)}
              />
            }
            label="Use compact view"
          />
        </FormGroup>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Display Settings
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Default Timetable View</InputLabel>
          <Select
            value={preferences.defaultView}
            label="Default Timetable View"
            onChange={(e) => handleChange('defaultView', e.target.value)}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="faculty">By Faculty</MenuItem>
            <MenuItem value="room">By Room</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={preferences.itemsPerPage}
            label="Items per page"
            onChange={(e) => handleChange('itemsPerPage', e.target.value)}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            textTransform: 'none',
            background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
            '&:hover': {
              background: 'linear-gradient(135deg, hsl(220 70% 45%), hsl(265 60% 50%))',
            },
          }}
        >
          Save Preferences
        </Button>
      </Paper>
    </Box>
  );
};

export default PreferencesPage;
