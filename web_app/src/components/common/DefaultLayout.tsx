import React from "react";
import styled from "@emotion/styled/macro";

import { spacing } from "../helpers/styles";
import { Link } from "react-router-dom";
import { useLoggedIn, AuthStatus } from "../contexts/AuthContext";

const NavBar = styled.div`
  display: flex;
  & *:not(:last-child) {
    margin-right: ${spacing.m};
  }
`;

interface DefaultLayoutProps {
  pageTitle: string;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  pageTitle
}) => {
  const isLoggedIn = useLoggedIn() === AuthStatus.LOGGED_IN;

  return (
    <div className="app">
      <div>
        <h1>Covid19 Help Request</h1>
        <NavBar>
          <Link to="/">Browse help requests</Link>
          {isLoggedIn ? (
            <Link to="/logout">Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </NavBar>
      </div>
      <div>
        <h2>{pageTitle}</h2>
        {children}
      </div>
    </div>
  );
};
