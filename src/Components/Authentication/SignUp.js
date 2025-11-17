import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import VerifyEmail from "./VerifyEmail";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signupHandler = async (e) => {
    e.preventDefault();
    setError(null);
    if (password === confirmPassword) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBIff0BiIBL_jAXC6QAM6b9x5AfS6PQQg4`,
          {
            method: "POST",
            body: JSON.stringify({
              email,
              password,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error.message || "Signup failed!");
        }

        console.log("Sign Up Successfull! data:", data);

        //Verify email id
        VerifyEmail(data.idToken);
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Passwords doesn't match");
    }
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "20rem" }}>
        <Card.Title className="text-center mt-3">
          <h1>Sign Up</h1>
        </Card.Title>

        <Form onSubmit={signupHandler} className="p-3">
          {/* Email */}
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

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Control
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3">
            <Form.Control
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Form.Group>

          {/* Error */}
          {error && <div className="text-danger text-center mb-2">{error}</div>}

          {/* Submit button */}
          <div className="d-grid">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Sign Up"}
            </Button>
          </div>

          {/* Go to Login */}
          <div className="text-center mt-3">
            <Button type="button" variant="link" onClick={() => navigate("/")}>
              Already have an Account?
              <div className="fw-bold">SIGN IN</div>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
