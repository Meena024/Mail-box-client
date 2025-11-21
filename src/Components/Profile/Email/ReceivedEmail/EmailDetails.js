import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./EmailDetails.css";
import axios from "axios";
import { EmailActions } from "../../../../Redux store/EmailSlice";

const EmailDetails = () => {
  const { id } = useParams();
  const inbox = useSelector((state) => state.email.inbox);
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.userEmail);

  const firebaseURL =
    "https://mail-box-client-daab9-default-rtdb.firebaseio.com";

  const sanitizeEmail = (email) => email.replace(/\./g, "_");

  const mail = inbox.find((m) => {
    console.log(m, id);
    return m.id === id;
  });

  if (!mail) return <div>Email not found</div>;

  const deleteEmailHandler = async (mailId) => {
    const sanitizedEmail = sanitizeEmail(userEmail);

    try {
      await axios.delete(
        `${firebaseURL}/emails/inbox/${sanitizedEmail}/${mailId}.json`
      );

      dispatch(EmailActions.deleteEmail(mailId));
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  return (
    <div className="email-details">
      <div className="email-header-row">
        <h2>{mail.subject}</h2>
        <button
          className="delete-btn"
          onClick={() => deleteEmailHandler(mail.id)}
        >
          Delete
        </button>
      </div>

      <div className="email-info">
        <strong>From:</strong> {mail.from}
      </div>

      <div
        className="email-body"
        dangerouslySetInnerHTML={{ __html: mail.emaildata }}
      ></div>
    </div>
  );
};

export default EmailDetails;
