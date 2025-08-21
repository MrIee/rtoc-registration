import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import defaultProfileImg from '../assets/images/default-profile.jpg';

interface RegistrationState {
  pictureUrl: string;
};

const initialState: RegistrationState = {
  pictureUrl: defaultProfileImg,
};

const userPictureSlice = createSlice({
  name: 'userPicture',
  initialState,
  reducers: {
    setPicture: (state, action: PayloadAction<string>) => {
      state.pictureUrl = action.payload;
    },
  },
});

export const { setPicture } = userPictureSlice.actions;
export default userPictureSlice.reducer;
