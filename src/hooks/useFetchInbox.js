import { useEffect, useRef, useState } from "react";
import { useEmailApi } from "./useEmailApi";
import { useSanitizeEmail } from "./useSanitizeEmail";
import { useDispatch, useSelector } from "react-redux";
import { EmailActions } from "../Redux store/EmailSlice";

export const useFetchInbox = () => {
  const dispatch = useDispatch();
  const emails = useSelector((state) => state.email.inbox);
  const userEmail = useSelector((state) => state.auth.userEmail);

  const api = useEmailApi();
  const sanitizeEmail = useSanitizeEmail();

  const [loading, setLoading] = useState(true);
  const previousDataRef = useRef("");

  useEffect(() => {
    if (!userEmail) return;

    const sanitized = sanitizeEmail(userEmail);

    const fetchEmails = async () => {
      const data = await api.get(`Emails/Inbox/${sanitized}`);
      const inboxArray = data
        ? Object.keys(data).map((id) => ({ id, ...data[id] }))
        : [];

      inboxArray.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const newJson = JSON.stringify(inboxArray);

      if (previousDataRef.current !== newJson) {
        previousDataRef.current = newJson;
        dispatch(EmailActions.setInbox(inboxArray));

        const unread = inboxArray.filter((m) => !m.read).length;
        dispatch(EmailActions.setUnreadCount(unread));
      }

      setLoading(false);
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [userEmail]);

  return { emails, loading };
};
