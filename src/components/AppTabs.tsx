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

const AppTabs: React.FC = () => {
  const location = useLocation();
  const { settings: appSettings } = useAppSettings();
  const usesDarkChrome =
    appSettings.theme === "dark" ||
    location.pathname.startsWith("/tabs/library");
  const isArabic = appSettings.language === "ar";
  const tabs = [
    {
      id: "dashboard",
      label: isArabic ? "الرئيسية" : "Dashboard",
      href: "/tabs/dashboard",
      icon: gridOutline,
      activeIcon: grid,
    },
    {
      id: "library",
      label: isArabic ? "مكتبة AR" : "AR Library",
      href: "/tabs/library",
      icon: cubeOutline,
      activeIcon: cube,
    },
    {
      id: "progress",
      label: isArabic ? "ملفي الشخصي" : "My Profile",
      href: "/tabs/progress",
      icon: statsChartOutline,
      activeIcon: statsChart,
    },
    {
      id: "settings",
      label: isArabic ? "الإعدادات" : "Settings",
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
