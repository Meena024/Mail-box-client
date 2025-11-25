import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import "./EmailListing.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import { EmailActions } from "../../../../Redux store/EmailSlice";
import { useEmailApi } from "../../../../hooks/useEmailApi";
import { useSanitizeEmail } from "../../../../hooks/useSanitizeEmail";

const EmailListing = ({ type, emails, deleteEmail }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();

  const userEmail = useSelector((s) => s.auth.userEmail);
  const detailedViewHandler = async (mail) => {
    const sanitizedEmail = sanitizeEmail(userEmail);

    navigate(`/UserProfile/email/${mail.id}`);
    dispatch(EmailActions.markAsRead(mail.id));

    await api.patch(`emails/inbox/${sanitizedEmail}/${mail.id}`, {
      read: true,
    });
  };

  const starHandler = async (mail) => {
    const sanitizedEmail = sanitizeEmail(userEmail);

    dispatch(EmailActions.UpdateStar(mail.id));

    await api.patch(`emails/${type}/${sanitizedEmail}/${mail.id}`, {
      starred: !mail.starred,
    });
  };

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
            onClick={() => detailedViewHandler(mail)}
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                starHandler(mail);
              }}
            >
              {!mail.starred && <FaRegStar />}
              {mail.starred && <FaStar />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailListing;
