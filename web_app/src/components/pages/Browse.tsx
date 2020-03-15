import React from "react";

import { DefaultLayout } from "../common/DefaultLayout";
import { HelpRequestsList } from "../HelpRequestsList";
import { useLoggedIn } from "../contexts/AuthContext";

export const BrowsePage: React.FC = () => {
  const loggedInStatus = useLoggedIn();

  return (
    <DefaultLayout pageTitle="Browse help requests">
      <p>
        &ldquo;Ask not what your country can do for you — ask what you can do
        for your country.&rdquo; - John F. Kennedy
      </p>
      <p>You are {loggedInStatus}</p>
      <HelpRequestsList />
    </DefaultLayout>
  );
};
