import React from "react";
import styled from "@emotion/styled/macro";

import { spacing } from "../helpers/styles";
import { Link } from "react-router-dom";
import { useLoggedInStatus, AuthStatus } from "../contexts/AuthContext";

const NavBar = styled.div`
  display: flex;
  & *:not(:last-child) {
    margin-right: ${spacing.m};
  }
`;

const Footer = styled.div`
  margin: ${spacing.l} 0 ${spacing.l} 0;
`;

interface DefaultLayoutProps {
  pageTitle: string;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  pageTitle
}) => {
  const isLoggedIn = useLoggedInStatus() === AuthStatus.LOGGED_IN;

  return (
    <div className="app">
      <div>
        <h1>Covid19 Help Request</h1>
        <NavBar>
          <Link to="/">Browse help requests</Link>
          <Link to="/requestHelp">Request help</Link>
        </NavBar>
      </div>
      <div>
        <h2>{pageTitle}</h2>
        {children}
      </div>
      <Footer>
        {isLoggedIn ? (
          <Link to="/logout">Logout</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Footer>
    </div>
  );
};
