import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  selectedTab: string;
}

const initialState: TabState = {
  selectedTab: "", 
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload; 
    },
  },
});

export const { setSelectedTab } = tabSlice.actions;

export default tabSlice.reducer;
