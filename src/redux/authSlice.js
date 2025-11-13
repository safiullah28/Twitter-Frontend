import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ email, username, fullName, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/signup`,
        { email, username, fullName, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return res.data?.user;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Signup failed");
      console.log("Signup error:", error?.response?.data || error.message);

      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return res.data?.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${URL}/api/users/update`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getAuthUser = createAsyncThunk(
  "auth/getAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/api/auth/me`, {
        withCredentials: true,
      });
      if (res.data.error) return null;
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isLoading: false,
    isError: false,
    isUpdatingProfile: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Signup

    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoading = false;
        state.isError = true;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoading = false;
        state.isError = true;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isLoading = false;
        state.isError = false;
        toast.success(action.payload?.message);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoading = false;
        toast.error("Logout failed");
        state.isError = true;
        console.error(action.payload?.error);
      })

      .addCase(getAuthUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getAuthUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
