import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate BEFORE importing SignUp
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock VerifyEmail
jest.mock("./VerifyEmail", () => jest.fn());

import SignUp from "./SignUp";
import VerifyEmail from "./VerifyEmail";

beforeEach(() => {
  jest.clearAllMocks();
});

// Helper to render with router
const renderComponent = () =>
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );

describe("SignUp Component", () => {
  test("renders all inputs and button", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("E-Mail id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();

    // Use role to select the button, not the <h1>
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  test("shows error when passwords do not match", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("E-Mail id"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "abcdef" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Passwords doesn't match")).toBeInTheDocument();
  });

  test("successful signup triggers VerifyEmail and navigation", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ idToken: "FAKE_ID_TOKEN" }),
      })
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("E-Mail id"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() =>
      expect(VerifyEmail).toHaveBeenCalledWith("FAKE_ID_TOKEN")
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("shows Firebase error message when signup fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            error: { message: "EMAIL_EXISTS" },
          }),
      })
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("E-Mail id"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() =>
      expect(screen.getByText("EMAIL_EXISTS")).toBeInTheDocument()
    );
  });

  test("submit button disables during loading", async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ idToken: "FAKE_ID_TOKEN" }),
              }),
            300
          )
        )
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("E-Mail id"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // The button will temporarily change to "Logging in..."
    expect(
      screen.getByRole("button", { name: "Logging in..." })
    ).toBeDisabled();
  });
});
