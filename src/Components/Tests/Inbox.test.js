import { render, screen, waitFor } from "@testing-library/react";
import Inbox from "../Profile/Email/Inbox";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import axios from "axios";

jest.mock("axios");

// Helper to wrap with Redux provider
const mockStore = configureStore([]);

const renderWithStore = (ui, storeState = {}) => {
  const store = mockStore(storeState);

  return render(<Provider store={store}>{ui}</Provider>);
};

describe("Inbox Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. Renders loading state initially", () => {
    renderWithStore(<Inbox />, {
      auth: { userEmail: "test@example.com" },
    });

    expect(screen.getByText("Loading emails...")).toBeInTheDocument();
  });

  test("2. Calls axios GET with sanitized email", async () => {
    axios.get.mockResolvedValueOnce({ data: null });

    renderWithStore(<Inbox />, {
      auth: { userEmail: "user.test@example.com" },
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("user_test@example_com")
    );
  });

  test("3. Displays 'No emails found' when inbox is empty", async () => {
    axios.get.mockResolvedValueOnce({ data: null });

    renderWithStore(<Inbox />, {
      auth: { userEmail: "test@example.com" },
    });

    await waitFor(() => {
      expect(screen.getByText("No emails found.")).toBeInTheDocument();
    });
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

    renderWithStore(<Inbox />, {
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

    renderWithStore(<Inbox />, {
      auth: { userEmail: "test@example.com" },
    });

    // Wait for rendering
    await waitFor(() => {
      expect(screen.getByText("Unread Mail")).toBeInTheDocument();
    });

    // Select the unread dot via class
    const unreadDot = document.querySelector(".unread-dot");
    expect(unreadDot).toBeInTheDocument();
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

    renderWithStore(<Inbox />, {
      auth: { userEmail: "test@example.com" },
    });

    const emailSubjects = await screen.findAllByText(/Mail/);

    expect(emailSubjects[0]).toHaveTextContent("New Mail");
    expect(emailSubjects[1]).toHaveTextContent("Old Mail");
  });

  test("7. Does NOT call axios if no userEmail exists", async () => {
    renderWithStore(<Inbox />, {
      auth: { userEmail: null },
    });

    expect(axios.get).not.toHaveBeenCalled();
  });
});
