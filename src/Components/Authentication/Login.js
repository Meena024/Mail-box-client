import { useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { AuthAction } from "../../Redux store/AuthSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBIff0BiIBL_jAXC6QAM6b9x5AfS6PQQg4`,
        {
          method: "POST",
          body: JSON.stringify({ email, password, returnSecureToken: true }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed!");
      }

      localStorage.setItem("token", data.idToken);

      dispatch(AuthAction.login(data));

      navigate("/UserProfile/inbox");
    } catch (err) {
      setError(err.message);
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "20rem" }}>
        <Card.Title className="text-center mt-3">
          <h1>Sign In</h1>
        </Card.Title>

        <Form onSubmit={loginHandler} className="p-3">
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
              autoComplete="current-password"
              required
            />
          </Form.Group>

          {/* Error message */}
          {error && <div className="text-danger text-center mb-2">{error}</div>}

          {/* Submit button */}
          <div className="d-grid">
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-center mt-3">
            <Link to="/ForgotPassword">Forgot Password?</Link>
          </div>

          {/* Signup */}
          <div className="text-center mt-2">
            <Link to="/SignUp">
              Create a new Account?
              <div className="fw-bold">SIGN UP</div>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
