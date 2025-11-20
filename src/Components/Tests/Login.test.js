import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Authentication/Login";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

// Unified render helper with Router + Redux Provider
const renderWithProviders = (ui, preloadedState = {}) => {
  const store = mockStore(preloadedState);

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("Login Component Tests", () => {
  test("1. Renders email and password fields", () => {
    renderWithProviders(<Login />, {
      auth: { userEmail: null, isLoggedIn: false },
    });

    expect(screen.getByPlaceholderText("E-Mail id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("2. Updates email and password state on typing", () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText("E-Mail id");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("test@gmail.com");
    expect(passwordInput.value).toBe("123456");
  });

  test("3. Shows loading state on submit", () => {
    renderWithProviders(<Login />);

    const button = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(button);

    expect(button).toHaveAttribute("disabled");
    expect(button).toHaveTextContent("Logging in...");
  });

  test("4. Calls Firebase API with correct payload", async () => {
    renderWithProviders(<Login />);

    const mockResponse = {
      ok: true,
      json: async () => ({ idToken: "fakeToken" }),
    };

    global.fetch.mockResolvedValueOnce(mockResponse);

    fireEvent.change(screen.getByPlaceholderText("E-Mail id"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("signInWithPassword"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "test@gmail.com",
          password: "123456",
          returnSecureToken: true,
        }),
      })
    );
  });

  test("5. Displays error message on failed login", async () => {
    renderWithProviders(<Login />);

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: { message: "INVALID_PASSWORD" },
      }),
    });

    fireEvent.change(screen.getByPlaceholderText("E-Mail id"), {
      target: { value: "wrong@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "badpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("INVALID_PASSWORD")).toBeInTheDocument();
  });

  test("6. Stores token and navigates on success", async () => {
    renderWithProviders(<Login />);

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ idToken: "abc123" }),
    });

    fireEvent.change(screen.getByPlaceholderText("E-Mail id"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith("token", "abc123");
      expect(mockNavigate).toHaveBeenCalledWith("/UserProfile");
    });
  });

  test("7. Clears email and password fields after submit", async () => {
    renderWithProviders(<Login />);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ idToken: "abc123" }),
    });

    const emailInput = screen.getByPlaceholderText("E-Mail id");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });
  });
});
