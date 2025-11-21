import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { EmailActions } from "../../../Redux store/EmailSlice";
import "./Inbox.css";

const Inbox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emails = useSelector((state) => state.email.inbox);
  const unreadCount = useSelector((state) => state.email.unreadCount);
  const userEmail = useSelector((state) => state.auth.userEmail);

  const [loading, setLoading] = useState(true);
  const firebaseURL =
    "https://mail-box-client-daab9-default-rtdb.firebaseio.com";

  const sanitizeEmail = (email) => email.replace(/\./g, "_");

  // Fetch Emails
  useEffect(() => {
    if (!userEmail) return;

    const fetchEmails = async () => {
      setLoading(true);
      const sanitizedEmail = sanitizeEmail(userEmail);

      try {
        const response = await axios.get(
          `${firebaseURL}/emails/inbox/${sanitizedEmail}.json`
        );

        if (response.data) {
          const inboxArray = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));

          inboxArray.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          dispatch(EmailActions.setInbox(inboxArray));
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchEmails();
  }, [userEmail, dispatch]);

  const openEmailHandler = async (mail) => {
    navigate(`/UserProfile/email/${mail.id}`);

    if (!mail.read) {
      const sanitizedEmail = sanitizeEmail(userEmail);

      await axios.patch(
        `${firebaseURL}/emails/inbox/${sanitizedEmail}/${mail.id}.json`,
        { read: true }
      );

      dispatch(EmailActions.markAsRead(mail.id));
    }
  };

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

  if (!userEmail) {
    return <div className="no-emails">Please login to view your inbox.</div>;
  }
  if (loading) {
    return <div className="inbox-loading">Loading emails...</div>;
  }
  return (
    <div className="inbox-container">
      <div className="inbox-header">
        <h3>Inbox ({unreadCount})</h3>
      </div>

      <div className="inbox-list">
        {emails.length === 0 && (
          <div className="no-emails">No emails found.</div>
        )}

        {emails.map((email) => (
          <div className="email-row" key={email.id}>
            <div className="email-left" onClick={() => openEmailHandler(email)}>
              {!email.read && <span className="unread-dot px-2"></span>}
              <span className="email-from">{email.from}</span>
            </div>

            <div
              className="email-subject"
              onClick={() => openEmailHandler(email)}
            >
              {email.subject}
            </div>

            <div className="email-date" onClick={() => openEmailHandler(email)}>
              {moment(email.date).format("MMM D")}
            </div>
            <div>
              <button
                className="delete-btn"
                onClick={() => deleteEmailHandler(email.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
