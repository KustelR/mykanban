import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState: number = Date.now();

const updateLastChanged = createAction("lastChanged/updateLastChanged");
export const kanbanSlice = createSlice({
  name: "lastChanged",
  initialState,
  reducers: {
    updateLastChanged: (state, action) => {
      state = Date.now();
      return Date.now();
    },
  },
});

export { updateLastChanged };
export default kanbanSlice.reducer;
