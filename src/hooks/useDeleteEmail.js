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

    await api.remove(`emails/${type}/${sanitized}/${id}`);

    // 🔥 Update Redux immediately
    if (type === "inbox") {
      dispatch(EmailActions.deleteEmail(id));
    } else if (type === "sent") {
      dispatch(EmailActions.deleteSentEmail(id));
    }
  };

  return deleteEmail;
};
