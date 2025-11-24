import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import "./EmailListing.css";
// import "./EmailListing.css";
// keep inbox styling

const EmailListing = ({ type, emails, deleteEmail }) => {
  const navigate = useNavigate();
  const userEmail = useSelector((s) => s.auth.userEmail);

  if (!emails) return <div>Loading...</div>;

  return (
    <div className="inbox-container">
      <div className="inbox-header">
        <h3>{type === "sent" ? "Sent Emails" : "Inbox"}</h3>
      </div>

      <div className="inbox-list">
        {emails.length === 0 && (
          <div className="no-emails">
            {type === "sent" ? "No sent emails." : "No emails"}
          </div>
        )}

        {emails.map((mail) => (
          <div
            className="email-row"
            key={mail.id}
            onClick={() => navigate(`/UserProfile/email/${mail.id}`)}
          >
            <div className="email-from">
              {type === "inbox" && !mail.read && (
                <span className="unread-dot"></span>
              )}
              {type === "inbox" ? mail.from : mail.to}
            </div>

            <div className="email-subject">{mail.subject}</div>

            <div className="email-date">
              {moment(mail.date).format("MMM D")}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteEmail(userEmail, type, mail.id);
              }}
            >
              <MdDeleteOutline />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailListing;
