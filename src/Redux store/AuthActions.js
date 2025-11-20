import { AuthAction } from "./AuthSlice";

export const fetchAuthData = (token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBIff0BiIBL_jAXC6QAM6b9x5AfS6PQQg4`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      const user = data?.users?.[0];
      if (!user) {
        console.warn("User not found");
        return null;
      }

      dispatch(AuthAction.login(user));

      return user.localId;
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      return null;
    }
  };
};
