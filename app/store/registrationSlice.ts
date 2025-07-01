import { createSlice } from "@reduxjs/toolkit";

interface RegistrationState {
  step: number;
  maxSteps: number;
};

const initialState: RegistrationState = {
  step: 0,
  maxSteps: 3,
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
  },
});

export const { goToNextStep, goToPreviousStep } = registrationSlice.actions;
export default registrationSlice.reducer;
