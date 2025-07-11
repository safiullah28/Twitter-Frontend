import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotification",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/api/notifications`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      // toast.error(error?.data?.error);
      toast.error(
        error?.response?.data?.error || "Failed to fetch notifications"
      );

      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotifications = createAsyncThunk(
  "notifications/deleteNotification",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${URL}/api/notifications`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoading = false;
        state.isError = false;

        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.isLoading = false;
        state.isError = false;
        toast.success("Notifications deleted successfully");
      })
      .addCase(deleteNotifications.rejected, (state, action) => {
        toast.error(action.payload);
        state.isLoading = true;
        state.isError = true;
      });
  },
});

export default notificationSlice.reducer;
