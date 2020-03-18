import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { BrowsePage } from "./components/pages/Browse";
import { LoginPage } from "./components/pages/Login";
import { AuthProvider } from "./components/contexts/AuthContext";
import { LogoutPage } from "./components/pages/Logout";
import { MakeRequestPage } from "./components/pages/MakeRequest";
import { HelpRequestPage } from "./components/pages/HelpRequest";
import { MessageThreadsPage } from "./components/pages/MessageThreads";
import { injectGlobalStyles } from "./styles";
import { MakeOfferPage } from "./components/pages/MakeOffer";
import { AboutPage } from "./components/pages/About";
import { HelpOfferPage } from "./components/pages/HelpOffer";
import { PrivacyPolicyPage } from "./components/pages/PrivacyPolicy";

class App extends React.Component {
  public componentDidMount() {
    injectGlobalStyles();
  }

  public render() {
    return (
      <AuthProvider>
        <Router>
          <Switch>
            <Route path="/" exact>
              <BrowsePage />
            </Route>

            <Route path="/offerHelp" exact>
              <MakeOfferPage />
            </Route>
            <Route path="/offer/:id" component={HelpOfferPage} exact />
            <Route
              path="/offer/:id/thread/:threadId"
              component={HelpOfferPage}
              exact
            />

            <Route path="/requestHelp" exact>
              <MakeRequestPage />
            </Route>
            <Route path="/request/:id" component={HelpRequestPage} exact />
            <Route
              path="/request/:id/thread/:threadId"
              component={HelpRequestPage}
              exact
            />

            <Route path="/messages" exact>
              <MessageThreadsPage />
            </Route>

            <Route path="/faq" exact>
              <AboutPage />
            </Route>

            <Route path="/login" exact>
              <LoginPage />
            </Route>
            <Route path="/logout" exact>
              <LogoutPage />
            </Route>

            <Route path="/privacy" exact>
              <PrivacyPolicyPage />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
