import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSpecialSchedules, createSpecialSchedule, updateSpecialSchedule, deleteSpecialSchedule } from '../../api/mockApi';

export const fetchSpecialSchedulesAsync = createAsyncThunk('specialSchedules/fetchSpecialSchedules', async () => {
  return await fetchSpecialSchedules();
});

export const createSpecialScheduleAsync = createAsyncThunk('specialSchedules/createSpecialSchedule', async (scheduleData) => {
  return await createSpecialSchedule(scheduleData);
});

export const updateSpecialScheduleAsync = createAsyncThunk('specialSchedules/updateSpecialSchedule', async ({ id, data }) => {
  return await updateSpecialSchedule(id, data);
});

export const deleteSpecialScheduleAsync = createAsyncThunk('specialSchedules/deleteSpecialSchedule', async (id) => {
  await deleteSpecialSchedule(id);
  return id;
});

const specialSchedulesSlice = createSlice({
  name: 'specialSchedules',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialSchedulesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpecialSchedulesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSpecialSchedulesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createSpecialScheduleAsync.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateSpecialScheduleAsync.fulfilled, (state, action) => {
        const index = state.data.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteSpecialScheduleAsync.fulfilled, (state, action) => {
        state.data = state.data.filter((s) => s.id !== action.payload);
      });
  },
});

export default specialSchedulesSlice.reducer;
