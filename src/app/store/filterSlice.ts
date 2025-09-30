// store/filterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  searchTerm: string;
  filters: { field: string; operator: string; value: string }[];
}

const initialState: FilterState = {
  searchTerm: "",
  filters: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilters(
      state,
      action: PayloadAction<
        { field: string; operator: string; value: string }[]
      >
    ) {
      state.filters = action.payload;
    },
    resetFilters(state) {
      state.searchTerm = "";
      state.filters = [];
    },
  },
});

export const { setSearchTerm, setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
