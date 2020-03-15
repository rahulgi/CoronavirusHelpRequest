import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { BrowsePage } from "./components/pages/Browse";
import { LoginPage } from "./components/pages/Login";
import { AuthProvider } from "./components/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact>
            <BrowsePage />
          </Route>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
