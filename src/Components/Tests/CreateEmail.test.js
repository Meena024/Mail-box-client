import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateEmail from "../Profile/Email/CreateEmail/CreateEmail";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");
jest.spyOn(window, "alert").mockImplementation(() => {});

// Mock JoditEditor → replace with textarea
jest.mock("jodit-react", () => {
  return ({ value, onChange }) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

const mockStore = configureStore([]);

const renderWithProviders = (ui, preloadedState = {}) => {
  const store = mockStore(preloadedState);

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("CreateEmail Component", () => {
  test("1. Renders To, Subject, Editor, and buttons", () => {
    renderWithProviders(<CreateEmail />, {
      auth: { userEmail: "sender@example.com" },
    });

    expect(screen.getByPlaceholderText("To")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Subject")).toBeInTheDocument();
    expect(screen.getByTestId("editor")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("2. Typing updates the input fields and editor", () => {
    renderWithProviders(<CreateEmail />, {
      auth: { userEmail: "sender@example.com" },
    });

    const toInput = screen.getByPlaceholderText("To");
    const subjectInput = screen.getByPlaceholderText("Subject");
    const editor = screen.getByTestId("editor");

    fireEvent.change(toInput, { target: { value: "test@example.com" } });
    fireEvent.change(subjectInput, { target: { value: "Hello" } });
    fireEvent.change(editor, { target: { value: "Email content" } });

    expect(toInput.value).toBe("test@example.com");
    expect(subjectInput.value).toBe("Hello");
    expect(editor.value).toBe("Email content");
  });

  test("3. Submitting form sends axios POST requests (success)", async () => {
    axios.post.mockResolvedValueOnce({}); // inbox
    axios.post.mockResolvedValueOnce({}); // sent

    renderWithProviders(<CreateEmail />, {
      auth: { userEmail: "sender@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("To"), {
      target: { value: "receiver@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByTestId("editor"), {
      target: { value: "Body content" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(window.alert).toHaveBeenCalledWith("Email sent successfully!");
    });
  });

  test("4. Handles axios failure on submit", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    renderWithProviders(<CreateEmail />, {
      auth: { userEmail: "sender@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("To"), {
      target: { value: "receiver@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Test" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Something went wrong.");
    });
  });

  test("5. Cancel button navigates to /Users", () => {
    renderWithProviders(<CreateEmail />, {
      auth: { userEmail: "sender@example.com" },
    });

    const cancelBtn = screen.getByText("Cancel").closest("a");

    expect(cancelBtn).toHaveAttribute("href", "/Users");
  });

  test("6. Email sanitization works inside axios request URLs", async () => {
    axios.post.mockResolvedValueOnce({});
    axios.post.mockResolvedValueOnce({});

    renderWithProviders(<CreateEmail />, {
      auth: { userEmail: "user.test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("To"), {
      target: { value: "receiver.test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/receiver_test@example_com/),
        expect.any(Object)
      );
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/user_test@example_com/),
        expect.any(Object)
      );
    });
  });
});
