import { useEffect, useState } from "react";
import { useEmailApi } from "./useEmailApi";
import { useSanitizeEmail } from "./useSanitizeEmail";
import { useSelector, useDispatch } from "react-redux";
import { EmailActions } from "../Redux store/EmailSlice";

export const useFetchDraft = () => {
  const dispatch = useDispatch();
  const emails = useSelector((state) => state.email.drafts);
  const userEmail = useSelector((state) => state.auth.userEmail);

  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchEmails = async () => {
      setLoading(true);

      const sanitized = sanitizeEmail(userEmail);
      const data = await api.get(`Emails/Drafts/${sanitized}`);

      const draftArray = data
        ? Object.keys(data).map((id) => ({ id, ...data[id] }))
        : [];

      draftArray.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      dispatch(EmailActions.setDrafts(draftArray));
      setLoading(false);
    };

    fetchEmails();
    // eslint-disable-next-line
  }, [userEmail]);

  return { emails, loading };
};
