import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sent from "../Profile/Email/CreateEmail/Sent";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const emailReducer = (state = { sent: [], inbox: [] }, action) => {
  switch (action.type) {
    case "email/setSent":
      return { ...state, sent: action.payload };

    case "email/deleteSentEmail":
      return {
        ...state,
        sent: state.sent.filter((mail) => mail.id !== action.payload),
      };

    default:
      return state;
  }
};

const authReducer = (state = { userEmail: null }) => state;

const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: {
      email: emailReducer,
      auth: authReducer,
    },
    preloadedState,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <Sent />
        </MemoryRouter>
      </Provider>
    ),
  };
};

describe("Sent Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. Shows loading state initially", async () => {
    axios.get.mockResolvedValue(new Promise(() => {})); // never resolves

    renderWithStore({
      auth: { userEmail: "test@example.com" },
      email: { sent: [] },
    });

    expect(screen.getByText("Loading emails...")).toBeInTheDocument();
  });

  test("2. Calls axios GET with sanitized email", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });

    renderWithStore({
      auth: { userEmail: "john.doe@example.com" },
      email: { sent: [] },
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("john_doe@example_com")
    );
  });

  test("3. Renders sent list", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        id1: {
          to: "friend@test.com",
          subject: "Hello",
          date: "2025-01-20T10:00:00Z",
        },
      },
    });

    renderWithStore({
      auth: { userEmail: "test@example.com" },
      email: { sent: [] },
    });

    expect(await screen.findByText("friend@test.com")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("4. Navigates to details on click", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        email44: {
          to: "abc@test.com",
          subject: "Test",
          date: "2025-02-01",
        },
      },
    });

    renderWithStore({
      auth: { userEmail: "test@example.com" },
      email: { sent: [] },
    });

    const subject = await screen.findByText("Test");
    fireEvent.click(subject);

    expect(mockNavigate).toHaveBeenCalledWith("/UserProfile/email/email44");
  });

  test("5. Delete email dispatches deleteSentEmail", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        999: {
          to: "remove@test.com",
          subject: "Delete",
          date: "2025-01-01",
        },
      },
    });

    axios.delete.mockResolvedValueOnce({});

    const { store } = renderWithStore({
      auth: { userEmail: "test@example.com" },
      email: {
        sent: [], // initial, will be replaced by axios.get response
      },
    });

    await waitFor(() =>
      expect(screen.queryByText("Loading emails...")).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));

    const finalState = store.getState().email.sent;
    expect(finalState.length).toBe(0); // deleted
  });
});
