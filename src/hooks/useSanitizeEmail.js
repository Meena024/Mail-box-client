export const useSanitizeEmail = () => {
  const sanitizeEmail = (email) => email.replace(/\./g, "_");
  return sanitizeEmail;
};
