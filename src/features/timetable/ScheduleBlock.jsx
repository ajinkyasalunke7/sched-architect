import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography, Chip } from '@mui/material';
import { Warning as WarningIcon, DragIndicator as DragIcon } from '@mui/icons-material';

const courseTypeColors = {
  Major: 'hsl(220 70% 50%)',
  Minor: 'hsl(265 60% 55%)',
  Skill: 'hsl(180 65% 50%)',
};

const ScheduleBlock = ({ id, course, faculty, room, isConflict }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const bgColor = courseTypeColors[course?.type] || 'hsl(220 70% 50%)';

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: bgColor,
        color: 'white',
        cursor: 'grab',
        border: isConflict ? '3px solid hsl(0 72% 55%)' : 'none',
        boxShadow: isConflict ? '0 0 0 4px hsl(0 72% 55% / 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          transform: 'translateY(-2px)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
          {course?.code || 'Unknown'}
        </Typography>
        <DragIcon sx={{ fontSize: 18, opacity: 0.7 }} />
      </Box>
      
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.9 }}>
        {course?.title || 'No title'}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Chip
          label={faculty?.name || 'No faculty'}
          size="small"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '0.7rem',
            height: 20,
          }}
        />
        <Chip
          label={room?.name || 'No room'}
          size="small"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '0.7rem',
            height: 20,
          }}
        />
      </Box>

      {isConflict && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'hsl(0 72% 55%)',
            borderRadius: '50%',
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningIcon sx={{ fontSize: 16 }} />
        </Box>
      )}
    </Box>
  );
};

export default ScheduleBlock;
