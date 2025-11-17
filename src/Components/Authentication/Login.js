import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // async function getValidIdToken() {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   if (!refreshToken) return null;

  //   const res = await fetch(
  //     "https://securetoken.googleapis.com/v1/token?key=AIzaSyCdDyLfXnyTrvbTA4whPdjq4GY3KqZ8dWc",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  //     }
  //   );
  //   const data = await res.json();

  //   if (!res.ok) throw new Error(data.error?.message || "Token refresh failed");

  //   localStorage.setItem("token", data.id_token);
  //   localStorage.setItem("refreshToken", data.refresh_token);
  //   localStorage.setItem("tokenExpiry", Date.now() + data.expires_in * 1000);

  //   dispatch(AuthAction.setIdToken(data.id_token));

  //   return data.id_token;
  // }

  // function scheduleTokenRefresh() {
  //   const expiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
  //   const timeout = expiry - Date.now() - 30000; // 30s before expiry

  //   if (timeout > 0) {
  //     setTimeout(async () => {
  //       await getValidIdToken();
  //       scheduleTokenRefresh();
  //     }, timeout);
  //   }
  // }

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
      // localStorage.setItem("refreshToken", data.refreshToken);
      // localStorage.setItem("tokenExpiry", Date.now() + data.expiresIn * 1000);

      // scheduleTokenRefresh();
      navigate("/UserProfile");
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
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </Button>
          </div>

          {/* Forgot password */}
          <div className="text-center mt-3">
            <Button
              type="button"
              variant="link"
              color="black"
              onClick={() => navigate("/ForgotPassword")}
            >
              Forgot Password?
            </Button>
          </div>

          {/* Signup */}
          <div className="text-center mt-2">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/SignUp")}
            >
              Create a new Account?
              <div className="fw-bold">SIGN UP</div>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
