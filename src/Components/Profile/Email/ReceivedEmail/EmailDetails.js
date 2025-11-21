import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./EmailDetails.css";

const EmailDetails = () => {
  const { id } = useParams();
  const inbox = useSelector((state) => state.email.inbox);

  const mail = inbox.find((m) => {
    console.log(m, id);
    return m.id === id;
  });

  if (!mail) return <div>Email not found</div>;

  return (
    <div className="email-details">
      <h2>{mail.subject}</h2>

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
