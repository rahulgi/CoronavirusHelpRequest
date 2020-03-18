import React from "react";
import { DefaultLayout } from "../common/DefaultLayout";
import { OfferHelpCard } from "../OfferHelpCard";
import { useAuthStatus, AuthStatus } from "../contexts/AuthContext";
import { Redirect } from "react-router-dom";

export const MakeOfferPage: React.FC = () => {
  const loggedInStatus = useAuthStatus();

  if (loggedInStatus === AuthStatus.LOGGED_OUT) {
    return <Redirect to="/login?redirectTo=/offerHelp" />;
  }

  return (
    <DefaultLayout pageTitle="Offer help">
      <OfferHelpCard />
    </DefaultLayout>
  );
};
