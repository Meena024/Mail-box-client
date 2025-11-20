import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import "./Inbox.css";

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = useSelector((state) => state.auth.userEmail);

  const sanitizeEmail = (email) => email.replace(/\./g, "_");

  useEffect(() => {
    if (!userEmail) return;

    const fetchEmails = async () => {
      setLoading(true);
      const sanitizedEmail = sanitizeEmail(userEmail);

      const firebaseURL =
        "https://mail-box-client-daab9-default-rtdb.firebaseio.com";

      try {
        const response = await axios.get(
          `${firebaseURL}/emails/inbox/${sanitizedEmail}.json`
        );

        if (response.data) {
          // Convert objects to array with id
          const inboxArray = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));

          // Sort by latest → oldest
          inboxArray.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setEmails(inboxArray);
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchEmails();
  }, [userEmail]);

  if (loading) {
    return <div className="inbox-loading">Loading emails...</div>;
  }

  return (
    <div className="inbox-container">
      <div className="inbox-header">
        <h3>Inbox</h3>
      </div>

      <div className="inbox-list">
        {emails.length === 0 && (
          <div className="no-emails">No emails found.</div>
        )}

        {emails.map((email) => (
          <div className="email-row" key={email.id}>
            <div className="email-left">
              {!email.read && <span className="unread-dot"></span>}
              <span className="email-from">{email.from}</span>
            </div>

            <div className="email-subject">{email.subject}</div>

            <div className="email-date">
              {moment(email.date).format("MMM D")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
