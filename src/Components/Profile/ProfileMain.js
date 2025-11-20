import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthData } from "../../Redux store/AuthActions";
import CreateEmail from "./Email/CreateEmail/CreateEmail";
import Header from "../Header";
import { Row, Col } from "react-bootstrap";
import MenuBar from "./MenuBar";
import Inbox from "./Email/Inbox";

const ProfileMain = () => {
  const dispatch = useDispatch();
  const renderingComp = useSelector((state) => state.misc.renderingComp);

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
          {renderingComp === "Compose" && <CreateEmail />}
          {renderingComp === "Inbox" && <Inbox />}
        </Col>
      </Row>
    </>
  );
};

export default ProfileMain;
