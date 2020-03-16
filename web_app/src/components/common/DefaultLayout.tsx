import React from "react";
import styled from "@emotion/styled/macro";

import { spacing } from "../../styles/spacing";
import { Link } from "react-router-dom";
import { useAuthStatus, AuthStatus } from "../contexts/AuthContext";

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
  const isLoggedIn = useAuthStatus() === AuthStatus.LOGGED_IN;

  return (
    <div className="app">
      <div>
        <h3>Covid19 Help Requests</h3>
        <NavBar>
          <Link to="/">Browse requests</Link>
          <Link to="/requestHelp">Request help</Link>
          {isLoggedIn && <Link to="/messages">Messages</Link>}
        </NavBar>
      </div>
      <div>
        <h4>{pageTitle}</h4>
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
