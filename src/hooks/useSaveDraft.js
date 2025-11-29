import { useEmailApi } from "./useEmailApi";
import { useSanitizeEmail } from "./useSanitizeEmail";
import moment from "moment";

export const useSaveDraft = () => {
  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();

  const saveDraft = async (userEmail, to, subject, body) => {
    const sanitized = sanitizeEmail(userEmail);

    const draftData = {
      from: userEmail,
      to,
      subject,
      emaildata: body,
      read: false,
      starred: false,
      draft: true,
      date: moment().format("LLL"),
    };

    await api.post(`Emails/Drafts/${sanitized}`, draftData);
  };

  return saveDraft;
};
