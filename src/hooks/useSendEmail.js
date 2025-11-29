import moment from "moment";
import { useEmailApi } from "./useEmailApi";
import { useSanitizeEmail } from "./useSanitizeEmail";

export const useSendEmail = () => {
  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();

  const sendEmail = async (from, to, subject, body) => {
    const emailData = {
      from,
      to,
      subject,
      emaildata: body,
      read: false,
      starred: false,
      date: moment().format("LLL"),
    };

    const sanitizedTo = sanitizeEmail(to);
    const sanitizedFrom = sanitizeEmail(from);

    await api.post(`Emails/Inbox/${sanitizedTo}`, emailData);
    await api.post(`Emails/Sent/${sanitizedFrom}`, emailData);
  };

  return sendEmail;
};
