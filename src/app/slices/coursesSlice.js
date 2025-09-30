import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../../api/mockApi';

export const fetchCoursesAsync = createAsyncThunk('courses/fetchCourses', async () => {
  return await fetchCourses();
});

export const createCourseAsync = createAsyncThunk('courses/createCourse', async (courseData) => {
  return await createCourse(courseData);
});

export const updateCourseAsync = createAsyncThunk('courses/updateCourse', async ({ id, data }) => {
  return await updateCourse(id, data);
});

export const deleteCourseAsync = createAsyncThunk('courses/deleteCourse', async (id) => {
  await deleteCourse(id);
  return id;
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoursesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCoursesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCourseAsync.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateCourseAsync.fulfilled, (state, action) => {
        const index = state.data.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteCourseAsync.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.id !== action.payload);
      });
  },
});

export default coursesSlice.reducer;
