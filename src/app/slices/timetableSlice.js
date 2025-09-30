import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTimetable, generateTimetable, updateTimetableSlot } from '../../api/mockApi';

export const fetchTimetableAsync = createAsyncThunk('timetable/fetchTimetable', async () => {
  return await fetchTimetable();
});

export const generateTimetableAsync = createAsyncThunk('timetable/generateTimetable', async (params) => {
  return await generateTimetable(params);
});

export const updateTimetableSlotAsync = createAsyncThunk('timetable/updateSlot', async ({ day, time, data }) => {
  return await updateTimetableSlot(day, time, data);
});

const timetableSlice = createSlice({
  name: 'timetable',
  initialState: {
    data: null,
    generationStatus: 'idle', // 'idle' | 'generating' | 'completed' | 'failed'
    generationProgress: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    updateLocalSlot: (state, action) => {
      const { day, time, data } = action.payload;
      if (state.data && state.data[day]) {
        state.data[day][time] = data;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetableAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTimetableAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTimetableAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(generateTimetableAsync.pending, (state) => {
        state.generationStatus = 'generating';
        state.generationProgress = 0;
      })
      .addCase(generateTimetableAsync.fulfilled, (state, action) => {
        state.generationStatus = 'completed';
        state.generationProgress = 100;
        state.data = action.payload;
      })
      .addCase(generateTimetableAsync.rejected, (state, action) => {
        state.generationStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTimetableSlotAsync.fulfilled, (state, action) => {
        const { day, time, data } = action.payload;
        if (state.data && state.data[day]) {
          state.data[day][time] = data;
        }
      });
  },
});

export const { updateLocalSlot } = timetableSlice.actions;
export default timetableSlice.reducer;
