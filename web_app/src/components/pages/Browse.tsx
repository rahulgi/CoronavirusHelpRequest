import React from "react";

import { DefaultLayout } from "../common/DefaultLayout";
import { HelpRequestsList } from "../HelpRequestsList";

export const BrowsePage: React.FC = () => {
  return (
    <DefaultLayout pageTitle="Browse help requests">
      <p>
        &ldquo;Ask not what your country can do for you — ask what you can do
        for your country.&rdquo; - John F. Kennedy
      </p>
      <HelpRequestsList />
    </DefaultLayout>
  );
};
