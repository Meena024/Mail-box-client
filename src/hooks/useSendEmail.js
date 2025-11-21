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
      date: moment().format("LLL"),
    };

    const sanitizedTo = sanitizeEmail(to);
    const sanitizedFrom = sanitizeEmail(from);

    await api.post(`emails/inbox/${sanitizedTo}`, emailData);
    await api.post(`emails/sent/${sanitizedFrom}`, emailData);
  };

  return sendEmail;
};
