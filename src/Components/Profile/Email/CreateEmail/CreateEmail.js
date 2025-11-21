import "./CreateEmail.css";
import JoditEditor from "jodit-react";
import { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

const CreateEmail = () => {
  const editor = useRef(null);
  const inputToRef = useRef("");
  const inputSubjectRef = useRef("");

  const authUserEmail = useSelector((state) => state.auth.userEmail);

  const [content, setContent] = useState("");

  const sanitizeEmail = (email) => email.replace(/\./g, "_");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const enteredTo = inputToRef.current.value.trim();
    const enteredSubject = inputSubjectRef.current.value.trim();

    if (!isValidEmail(enteredTo)) {
      alert("Please enter a valid email address.");
      return;
    }

    const sanitizedTo = sanitizeEmail(enteredTo);
    const sanitizedFrom = sanitizeEmail(authUserEmail);

    const emailData = {
      from: authUserEmail,
      to: enteredTo,
      subject: enteredSubject,
      emaildata: content,
      read: false,
      date: moment().format("LLL"),
    };

    const firebaseURL =
      "https://mail-box-client-daab9-default-rtdb.firebaseio.com";

    try {
      await axios.post(
        `${firebaseURL}/emails/inbox/${sanitizedTo}.json`,
        emailData
      );

      await axios.post(
        `${firebaseURL}/emails/sent/${sanitizedFrom}.json`,
        emailData
      );

      alert("Email sent successfully!");

      inputToRef.current.value = "";
      inputSubjectRef.current.value = "";
      setContent("");
      if (editor.current) {
        editor.current.value = "";
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="emailInput">
      <form onSubmit={formSubmitHandler}>
        <input
          type="text"
          ref={inputToRef}
          className="input"
          placeholder="To"
        />
        <input
          type="text"
          ref={inputSubjectRef}
          className="input"
          placeholder="Subject"
        />

        <JoditEditor
          ref={editor}
          value={content}
          onChange={(newContent) => setContent(newContent)}
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button className="m-2" type="submit">
            Send
          </Button>

          <Link to="/Users">
            <Button className="m-2">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateEmail;
