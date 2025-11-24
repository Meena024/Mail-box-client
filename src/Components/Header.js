import { useDispatch, useSelector } from "react-redux";
import { AuthAction } from "../Redux store/AuthSlice";
import { useNavigate } from "react-router";
import Header_class from "./UI/Header.module.css";
import { IoMdLogOut } from "react-icons/io";

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
    <div className={Header_class.head}>
      <h2>Mail Box</h2>
      {isLoggedIn && (
        <button className="m-3" onClick={logoutHandler}>
          <IoMdLogOut />
        </button>
      )}
    </div>
  );
};

export default Header;
