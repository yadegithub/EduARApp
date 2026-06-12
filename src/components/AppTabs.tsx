import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  cube,
  cubeOutline,
  grid,
  gridOutline,
  settings,
  settingsOutline,
  statsChart,
  statsChartOutline,
} from "ionicons/icons";
import { Redirect, Route, useLocation } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import LibraryPage from "../pages/LibraryPage";
import ProgressPage from "../pages/ProgressPage";
import SettingsPage from "../pages/SettingsPage";
import { useAppSettings } from "../settings/AppSettingsContext";

const tabLabels = {
  en: {
    dashboard: "Dashboard",
    library: "AR Library",
    progress: "My Profile",
    settings: "Settings",
  },
  ar: {
    dashboard: "الرئيسية",
    library: "مكتبة AR",
    progress: "ملفي الشخصي",
    settings: "الإعدادات",
  },
  fr: {
    dashboard: "Accueil",
    library: "Bibliothèque AR",
    progress: "Mon profil",
    settings: "Paramètres",
  },
} as const;

const AppTabs: React.FC = () => {
  const location = useLocation();
  const { settings: appSettings } = useAppSettings();
  const usesDarkChrome =
    appSettings.theme === "dark" ||
    location.pathname.startsWith("/tabs/library");
  const copy = tabLabels[appSettings.language];

  const tabs = [
    {
      id: "dashboard",
      label: copy.dashboard,
      href: "/tabs/dashboard",
      icon: gridOutline,
      activeIcon: grid,
    },
    {
      id: "library",
      label: copy.library,
      href: "/tabs/library",
      icon: cubeOutline,
      activeIcon: cube,
    },
    {
      id: "progress",
      label: copy.progress,
      href: "/tabs/progress",
      icon: statsChartOutline,
      activeIcon: statsChart,
    },
    {
      id: "settings",
      label: copy.settings,
      href: "/tabs/settings",
      icon: settingsOutline,
      activeIcon: settings,
    },
  ];

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/dashboard">
          <DashboardPage />
        </Route>
        <Route exact path="/tabs/library">
          <LibraryPage />
        </Route>
        <Route exact path="/tabs/progress">
          <ProgressPage />
        </Route>
        <Route exact path="/tabs/settings">
          <SettingsPage />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar
        slot="bottom"
        className={`app-tab-bar ${usesDarkChrome ? "app-tab-bar--dark" : ""}`}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.href;

          return (
            <IonTabButton key={tab.id} tab={tab.id} href={tab.href}>
              <IonIcon icon={isActive ? tab.activeIcon : tab.icon} />
              <IonLabel>{tab.label}</IonLabel>
            </IonTabButton>
          );
        })}
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
