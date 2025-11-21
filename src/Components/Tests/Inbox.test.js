jest.mock("../../Redux store/EmailSlice", () => ({
  EmailActions: {
    setInbox: (payload) => ({ type: "email/setInbox", payload }),
    markAsRead: (id) => ({ type: "email/markAsRead", payload: id }),
    deleteEmail: (id) => ({ type: "email/deleteEmail", payload: id }),
  },
}));

import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import Inbox from "../Profile/Email/Inbox";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";

// Mock axios
jest.mock("axios");

// --- Mock reducers used by Inbox component ---
const emailReducer = (state = { inbox: [], unreadCount: 0 }, action) => {
  switch (action.type) {
    case "email/setInbox":
      return { ...state, inbox: action.payload };
    case "email/markAsRead":
      return {
        ...state,
        inbox: state.inbox.map((m) =>
          m.id === action.payload ? { ...m, read: true } : m
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case "email/deleteEmail":
      return {
        ...state,
        inbox: state.inbox.filter((m) => m.id !== action.payload),
      };

    default:
      return state;
  }
};

const authReducer = (state = { userEmail: null }) => state;

// Mock navigation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// ---------------------- Helper -------------------------
const renderWithStore = async (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      email: emailReducer,
      auth: authReducer,
    },
    preloadedState,
  });

  let utils;

  await act(async () => {
    utils = render(
      <Provider store={store}>
        <MemoryRouter>
          <Inbox />
        </MemoryRouter>
      </Provider>
    );
  });

  return { store, ...utils };
};

// ------------------ TESTS ---------------------

describe("Inbox Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. Renders loading state initially", async () => {
    axios.get.mockResolvedValueOnce(new Promise(() => {})); // never resolves

    await renderWithStore({
      auth: { userEmail: "test@example.com" },
    });

    expect(screen.getByText("Loading emails...")).toBeInTheDocument();
  });

  test("2. Calls axios GET with sanitized email", async () => {
    axios.get.mockResolvedValueOnce({ data: null });

    await renderWithStore({
      auth: { userEmail: "user.test@example.com" },
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("user_test@example_com")
    );
  });

  test("3. Displays 'No emails found' when inbox is empty", async () => {
    axios.get.mockResolvedValueOnce({ data: null });

    await renderWithStore({
      auth: { userEmail: "test@example.com" },
    });

    expect(await screen.findByText("No emails found.")).toBeInTheDocument();
  });

  test("4. Renders list of emails from API", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        id1: {
          from: "alice@example.com",
          subject: "Hello",
          date: "2025-01-20T10:00:00Z",
          read: true,
        },
      },
    });

    await renderWithStore({
      auth: { userEmail: "test@example.com" },
    });

    expect(await screen.findByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("5. Shows unread indicator for unread emails", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        id1: {
          from: "bob@example.com",
          subject: "Unread Mail",
          date: "2025-02-01T09:00:00Z",
          read: false,
        },
      },
    });

    await renderWithStore({
      auth: { userEmail: "test@example.com" },
    });

    await screen.findByText("Unread Mail");

    expect(document.querySelector(".unread-dot")).toBeInTheDocument();
  });

  test("6. Sorts emails by latest date first", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        id1: {
          from: "older@example.com",
          subject: "Old Mail",
          date: "2025-01-01T10:00:00Z",
          read: true,
        },
        id2: {
          from: "newer@example.com",
          subject: "New Mail",
          date: "2025-02-01T10:00:00Z",
          read: true,
        },
      },
    });

    await renderWithStore({
      auth: { userEmail: "test@example.com" },
    });

    const subjects = await screen.findAllByText(/Mail/);

    expect(subjects[0]).toHaveTextContent("New Mail");
    expect(subjects[1]).toHaveTextContent("Old Mail");
  });

  test("7. Does NOT call axios if no userEmail exists", async () => {
    await renderWithStore({
      auth: { userEmail: null },
    });

    expect(axios.get).not.toHaveBeenCalled();
  });
});

test("8. Shows unread dot next to unread email", async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      mail11: {
        from: "john@example.com",
        subject: "Unread Email",
        date: "2025-02-10T10:00:00Z",
        read: false,
      },
    },
  });
});

// ---------------- DELETE TESTS -------------------

describe("Inbox Delete Functionality", () => {
  test("Delete buttons appear when inbox has emails", async () => {
    axios.get.mockResolvedValueOnce(null); // <-- important (avoid overwrite)

    await renderWithStore({
      auth: { userEmail: "test@gmail.com" },
      email: {
        inbox: [
          { id: "1", from: "a@test.com", subject: "Hello", date: "2024-01-01" },
          { id: "2", from: "b@test.com", subject: "World", date: "2024-01-02" },
        ],
      },
    });

    const buttons = await screen.findAllByRole("button", { name: /delete/i });
    expect(buttons.length).toBe(2);
  });

  test("Deleting email dispatches deleteEmail & calls axios.delete", async () => {
    axios.get.mockResolvedValueOnce(null);
    axios.delete.mockResolvedValueOnce({});

    const { store } = await renderWithStore({
      auth: { userEmail: "test@gmail.com" },
      email: {
        inbox: [
          {
            id: "123",
            from: "a@test.com",
            subject: "Mail 1",
            date: "2024-01-01",
          },
        ],
      },
    });

    const btn = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(btn);

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));

    expect(store.getState().email.inbox.length).toBe(0);
  });
});
