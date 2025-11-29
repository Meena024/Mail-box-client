import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import "./EmailListing.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import { EmailActions } from "../../../../Redux store/EmailSlice";
import { useEmailApi } from "../../../../hooks/useEmailApi";
import { useSanitizeEmail } from "../../../../hooks/useSanitizeEmail";
import { useDeleteEmail } from "../../../../hooks/useDeleteEmail";

const EmailListing = ({ type, emails }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const deleteEmail = useDeleteEmail();
  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();

  const userEmail = useSelector((s) => s.auth.userEmail);
  const detailedViewHandler = async (mail, type) => {
    const sanitizedEmail = sanitizeEmail(userEmail);

    navigate(`/UserProfile/email/${mail.id}`);
    dispatch(EmailActions.markAsRead(mail.id));

    await api.patch(`Emails/Inbox/${sanitizedEmail}/${mail.id}`, {
      ...mail,
      read: true,
    });
  };

  const starHandler = async (mail, type) => {
    const sanitizedEmail = sanitizeEmail(userEmail);

    console.log(type, "aaa");
    dispatch(EmailActions.UpdateStar({ id: mail.id, type }));
    const category = type.includes("Sent")
      ? "Sent"
      : type.includes("Inbox")
      ? "Inbox"
      : "Drafts";
    await api.patch(`Emails/${category}/${sanitizedEmail}/${mail.id}`, {
      ...mail,
      starred: !mail.starred,
    });
  };

  if (!emails) return <div>Loading...</div>;

  return (
    <div className="inbox-container">
      <div className="inbox-header">
        <h3>{type}</h3>
      </div>

      <div className="inbox-list">
        {emails.length === 0 && (
          <div className="no-emails">No emails found!</div>
        )}

        {emails.map((mail) => (
          <div
            className="email-row"
            key={mail.id}
            onClick={() => detailedViewHandler(mail, type)}
          >
            <div
              className="star-icon"
              onClick={(e) => {
                e.stopPropagation(); // prevent opening email
                starHandler(mail, type);
              }}
            >
              {mail.starred ? <FaStar /> : <FaRegStar />}
            </div>
            <div className="email-from">
              {type === "Inbox" && !mail.read && (
                <span className="unread-dot"></span>
              )}
              {type === "Inbox" ? mail.from : mail.to}
            </div>

            <div className="email-subject">{mail.subject}</div>

            <div className="email-date">
              {moment(mail.date).format("MMM D")}
            </div>

            <div
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteEmail(userEmail, type, mail.id);
              }}
            >
              <MdDeleteOutline />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailListing;
