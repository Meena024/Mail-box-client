// EmailDetails.test.js
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";
import EmailDetails from "../Profile/Email/ReceivedEmail/EmailDetails";

const mockStore = configureStore([]);

const mockInbox = [
  {
    id: "1",
    subject: "Hello World",
    from: "test@example.com",
    emaildata: "<p>This is a test email</p>",
  },
  {
    id: "2",
    subject: "Another Email",
    from: "another@example.com",
    emaildata: "<p>Another body</p>",
  },
];

const renderWithStoreAndRouter = (id, inbox = mockInbox) => {
  const store = mockStore({
    email: { inbox },
    auth: { userEmail: "test@gmail.com" },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/email/${id}`]}>
        <Routes>
          <Route path="/email/:id" element={<EmailDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("EmailDetails Component", () => {
  test("renders email subject correctly", () => {
    renderWithStoreAndRouter("1");
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("renders email body using dangerouslySetInnerHTML", () => {
    renderWithStoreAndRouter("1");
    expect(screen.getByText("This is a test email")).toBeInTheDocument();
  });

  test("shows 'Email not found' if ID does not match", () => {
    renderWithStoreAndRouter("999");
    expect(screen.getByText("Email not found")).toBeInTheDocument();
  });

  test("renders correct 'from' field", () => {
    renderWithStoreAndRouter("2");
    expect(screen.getByText("another@example.com")).toBeInTheDocument();
  });

  test("selects correct email based on route param", () => {
    renderWithStoreAndRouter("2");
    expect(screen.getByText("Another Email")).toBeInTheDocument();
    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
  });
});
