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
import { OfferHelpPage } from "./components/pages/OfferHelp";
import { AboutPage } from "./components/pages/About";

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
              <OfferHelpPage />
            </Route>

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

            <Route path="/about" exact>
              <AboutPage />
            </Route>

            <Route path="/login" exact>
              <LoginPage />
            </Route>
            <Route path="/logout" exact>
              <LogoutPage />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
