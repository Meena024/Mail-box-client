import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAuthData } from "../../Redux store/AuthActions";
import CreateEmail from "./Email/CreateEmail/CreateEmail";
import { Row, Col } from "react-bootstrap";
import MenuBar from "./MenuBar";
import EmailDetails from "./Email/ReceivedEmail/EmailDetails";
import { Routes, Route } from "react-router-dom";
import main_class from "../UI/ProfileMain.module.css";
import EmailListing from "./Email/EmailListing/EmailListing";
import { useFetchInbox } from "../../hooks/useFetchInbox";
import { useFetchSent } from "../../hooks/useFetchSent";
import { useDeleteEmail } from "../../hooks/useDeleteEmail";

const ProfileMain = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(fetchAuthData(token));
  }, [dispatch]);

  return (
    <Row>
      <Col xs="auto" className={main_class.sidebar}>
        <MenuBar />
      </Col>

      <Col className={main_class.routes}>
        <Routes>
          <Route
            path="inbox"
            element={
              <EmailListing
                type="inbox"
                emails={useFetchInbox().emails}
                deleteEmail={useDeleteEmail()}
              />
            }
          />
          <Route path="compose" element={<CreateEmail />} />
          <Route path="email/:id" element={<EmailDetails />} />
          <Route
            path="sent"
            element={
              <EmailListing
                type="sent"
                emails={useFetchSent().emails}
                deleteEmail={useDeleteEmail()}
              />
            }
          />
        </Routes>
      </Col>
    </Row>
  );
};

export default ProfileMain;
