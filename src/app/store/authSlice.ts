import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserData = {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  employeeCount: number;
  designation:string
  lastName: string;
  role: number;
  orgId: {
    _id: string;
    name: string;
    email: string;
  };
  teamId: {
    _id: string;
    title: string;
    description: string;
    image?: string;
  };
  addressDetails: {
    _id: string;
    title: string;
    phone: string;
    landmark: string;
    address: string;
    state: string;
    city: string;
    pinCode: string;
    isPrimary: boolean;
  };
};
interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ userData: UserData }>) {
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
