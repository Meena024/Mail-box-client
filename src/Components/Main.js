import { Routes, Route } from "react-router";
import ProfileMain from "./Profile/ProfileMain";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import ForgotPassword from "./Authentication/ForgotPassword";
import Card from "./UI/Card/Card";
import Header from "./Header";

const Main = () => {
  return (
    <Card>
      <Header />
      <Routes>
        <Route path="/UserProfile/*" element={<ProfileMain />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<h1>Page Not Found!</h1>} />
      </Routes>
    </Card>
  );
};

export default Main;
