import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${URL}/api/posts/create`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return { post: res.data.newPost };
    } catch (error) {
      toast.error(error?.data?.error);
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${URL}/api/posts/${postId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to delete post";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const commentPost = createAsyncThunk(
  "posts/commentPost",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${URL}/api/posts/comment/${postId}`,
        { text },
        { withCredentials: true }
      );
      return res.data; // full updated post
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${URL}/api/posts/like/${postId}`,
        {},
        { withCredentials: true }
      );
      return { postId, likes: res.data };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.error || err.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async ({ feedType, username, userId }, { rejectWithValue }) => {
    try {
      let endpoint;
      switch (feedType) {
        case "forYou":
          endpoint = `${URL}/api/posts/all`;
          break;
        case "following":
          endpoint = `${URL}/api/posts/following`;
          break;
        case "posts":
          endpoint = `${URL}/api/posts/user/${username}`;
          break;
        case "likes":
          endpoint = `${URL}/api/posts/likes/${userId}`;
          break;
        default:
          endpoint = `${URL}/api/posts/all`;
      }

      const res = await axios.get(endpoint, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: false,
    error: null,
    posts: [],
    isLoading: false,
    isError: false,

    isLiking: false,
    isCommenting: false,
    isDeleting: false,
    isLoadingPosts: false,
    isErrorPosts: false,
    errorPosts: null,
    likingPostIds: [],
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isLoading = true;
        state.isError = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoading = false;
        state.isError = false;
        state.posts.unshift(action.payload.post);
        toast.success("Post created successfully");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoading = true;
        state.isError = true;
        toast.error(action.payload);
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.isDeleting = true;
        state.isError = false;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        toast.success("Post deleted successfully");
        state.posts = state.posts.filter(
          (p) => p._id !== action.payload?.postId
        );
        state.isDeleting = false;
        state.isError = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
        state.isDeleting = false;
        state.isError = true;
        toast.error(action.payload);
      })
      // LIKE POST
      .addCase(likePost.pending, (state, action) => {
        state.isLiking = true;
        const postId = action.meta.arg;
        state.likingPostIds.push(postId);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes;
        }
        state.isLiking = false;
        state.likingPostIds = state.likingPostIds.filter((id) => id !== postId);
      })
      .addCase(likePost.rejected, (state, action) => {
        const postId = action.payload?.postId || action.meta.arg;
        state.likingPostIds = state.likingPostIds.filter((id) => id !== postId);
        state.isLiking = false;

        state.error = action.payload;
        toast.error(action.payload);
      })
      // Comment
      .addCase(commentPost.pending, (state) => {
        state.isCommenting = true;
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const updatedPost = action.payload; // full updated post
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        state.isCommenting = false;
        toast.success("Comment posted successfully");
      })
      .addCase(commentPost.rejected, (state, action) => {
        state.isCommenting = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // FetchPost
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoadingPosts = true;
        state.isErrorPosts = false;
        state.errorPosts = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoadingPosts = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoadingPosts = false;
        state.isErrorPosts = true;
        state.errorPosts = action.payload;
      });
  },
});

export default postSlice.reducer;
