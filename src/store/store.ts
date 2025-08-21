import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from './registrationSlice';
import userPictureSlice from './userPictureSlice';


export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    userPicture: userPictureSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
