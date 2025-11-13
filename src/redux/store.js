import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import notificationReducer from "./notificationSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
    notifications: notificationReducer,
  },
});
