import { useEffect, useState } from "react";
import { useEmailApi } from "./useEmailApi";
import { useSanitizeEmail } from "./useSanitizeEmail";
import { useSelector, useDispatch } from "react-redux";
import { EmailActions } from "../Redux store/EmailSlice";

export const useFetchSent = () => {
  const dispatch = useDispatch();
  const emails = useSelector((state) => state.email.sent);
  const userEmail = useSelector((state) => state.auth.userEmail);

  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchEmails = async () => {
      setLoading(true);

      const sanitized = sanitizeEmail(userEmail);
      const data = await api.get(`emails/sent/${sanitized}`);

      const sentArray = data
        ? Object.keys(data).map((id) => ({ id, ...data[id] }))
        : [];

      sentArray.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      dispatch(EmailActions.setSent(sentArray));
      setLoading(false);
    };

    fetchEmails();
    // eslint-disable-next-line
  }, [userEmail]);

  return { emails, loading };
};
