import "./CreateEmail.css";
import JoditEditor from "jodit-react";
import { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSendEmail } from "../../../../hooks/useSendEmail";

const CreateEmail = () => {
  const editor = useRef(null);
  const inputToRef = useRef("");
  const inputSubjectRef = useRef("");

  const authUserEmail = useSelector((state) => state.auth.userEmail);

  const [content, setContent] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendEmail = useSendEmail();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const enteredTo = inputToRef.current.value.trim();
    const subject = inputSubjectRef.current.value.trim();

    if (!isValidEmail(enteredTo)) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      await sendEmail(authUserEmail, enteredTo, subject, content);

      alert("Email sent successfully!");

      inputToRef.current.value = "";
      inputSubjectRef.current.value = "";
      setContent("");
      if (editor.current) editor.current.value = "";
    } catch (err) {
      alert("Failed to send email");
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
