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

  // Convert email to Firebase-safe key
  const sanitizeEmail = (email) => {
    return email.replace(/\./g, "_");
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const enteredTo = inputToRef.current.value;
    const enteredSubject = inputSubjectRef.current.value;

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
      // Store in receiver inbox
      await axios.post(
        `${firebaseURL}/emails/inbox/${sanitizedTo}.json`,
        emailData
      );

      // Store in sender sentbox
      await axios.post(
        `${firebaseURL}/emails/sent/${sanitizedFrom}.json`,
        emailData
      );

      alert("Email sent successfully!");
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
