import { createSlice } from "@reduxjs/toolkit";

const EmailSlice = createSlice({
  name: "email",
  initialState: {
    inbox: [],
    unreadCount: 0,
    sent: [],
  },
  reducers: {
    setSent(state, action) {
      state.sent = action.payload;
    },

    setInbox(state, action) {
      state.inbox = action.payload;
      state.unreadCount = action.payload.filter((mail) => !mail.read).length;
    },

    setUnreadCount(state, action) {
      state.unreadCount = action.payload;
    },

    markAsRead(state, action) {
      const id = action.payload;
      const mail = state.inbox.find((m) => m.id === id);
      if (mail && !mail.read) {
        mail.read = true;
        state.unreadCount -= 1;
      }
    },

    UpdateStar(state, action) {
      const id = action.payload;
      const mail = state.inbox.find((m) => m.id === id);
      if (mail) {
        mail.starred = !mail.starred;
      }
    },

    deleteEmail(state, action) {
      const id = action.payload;
      const mail = state.inbox.find((m) => m.id === id);
      state.inbox = state.inbox.filter((m) => m.id !== id);
      if (mail && !mail.read) {
        state.unreadCount -= 1;
      }
    },

    deleteSentEmail(state, action) {
      const id = action.payload;
      state.sent = state.sent.filter((m) => m.id !== id);
    },
  },
});

export const EmailActions = EmailSlice.actions;
export default EmailSlice;
