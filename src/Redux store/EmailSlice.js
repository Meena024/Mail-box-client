import { createSlice } from "@reduxjs/toolkit";

const EmailSlice = createSlice({
  name: "emails",
  initialState: {
    inbox: [],
    unreadCount: 0,
  },
  reducers: {
    setInbox(state, action) {
      state.inbox = action.payload;
      state.unreadCount = action.payload.filter((mail) => !mail.read).length;
    },
    markAsRead(state, action) {
      const id = action.payload;
      const mail = state.inbox.find((m) => m.id === id);
      if (mail && !mail.read) {
        mail.read = true;
        state.unreadCount -= 1;
      }
    },
  },
});

export const EmailActions = EmailSlice.actions;
export default EmailSlice;
