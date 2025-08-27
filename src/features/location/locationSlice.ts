import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Location } from "./types";

interface State {
  selected?: Location;
  lastUpdated?: string;
}

const initial: State = {};

const locationSlice = createSlice({
  name: "location",
  initialState: initial,
  reducers: {
    setLocation(state, action: PayloadAction<Location>) {
      state.selected = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
