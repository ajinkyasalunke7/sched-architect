import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import {
  CalendarMonth as WeekIcon,
  Person as FacultyIcon,
  MeetingRoom as RoomIcon,
  ViewDay as DayIcon,
} from '@mui/icons-material';

const TimetableViewSwitcher = ({ view, onChange }) => {
  return (
    <Box>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e, newView) => newView && onChange(newView)}
        aria-label="timetable view"
        sx={{
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            px: 2,
            py: 1,
          },
        }}
      >
        <ToggleButton value="weekly" aria-label="weekly view">
          <WeekIcon sx={{ mr: 1, fontSize: 20 }} />
          Weekly
        </ToggleButton>
        <ToggleButton value="daily" aria-label="daily view">
          <DayIcon sx={{ mr: 1, fontSize: 20 }} />
          Daily
        </ToggleButton>
        <ToggleButton value="faculty" aria-label="faculty view">
          <FacultyIcon sx={{ mr: 1, fontSize: 20 }} />
          By Faculty
        </ToggleButton>
        <ToggleButton value="room" aria-label="room view">
          <RoomIcon sx={{ mr: 1, fontSize: 20 }} />
          By Room
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimetableViewSwitcher;
