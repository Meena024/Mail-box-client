import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAuthData } from "../../Redux store/AuthActions";
import CreateEmail from "./Email/CreateEmail/CreateEmail";
import Header from "../Header";
import { Row, Col } from "react-bootstrap";
import MenuBar from "./MenuBar";
import Inbox from "./Email/Inbox";
import EmailDetails from "./Email/ReceivedEmail/EmailDetails";
import { Routes, Route } from "react-router-dom";

const ProfileMain = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(fetchAuthData(token));
  }, [dispatch]);

  return (
    <>
      <Header />

      <Row>
        <Col xs={2}>
          <MenuBar />
        </Col>

        <Col xs={10}>
          <Routes>
            <Route index element={<Inbox />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="compose" element={<CreateEmail />} />
            <Route path="email/:id" element={<EmailDetails />} />
          </Routes>
        </Col>
      </Row>
    </>
  );
};

export default ProfileMain;
