import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { AuthProvider } from "./auth/AuthContext";
import AppTabs from "./components/AppTabs";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SplashPage from "./pages/SplashPage";
import ViewerPage from "./pages/ViewerPage";
import { AppSettingsProvider } from "./settings/AppSettingsContext";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppSettingsProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/">
              <SplashPage />
            </Route>
            <Route exact path="/site">
              <LandingPage />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <ProtectedRoute path="/tabs">
              <AppTabs />
            </ProtectedRoute>
            <ProtectedRoute exact path="/viewer/:experienceId">
              <ViewerPage />
            </ProtectedRoute>
            <Route>
              <Redirect to="/" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </AppSettingsProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
