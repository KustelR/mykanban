import { createSlice } from "@reduxjs/toolkit";

const initialState: SettingsState = {
  filterRegex: "/^.*$/",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setFilterRegex(state, action) {
      state.filterRegex = action.payload;
    },
  },
});

export const { setFilterRegex } = settingsSlice.actions;

export default settingsSlice.reducer;
