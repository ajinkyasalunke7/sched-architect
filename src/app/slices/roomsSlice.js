import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRooms, createRoom, updateRoom, deleteRoom } from '../../api/mockApi';

export const fetchRoomsAsync = createAsyncThunk('rooms/fetchRooms', async () => {
  return await fetchRooms();
});

export const createRoomAsync = createAsyncThunk('rooms/createRoom', async (roomData) => {
  return await createRoom(roomData);
});

export const updateRoomAsync = createAsyncThunk('rooms/updateRoom', async ({ id, data }) => {
  return await updateRoom(id, data);
});

export const deleteRoomAsync = createAsyncThunk('rooms/deleteRoom', async (id) => {
  await deleteRoom(id);
  return id;
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoomsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRoomsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createRoomAsync.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateRoomAsync.fulfilled, (state, action) => {
        const index = state.data.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteRoomAsync.fulfilled, (state, action) => {
        state.data = state.data.filter((r) => r.id !== action.payload);
      });
  },
});

export default roomsSlice.reducer;
