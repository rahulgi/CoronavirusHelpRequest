import React from "react";
import { getAuth } from "../../firebase/auth";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { useHistory } from "react-router-dom";

export const LogoutPage: React.FC = () => {
  const history = useHistory();

  async function logout() {
    return getAuth().signOut();
  }

  function redirectHome() {
    history.push("/");
  }

  useAsyncEffect({
    asyncOperation: logout,
    handleResponse: redirectHome,
    handleError: e => console.error(e)
  });

  return <div>Logging out...</div>;
};
