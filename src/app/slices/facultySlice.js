import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFaculty, createFaculty, updateFaculty, deleteFaculty } from '../../api/mockApi';

export const fetchFacultyAsync = createAsyncThunk('faculty/fetchFaculty', async () => {
  return await fetchFaculty();
});

export const createFacultyAsync = createAsyncThunk('faculty/createFaculty', async (facultyData) => {
  return await createFaculty(facultyData);
});

export const updateFacultyAsync = createAsyncThunk('faculty/updateFaculty', async ({ id, data }) => {
  return await updateFaculty(id, data);
});

export const deleteFacultyAsync = createAsyncThunk('faculty/deleteFaculty', async (id) => {
  await deleteFaculty(id);
  return id;
});

const facultySlice = createSlice({
  name: 'faculty',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacultyAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFacultyAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchFacultyAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createFacultyAsync.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateFacultyAsync.fulfilled, (state, action) => {
        const index = state.data.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteFacultyAsync.fulfilled, (state, action) => {
        state.data = state.data.filter((f) => f.id !== action.payload);
      });
  },
});

export default facultySlice.reducer;
