import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { BrowsePage } from "./components/pages/Browse";
import { LoginPage } from "./components/pages/Login";
import { AuthProvider } from "./components/contexts/AuthContext";
import { LogoutPage } from "./components/pages/Logout";
import { MakeRequestPage } from "./components/pages/MakeRequest";
import { HelpRequestPage } from "./components/pages/HelpRequest";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact>
            <BrowsePage />
          </Route>
          <Route path="/requestHelp" exact>
            <MakeRequestPage />
          </Route>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
          <Route path="/logout" exact>
            <LogoutPage />
          </Route>
          <Route path="/request/:id" component={HelpRequestPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
