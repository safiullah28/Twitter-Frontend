// features/user/userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
const URL = import.meta.env.VITE_BACKEND_URL;

export const getSuggestedUsers = createAsyncThunk(
  "user/getSuggestedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/api/users/suggested`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

export const followUser = createAsyncThunk(
  "user/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${URL}/api/users/follow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      return res.data; // optional, adjust based on API
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (username, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/api/users/profile/${username}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    suggestedUsers: [],
    userProfile: null,
    isLoadingProfile: false,
    isLoading: false,
    isFollowing: false,
    error: null,

    followingUserId: null,

    profileError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSuggestedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(getSuggestedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(followUser.pending, (state, action) => {
        state.isFollowing = true;
        state.error = null;
        state.followingUserId = action.meta.arg;
      })
      .addCase(followUser.fulfilled, (state) => {
        state.isFollowing = false;
        state.followingUserId = null;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isFollowing = false;
        state.followingUserId = null;
        state.error = action.payload;
      })
      // User Profle
      .addCase(getUserProfile.pending, (state) => {
        state.isLoadingProfile = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.userProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
