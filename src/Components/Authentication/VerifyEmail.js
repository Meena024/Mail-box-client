const VerifyEmail = async (idToken) => {
  const verify_response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBIff0BiIBL_jAXC6QAM6b9x5AfS6PQQg4`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType: "VERIFY_EMAIL",
        idToken: idToken,
      }),
    }
  );

  const verify_email = await verify_response.json();

  if (!verify_response.ok) {
    throw new Error(
      verify_email.error.message || "Failed to send verification email!"
    );
  }

  alert("Verification email sent successfully!");
};

export default VerifyEmail;
