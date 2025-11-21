import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { EmailActions } from "../../../../Redux store/EmailSlice";
import "./Sent.css";

const Sent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emails = useSelector((state) => state.email.sent);
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
          `${firebaseURL}/emails/sent/${sanitizedEmail}.json`
        );

        if (response.data) {
          const sentArray = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));

          sentArray.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          console.log(sentArray);
          dispatch(EmailActions.setSent(sentArray));
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
  };

  const deleteEmailHandler = async (mailId) => {
    const sanitizedEmail = sanitizeEmail(userEmail);

    try {
      await axios.delete(
        `${firebaseURL}/emails/sent/${sanitizedEmail}/${mailId}.json`
      );

      dispatch(EmailActions.deleteSentEmail(mailId));
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
        <h3>Sent </h3>
      </div>

      <div className="inbox-list">
        {emails.length === 0 && (
          <div className="no-emails">No emails found.</div>
        )}

        {emails.map((email) => (
          <div
            className="email-row"
            key={email.id}
            onClick={() => openEmailHandler(email)}
          >
            <div
              className="email-left mx-2"
              onClick={() => openEmailHandler(email)}
            >
              <span className="email-from">{email.to}</span>
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

export default Sent;
