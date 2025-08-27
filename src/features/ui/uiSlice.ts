import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Theme = "Sunny" | "Cloudy" | "Rain" | "Snow" | "Storm" | "Fog";

interface UiState {
  theme: Theme;
}
const initial: UiState = { theme: "Sunny"};

const uiSlice = createSlice({
  name: "ui",
  initialState: initial,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer;
export type { Theme };
