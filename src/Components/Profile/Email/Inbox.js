import { useSelector } from "react-redux";
import "./Inbox.css";
import { useFetchInbox } from "../../../hooks/useFetchInbox";
import { useDeleteEmail } from "../../../hooks/useDeleteEmail";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Inbox = () => {
  const navigate = useNavigate();
  const { emails, loading } = useFetchInbox();
  const userEmail = useSelector((s) => s.auth.userEmail);
  const deleteEmail = useDeleteEmail();

  if (loading) return <div className="inbox-loading">Loading...</div>;
  if (!userEmail) return <div>Please login</div>;

  return (
    <div className="inbox-container">
      <div className="inbox-header">
        <h3>Inbox</h3>
      </div>

      <div className="inbox-list">
        {emails.length === 0 && <div className="no-emails">No emails</div>}

        {emails.map((mail) => (
          <div
            className="email-row"
            key={mail.id}
            onClick={() => navigate(`/UserProfile/email/${mail.id}`)}
          >
            <div className="email-from">
              {!mail.read && <span className="unread-dot"></span>}
              {mail.from}
            </div>

            <div className="email-subject">{mail.subject}</div>

            <div className="email-date">
              {moment(mail.date).format("MMM D")}
            </div>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteEmail(userEmail, "inbox", mail.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
