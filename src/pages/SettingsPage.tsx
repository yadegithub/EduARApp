import { IonContent, IonIcon, IonPage, IonToggle } from "@ionic/react";
import {
  cloudDownloadOutline,
  colorPaletteOutline,
  exitOutline,
  globeOutline,
  headsetOutline,
  moonOutline,
  notificationsOutline,
  phonePortraitOutline,
  shieldCheckmarkOutline,
  sunnyOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import ProfileShortcut from "../components/ProfileShortcut";
import { useAppSettings } from "../settings/AppSettingsContext";

const SettingsPage: React.FC = () => {
  const history = useHistory();
  const { logout, user } = useAuth();
  const { settings, setSetting } = useAppSettings();
  const isArabic = settings.language === "ar";

  const copy = isArabic
    ? {
        title: "صمّم تجربة الواقع المعزز بما يناسب المتعلمين.",
        intro:
          "اضبط الصوت والمظهر والتنزيلات حتى يعمل التطبيق بسلاسة على أجهزة Android.",
        appearance: "المظهر",
        themeTitle: "وضع التطبيق",
        themeBody: "بدّل بين الوضع الفاتح والوضع الداكن في جميع الصفحات.",
        lightMode: "فاتح",
        darkMode: "داكن",
        experience: "التجربة",
        notificationsTitle: "إشعارات الدروس",
        notificationsBody:
          "تذكير الطلاب بالسلاسل التعليمية والوحدات الجديدة والإنجازات.",
        audioTitle: "الدليل الصوتي",
        audioBody: "تشغيل السرد والتسميات الصوتية أثناء جلسات الواقع المعزز.",
        hapticsTitle: "الاهتزاز",
        hapticsBody: "استخدام اهتزاز خفيف أثناء تدوير النماذج وتكبيرها.",
        deviceAssets: "الجهاز والملفات",
        offlineTitle: "الوضع دون اتصال",
        offlineBody:
          "الاحتفاظ بالوحدات المفضلة محفوظة للفصول ذات الاتصال الضعيف.",
        qualityTitle: "خامات عالية الجودة",
        qualityBody: "تحميل نماذج أكثر تفصيلًا للأجهزة الأحدث.",
        childSafeTitle: "وضع آمن للأطفال",
        childSafeBody: "إعدادات مناسبة للمعلم مع تقييد الروابط الخارجية.",
        enabled: "مفعّل",
        language: "اللغة",
        languageTitle: "لغة التطبيق",
        languageBody: "اختر بين الإنجليزية والعربية في صفحة الإعدادات.",
        profile: "الملف الشخصي",
        english: "الإنجليزية",
        arabic: "العربية",
        account: "الحساب",
        signOutTitle: "تسجيل الخروج",
        signOutBody: "العودة إلى شاشة تسجيل الدخول ومسح الجلسة الحالية.",
        logout: "خروج",
        signedInUser: "المستخدم الحالي",
      }
    : {
        title: "Design the AR experience around your learners.",
        intro:
          "Tune audio, visuals and downloads so the app feels polished on Android from the first launch.",
        appearance: "Appearance",
        themeTitle: "App theme",
        themeBody: "Switch between light and dark mode across the app.",
        lightMode: "Light",
        darkMode: "Dark",
        experience: "Experience",
        notificationsTitle: "Lesson notifications",
        notificationsBody:
          "Remind students about streaks, new modules and milestones.",
        audioTitle: "Audio guide",
        audioBody: "Play narration and spoken labels during active AR sessions.",
        hapticsTitle: "Haptics",
        hapticsBody:
          "Use subtle tap feedback while rotating and scaling models.",
        deviceAssets: "Device & Assets",
        offlineTitle: "Offline mode",
        offlineBody:
          "Keep your favorite modules cached for classrooms with weak Wi-Fi.",
        qualityTitle: "High quality textures",
        qualityBody: "Load more detailed models for newer Android devices.",
        childSafeTitle: "Kid-safe mode",
        childSafeBody:
          "Teacher-friendly defaults with restricted external links.",
        enabled: "Enabled",
        language: "Language",
        languageTitle: "App language",
        languageBody:
          "Choose between English and Arabic for the settings page.",
        profile: "Profile",
        english: "English",
        arabic: "Arabic",
        account: "Account",
        signOutTitle: "Sign out",
        signOutBody: "Return to the login screen and clear the current session.",
        logout: "Logout",
        signedInUser: "Signed in user",
      };

  const handleLogout = () => {
    logout();
    history.replace("/login");
  };

  return (
    <IonPage>
      <IonContent fullscreen className="app-page">
        <div
          className="screen screen--settings"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="screen__ambient screen__ambient--settings-left" />
          <div className="screen__ambient screen__ambient--settings-right" />

          <div className="topbar topbar--light">
            <div className="topbar__spacer" aria-hidden="true" />
            <ProfileShortcut
              label={copy.profile}
              onClick={() => history.push("/tabs/progress")}
            />
          </div>

          <section className="settings-hero">
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
            <div className="settings-user-chip">
              <strong>{user?.name ?? copy.signedInUser}</strong>
              <span>{user?.email ?? "guest@eduar.app"}</span>
            </div>
          </section>

          <section className="settings-card">
            <div className="section-head section-head--compact">
              <h2>{copy.appearance}</h2>
            </div>

            <div className="setting-row setting-row--stacked">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon
                    icon={settings.theme === "dark" ? moonOutline : sunnyOutline}
                  />
                </span>
                <div>
                  <strong>{copy.themeTitle}</strong>
                  <p>{copy.themeBody}</p>
                </div>
              </div>

              <div
                className="setting-choice-group"
                role="group"
                aria-label={copy.themeTitle}
              >
                <button
                  type="button"
                  className={`setting-choice ${
                    settings.theme === "light" ? "setting-choice--active" : ""
                  }`}
                  onClick={() => setSetting("theme", "light")}
                >
                  {copy.lightMode}
                </button>
                <button
                  type="button"
                  className={`setting-choice ${
                    settings.theme === "dark" ? "setting-choice--active" : ""
                  }`}
                  onClick={() => setSetting("theme", "dark")}
                >
                  {copy.darkMode}
                </button>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="section-head section-head--compact">
              <h2>{copy.experience}</h2>
            </div>

            <div className="setting-row">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={notificationsOutline} />
                </span>
                <div>
                  <strong>{copy.notificationsTitle}</strong>
                  <p>{copy.notificationsBody}</p>
                </div>
              </div>
              <IonToggle
                checked={settings.notifications}
                onIonChange={(event) =>
                  setSetting("notifications", event.detail.checked)
                }
              />
            </div>

            <div className="setting-row">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={headsetOutline} />
                </span>
                <div>
                  <strong>{copy.audioTitle}</strong>
                  <p>{copy.audioBody}</p>
                </div>
              </div>
              <IonToggle
                checked={settings.audioGuide}
                onIonChange={(event) =>
                  setSetting("audioGuide", event.detail.checked)
                }
              />
            </div>

            <div className="setting-row">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={phonePortraitOutline} />
                </span>
                <div>
                  <strong>{copy.hapticsTitle}</strong>
                  <p>{copy.hapticsBody}</p>
                </div>
              </div>
              <IonToggle
                checked={settings.haptics}
                onIonChange={(event) => setSetting("haptics", event.detail.checked)}
              />
            </div>
          </section>

          <section className="settings-card">
            <div className="section-head section-head--compact">
              <h2>{copy.deviceAssets}</h2>
            </div>

            <div className="setting-row">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={cloudDownloadOutline} />
                </span>
                <div>
                  <strong>{copy.offlineTitle}</strong>
                  <p>{copy.offlineBody}</p>
                </div>
              </div>
              <IonToggle
                checked={settings.offlineMode}
                onIonChange={(event) =>
                  setSetting("offlineMode", event.detail.checked)
                }
              />
            </div>

            <div className="setting-row">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={colorPaletteOutline} />
                </span>
                <div>
                  <strong>{copy.qualityTitle}</strong>
                  <p>{copy.qualityBody}</p>
                </div>
              </div>
              <IonToggle
                checked={settings.highQuality}
                onIonChange={(event) =>
                  setSetting("highQuality", event.detail.checked)
                }
              />
            </div>

            <div className="setting-row setting-row--static">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={shieldCheckmarkOutline} />
                </span>
                <div>
                  <strong>{copy.childSafeTitle}</strong>
                  <p>{copy.childSafeBody}</p>
                </div>
              </div>
              <button type="button" className="ghost-button ghost-button--chip">
                {copy.enabled}
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="section-head section-head--compact">
              <h2>{copy.language}</h2>
            </div>

            <div className="setting-row setting-row--stacked">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={globeOutline} />
                </span>
                <div>
                  <strong>{copy.languageTitle}</strong>
                  <p>{copy.languageBody}</p>
                </div>
              </div>

              <div
                className="setting-choice-group"
                role="group"
                aria-label={copy.language}
              >
                <button
                  type="button"
                  className={`setting-choice ${
                    settings.language === "en" ? "setting-choice--active" : ""
                  }`}
                  onClick={() => setSetting("language", "en")}
                >
                  {copy.english}
                </button>
                <button
                  type="button"
                  className={`setting-choice ${
                    settings.language === "ar" ? "setting-choice--active" : ""
                  }`}
                  onClick={() => setSetting("language", "ar")}
                >
                  {copy.arabic}
                </button>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="section-head section-head--compact">
              <h2>{copy.account}</h2>
            </div>

            <div className="setting-row setting-row--static">
              <div className="setting-row__copy">
                <span className="setting-row__icon">
                  <IonIcon icon={exitOutline} />
                </span>
                <div>
                  <strong>{copy.signOutTitle}</strong>
                  <p>{copy.signOutBody}</p>
                </div>
              </div>
              <button
                type="button"
                className="ghost-button ghost-button--chip"
                onClick={handleLogout}
              >
                {copy.logout}
              </button>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
