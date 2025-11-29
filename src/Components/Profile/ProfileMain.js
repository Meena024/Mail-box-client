import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAuthData } from "../../Redux store/AuthActions";
import CreateEmail from "./Email/CreateEmail/CreateEmail";
import { Row, Col } from "react-bootstrap";
import MenuBar from "./MenuBar";
import EmailDetails from "./Email/DetailedEmail/EmailDetails";
import { Routes, Route } from "react-router-dom";
import main_class from "../UI/ProfileMain.module.css";
import EmailListing from "./Email/EmailListing/EmailListing";
import { useFetchInbox } from "../../hooks/useFetchInbox";
import { useFetchSent } from "../../hooks/useFetchSent";
import { useFetchDraft } from "../../hooks/useFetchDraft";

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
          <Route path="compose" element={<CreateEmail />} />
          <Route
            path="Inbox"
            element={
              <EmailListing type="Inbox" emails={useFetchInbox().emails} />
            }
          />
          <Route
            path="Unread"
            element={
              <EmailListing
                type="Unread: Inbox"
                emails={useFetchInbox().emails.filter((email) => !email.read)}
              />
            }
          />
          <Route
            path="Starred/Inbox"
            element={
              <EmailListing
                type="Starred: Inbox"
                emails={useFetchInbox().emails.filter((email) => email.starred)}
              />
            }
          />
          <Route
            path="Starred/Sent"
            element={
              <EmailListing
                type="Starred: Sent"
                emails={useFetchSent().emails.filter((email) => email.starred)}
              />
            }
          />
          <Route
            path="Drafts"
            element={
              <EmailListing type="Drafts" emails={useFetchDraft().emails} />
            }
          />
          <Route path="email/:id" element={<EmailDetails />} />
          <Route
            path="Sent"
            element={
              <EmailListing type="Sent" emails={useFetchSent().emails} />
            }
          />
        </Routes>
      </Col>
    </Row>
  );
};

export default ProfileMain;
