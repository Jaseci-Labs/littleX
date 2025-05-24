import tweetReducer from "./tweetSlice";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    tweet: tweetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
