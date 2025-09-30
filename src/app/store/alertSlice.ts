import { createSlice } from "@reduxjs/toolkit";

interface AlertState {
  isOpen: boolean;
}

const initialState: AlertState = {
  isOpen: false,
};

const authSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    openAlert(state) {
      state.isOpen = true;
    },
    closeAlert(state) {
      state.isOpen = false;
    },
  },
});

export const { openAlert, closeAlert } = authSlice.actions;
export default authSlice.reducer;
