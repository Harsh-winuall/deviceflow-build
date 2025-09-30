import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentState {
  paymentId: string | null;
  orderId: string | null;
  amount: number | null;
}

const initialState: PaymentState = {
  paymentId: null,
  amount: null,
  orderId: null
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentData(state, action: PayloadAction<{ paymentId: string; amount: number; orderId: string; }>) {
      state.paymentId = action.payload.paymentId;
      state.amount = action.payload.amount;
      state.orderId = action.payload.orderId;
    },
    clearPaymentData(state) {
      state.paymentId = null;
      state.amount = null;
      state.orderId = null;
    },
  },
});

export const { setPaymentData, clearPaymentData } = paymentSlice.actions;
export default paymentSlice.reducer;
