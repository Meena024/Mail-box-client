import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AuthAction } from "../Redux store/AuthSlice";
import { useNavigate } from "react-router";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    dispatch(AuthAction.reset());
    navigate("/");
  };
  return (
    <div className="d-flex justify-content-end">
      {isLoggedIn && (
        <Button className="m-3" onClick={logoutHandler}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default Header;
