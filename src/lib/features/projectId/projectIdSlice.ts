import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";
import objectHash from "object-hash";

const initialState: string = "not loaded yet";

const setProjectIdAction = createAction<string>("projectId/set");
export const kanbanSlice = createSlice({
  name: "projectId",
  initialState,
  reducers: {
    set: (state, action) => {
      const id = action.payload as string;
      return id;
    },
  },
});

export { setProjectIdAction };
export default kanbanSlice.reducer;
