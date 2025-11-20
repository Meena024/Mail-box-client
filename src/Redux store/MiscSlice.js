import { createSlice } from "@reduxjs/toolkit";

const MiscSlice = createSlice({
  name: "Misc",
  initialState: {
    renderingComp: "Inbox",
  },
  reducers: {
    setRenderingComp(state, action) {
      state.renderingComp = action.payload;
    },

    reset(state) {
      state.renderingComp = "Inbox";
    },
  },
});

export const MiscAction = MiscSlice.actions;
export default MiscSlice;
