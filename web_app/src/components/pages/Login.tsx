import React from "react";
import { DefaultLayout } from "../common/DefaultLayout";
import { Auth } from "../Auth";

export const LoginPage: React.FC = () => {
  return (
    <DefaultLayout pageTitle="Login">
      <Auth />
    </DefaultLayout>
  );
};
