import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface RegistrationState {
  step: number;
  maxSteps: number;
};

const initialState: RegistrationState = {
  step: 0,
  maxSteps: 4,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    goToNextStep: (state) => {
      if (state.step < state.maxSteps) {
        state.step += 1;
      }
    },
    goToPreviousStep: (state) => {
      if (state.step > 0) {
        state.step -= 1;
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
  },
});

export const { goToNextStep, goToPreviousStep, goToStep } = registrationSlice.actions;
export default registrationSlice.reducer;
