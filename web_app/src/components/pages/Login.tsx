import React from "react";
import { DefaultLayout } from "../common/DefaultLayout";
import { Auth } from "../Auth";
import { useLocation } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirectTo");

  return (
    <DefaultLayout pageTitle="Login">
      <Auth redirectTo={redirectTo || undefined} />
    </DefaultLayout>
  );
};
