import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, Form, Button } from "react-bootstrap";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBIff0BiIBL_jAXC6QAM6b9x5AfS6PQQg4`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email,
          }),
        }
      );

      const data = await response.json();
      console.log(data, response);

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to send reset email!");
      }

      setMessage("Password reset link has been sent!");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "20rem" }}>
        <Card.Title className="text-center mt-3">
          <h1>Forgot Password</h1>
        </Card.Title>

        <Form onSubmit={resetPasswordHandler} className="p-3">
          {/* Email Field */}
          <Form.Group className="mb-3">
            <Form.Control
              id="email"
              type="email"
              placeholder="E-Mail id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </Form.Group>

          {/* Submit */}
          <div className="d-grid">
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Reset Password"}
            </Button>
          </div>

          {/* Success / Error Messages */}
          {message && (
            <p className="text-success mt-3 text-center">{message}</p>
          )}
          {error && <p className="text-danger mt-3 text-center">{error}</p>}

          {/* Back to Login */}
          <div className="text-center mt-3">
            <Button type="button" variant="link" onClick={() => navigate("/")}>
              Go back to Sign In?
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
