import "./CreateEmail.css";
import JoditEditor from "jodit-react";
import { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useSendEmail } from "../../../../hooks/useSendEmail";
import { useSaveDraft } from "../../../../hooks/useSaveDraft";

const CreateEmail = () => {
  const editor = useRef(null);
  const inputToRef = useRef("");
  const inputSubjectRef = useRef("");
  const saveDraft = useSaveDraft();

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
      alert("Please enter a valid email address");
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

        <div className="email-buttons">
          <Button className="action-btn" type="submit">
            Send
          </Button>

          <Button
            style={{
              backgroundColor: "#C85C8E",
              border: "1px solid #C85C8E",
            }}
            className="my-2"
            onClick={async () => {
              const to = inputToRef.current.value;
              const subject = inputSubjectRef.current.value;
              const body = editor.current.value;

              // Do NOT save empty drafts
              if (to || subject || body) {
                await saveDraft(authUserEmail, to, subject, body);
                alert("Draft saved.");
              }

              // Navigate away
              window.location.href = "/UserProfile/inbox";
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmail;
