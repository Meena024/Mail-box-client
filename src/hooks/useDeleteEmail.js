import { useDispatch } from "react-redux";
import { useEmailApi } from "./useEmailApi";
import { useSanitizeEmail } from "./useSanitizeEmail";
import { EmailActions } from "../Redux store/EmailSlice";

export const useDeleteEmail = () => {
  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();
  const dispatch = useDispatch();

  const deleteEmail = async (userEmail, type, id) => {
    const sanitized = sanitizeEmail(userEmail);
    const category = type.includes("Sent")
      ? "sent"
      : type.includes("Inbox")
      ? "inbox"
      : "drafts";
    await api.remove(`Emails/${category}/${sanitized}/${id}`);

    // 🔥 Update Redux immediately
    if (type === "Inbox") {
      dispatch(EmailActions.deleteEmail(id));
    } else if (type.includes === "Sent") {
      dispatch(EmailActions.deleteSentEmail(id));
    }
  };

  return deleteEmail;
};
