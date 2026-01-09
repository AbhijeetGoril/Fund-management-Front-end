import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  theme: localStorage.getItem("streamify-theme") || "coffee",
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("streamify-theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;