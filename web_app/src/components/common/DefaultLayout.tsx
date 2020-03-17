import React from "react";
import styled from "@emotion/styled/macro";

import { spacing } from "../../styles/spacing";
import { Link } from "react-router-dom";
import { useAuthStatus, AuthStatus } from "../contexts/AuthContext";
import { useLocation } from "../../hooks/useLocation";

const Title = styled.h3`
  margin: ${spacing.l} 0;
`;

const NavBar = styled.div`
  display: flex;
  & *:not(:last-child) {
    margin-right: ${spacing.m};
  }
`;

const Header = styled.div``;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  & > *:not(:last-child) {
    margin-bottom: ${spacing.l};
  }
`;

const PageTitle = styled.h4`
  margin: ${spacing.l} 0;
`;

const Footer = styled.div`
  margin: auto 0 ${spacing.l} 0;
  padding-top: ${spacing.l};
`;

interface DefaultLayoutProps {
  pageTitle: string;
  subtitle?: string;
}

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  pageTitle
}) => {
  const isLoggedIn = useAuthStatus() === AuthStatus.LOGGED_IN;

  return (
    <div className="app">
      <Header>
        <StyledLink to="/">
          <Title>Coronavirus Help Requests</Title>
        </StyledLink>
        <NavBar>
          <Link to="/">Browse requests</Link>
          <Link to="/offerHelp">Offer help</Link>
          <Link to="/requestHelp">Request help</Link>
          {isLoggedIn && <Link to="/messages">Messages</Link>}
          <Link to="/faq">FAQ</Link>
        </NavBar>
      </Header>
      <PageTitle>{pageTitle}</PageTitle>
      <Contents>{children}</Contents>
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
