import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './slices/coursesSlice';
import facultyReducer from './slices/facultySlice';
import roomsReducer from './slices/roomsSlice';
import specialSchedulesReducer from './slices/specialSchedulesSlice';
import timetableReducer from './slices/timetableSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    faculty: facultyReducer,
    rooms: roomsReducer,
    specialSchedules: specialSchedulesReducer,
    timetable: timetableReducer,
    auth: authReducer,
  },
});

export default store;
