import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { fetchTimetableAsync, updateTimetableSlotAsync, updateLocalSlot } from '../../app/slices/timetableSlice';
import ScheduleBlock from './ScheduleBlock';
import { toast } from 'react-toastify';
import { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

const TimetableGrid = () => {
  const dispatch = useDispatch();
  const timetable = useSelector((state) => state.timetable.data);
  const status = useSelector((state) => state.timetable.status);
  const courses = useSelector((state) => state.courses.data);
  const faculty = useSelector((state) => state.faculty.data);
  const rooms = useSelector((state) => state.rooms.data);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    dispatch(fetchTimetableAsync());
    // Also fetch reference data if not loaded
    if (courses.length === 0) {
      import('../../app/slices/coursesSlice').then(m => dispatch(m.fetchCoursesAsync()));
    }
    if (faculty.length === 0) {
      import('../../app/slices/facultySlice').then(m => dispatch(m.fetchFacultyAsync()));
    }
    if (rooms.length === 0) {
      import('../../app/slices/roomsSlice').then(m => dispatch(m.fetchRoomsAsync()));
    }
  }, [dispatch]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Parse source and destination
    const parseId = (id) => {
      const parts = id.split('-');
      return { day: parts[0], time: parts[1] };
    };

    const source = parseId(active.id);
    const dest = parseId(over.id);

    if (!timetable) return;

    const sourceSlot = timetable[source.day]?.[source.time];
    const destSlot = timetable[dest.day]?.[dest.time];

    // Swap or move
    dispatch(updateLocalSlot({ day: dest.day, time: dest.time, data: sourceSlot }));
    dispatch(updateLocalSlot({ day: source.day, time: source.time, data: destSlot || null }));

    // Persist changes
    dispatch(updateTimetableSlotAsync({ day: dest.day, time: dest.time, data: sourceSlot }));
    if (destSlot) {
      dispatch(updateTimetableSlotAsync({ day: source.day, time: source.time, data: destSlot }));
    }

    toast.success('Schedule updated successfully!');
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getCourseById = (id) => courses.find((c) => c.id === id);
  const getFacultyById = (id) => faculty.find((f) => f.id === id);
  const getRoomById = (id) => rooms.find((r) => r.id === id);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!timetable) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No timetable available. Generate one to get started.
        </Typography>
      </Box>
    );
  }

  // Create sortable items
  const sortableItems = [];
  days.forEach((day) => {
    timeSlots.forEach((time) => {
      sortableItems.push(`${day}-${time}`);
    });
  });

  const activeSlot = activeId ? (() => {
    const [day, time] = activeId.split('-');
    return timetable[day]?.[time];
  })() : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
        <Paper elevation={0} sx={{ overflow: 'auto', borderRadius: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: `120px repeat(${days.length}, 1fr)`, minWidth: 1000 }}>
            {/* Header Row */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'hsl(220 20% 97%)',
                borderBottom: '2px solid hsl(220 15% 88%)',
                borderRight: '2px solid hsl(220 15% 88%)',
                fontWeight: 700,
              }}
            >
              Time
            </Box>
            {days.map((day) => (
              <Box
                key={day}
                sx={{
                  p: 2,
                  bgcolor: 'hsl(220 20% 97%)',
                  borderBottom: '2px solid hsl(220 15% 88%)',
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              >
                {day}
              </Box>
            ))}

            {/* Time Slots */}
            {timeSlots.map((time) => (
              <>
                <Box
                  key={`time-${time}`}
                  sx={{
                    p: 2,
                    bgcolor: 'hsl(220 20% 97%)',
                    borderRight: '2px solid hsl(220 15% 88%)',
                    borderBottom: '1px solid hsl(220 15% 92%)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {time}
                </Box>
                {days.map((day) => {
                  const slot = timetable[day]?.[time];
                  const cellId = `${day}-${time}`;

                  return (
                    <Box
                      key={cellId}
                      id={cellId}
                      sx={{
                        p: 1.5,
                        borderBottom: '1px solid hsl(220 15% 92%)',
                        minHeight: 120,
                        bgcolor: slot ? 'transparent' : 'white',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: 'hsl(220 20% 98%)',
                        },
                      }}
                    >
                      {slot && (
                        <ScheduleBlock
                          id={cellId}
                          course={getCourseById(slot.courseId)}
                          faculty={getFacultyById(slot.facultyId)}
                          room={getRoomById(slot.roomId)}
                          isConflict={slot.isConflict}
                        />
                      )}
                    </Box>
                  );
                })}
              </>
            ))}
          </Box>
        </Paper>
      </SortableContext>

      <DragOverlay>
        {activeSlot && (
          <Box sx={{ cursor: 'grabbing' }}>
            <ScheduleBlock
              id="overlay"
              course={getCourseById(activeSlot.courseId)}
              faculty={getFacultyById(activeSlot.facultyId)}
              room={getRoomById(activeSlot.roomId)}
              isConflict={activeSlot.isConflict}
            />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default TimetableGrid;
