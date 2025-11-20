import CreateEmail from "./Email/CreateEmail/CreateEmail";
import { useEffect } from "react";
import { fetchAuthData } from "../../Redux store/AuthActions";
import { useDispatch } from "react-redux";
import Header from "../Header";

const ProfileMain = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(fetchAuthData(token));
  });

  return (
    <>
      <Header />
      <CreateEmail />
    </>
  );
};

export default ProfileMain;
