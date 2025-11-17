import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

const setup = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

describe("Login Component Tests", () => {
  test("1. Renders email and password fields", () => {
    setup();
    expect(screen.getByPlaceholderText("E-Mail id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("2. Updates email and password state on typing", () => {
    setup();

    const emailInput = screen.getByPlaceholderText("E-Mail id");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("test@gmail.com");
    expect(passwordInput.value).toBe("123456");
  });

  test("3. Shows loading state on submit", () => {
    setup();

    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.click(button);

    expect(button).toHaveAttribute("disabled");
    expect(button).toHaveTextContent("Logging in...");
  });

  test("4. Calls Firebase API with correct payload", async () => {
    setup();

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

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
      ),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@gmail.com",
          password: "123456",
          returnSecureToken: true,
        }),
      })
    );
  });

  test("5. Displays error message on failed login", async () => {
    setup();

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
    setup();

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
    setup();

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
