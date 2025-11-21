import "./Sent.css";
import moment from "moment";
import { useSelector } from "react-redux";
import { useFetchSent } from "../../../../hooks/useFetchSent";
import { useDeleteEmail } from "../../../../hooks/useDeleteEmail";
import { useNavigate } from "react-router-dom";

const Sent = () => {
  const navigate = useNavigate();
  const { emails, loading } = useFetchSent();
  const userEmail = useSelector((state) => state.auth.userEmail);
  const deleteEmail = useDeleteEmail();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="sent-container">
      <div className="sent-header">
        <h3>Sent Emails</h3>
      </div>

      <div className="sent-list">
        {emails.length === 0 && <div>No sent emails.</div>}

        {emails.map((email) => (
          <div
            className="sent-row"
            key={email.id}
            onClick={() => navigate(`/UserProfile/email/${email.id}`)}
          >
            <div className="sent-to">{email.to}</div>
            <div className="sent-subject">{email.subject}</div>
            <div className="sent-date">
              {moment(email.date).format("MMM D")}
            </div>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent opening email
                deleteEmail(userEmail, "sent", email.id);
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

export default Sent;
