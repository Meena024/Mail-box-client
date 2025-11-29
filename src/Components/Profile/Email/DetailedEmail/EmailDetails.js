import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./EmailDetails.css";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { EmailActions } from "../../../../Redux store/EmailSlice";

const EmailDetails = () => {
  const { id } = useParams();
  const inbox = useSelector((state) => state.email.inbox);
  const sent = useSelector((state) => state.email.sent);
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.userEmail);

  const firebaseURL =
    "https://mail-box-client-daab9-default-rtdb.firebaseio.com";

  const sanitizeEmail = (email) => email.replace(/\./g, "_");

  const mail = inbox.find((m) => m.id === id) || sent.find((m) => m.id === id);

  if (!mail) return <div>Email not found</div>;

  const category = inbox.some((m) => m.id === id) ? "Inbox" : "Sent";

  const deleteEmailHandler = async (mailId) => {
    const sanitizedEmail = sanitizeEmail(userEmail);

    try {
      await axios.delete(
        `${firebaseURL}/Emails/${category}/${sanitizedEmail}/${mailId}.json`
      );

      if (category === "inbox") {
        dispatch(EmailActions.deleteEmail(mailId));
      } else {
        dispatch(EmailActions.deleteSentEmail(mailId));
      }
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  return (
    <div className="email-details">
      <div className="email-header-row">
        <h2>{mail.subject}</h2>
        <div className="delete-btn" onClick={() => deleteEmailHandler(mail.id)}>
          <MdDeleteOutline />
        </div>
      </div>

      <div className="email-info">
        {category === "Inbox" && (
          <div>
            <strong>From:</strong> {mail.from}
          </div>
        )}

        {category === "Sent" && (
          <div>
            <strong>To:</strong> {mail.to}
          </div>
        )}
      </div>

      <div
        className="email-body"
        dangerouslySetInnerHTML={{ __html: mail.emaildata }}
      ></div>
    </div>
  );
};

export default EmailDetails;
