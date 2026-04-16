import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
  arrowBack,
  atOutline,
  globeOutline,
  idCardOutline,
} from "ionicons/icons";
import { Redirect, useHistory } from "react-router-dom";
import profileAvatarImage from "../assets/images/profile-user.png";
import { useAuth } from "../auth/useAuth";
import ProfileShortcut from "../components/ProfileShortcut";
import { getAchievementCopy } from "../i18n/appCopy";
import { getUserProgressProfile } from "../profile/userProgressStore";
import { useAppSettings } from "../settings/AppSettingsContext";

const normalizeRoleLabel = (role: string, isArabic: boolean) => {
  const normalizedRole = role.trim().toLowerCase();

  if (
    normalizedRole === "student explorer" ||
    normalizedRole === "student" ||
    normalizedRole === "studant"
  ) {
    return isArabic ? "طالب" : "Student";
  }

  return role.trim();
};

const ProgressPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { settings } = useAppSettings();

  if (!user) {
    return <Redirect to="/login" />;
  }

  const profile = getUserProgressProfile(user);
  const isArabic = settings.language === "ar";
  const localizedRole = normalizeRoleLabel(user.role, isArabic);
  const copy = isArabic
    ? {
        back: "العودة إلى الرئيسية",
        avatar: "صورة الملف الشخصي",
        profileInfo: "المعلومات الشخصية",
        email: "البريد الإلكتروني",
        role: "الدور",
        language: "اللغة",
        english: "الإنجليزية",
        arabic: "العربية",
        recentAchievements: "الإنجازات الأخيرة",
      }
    : {
        back: "Back to dashboard",
        avatar: "Profile avatar",
        profileInfo: "Profile Information",
        email: "Email",
        role: "Role",
        language: "Language",
        english: "English",
        arabic: "Arabic",
        recentAchievements: "Recent Achievements",
      };

  return (
    <IonPage>
      <IonContent fullscreen className="app-page">
        <div
          className="screen screen--progress"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="screen__ambient screen__ambient--profile-left" />
          <div className="screen__ambient screen__ambient--profile-right" />

          <div className="topbar topbar--light">
            <button
              type="button"
              className="icon-button"
              aria-label={copy.back}
              onClick={() => history.push("/tabs/dashboard")}
            >
              <IonIcon icon={arrowBack} />
            </button>

            <div className="topbar__spacer" aria-hidden="true" />

            <ProfileShortcut label={isArabic ? "الملف الشخصي" : "Profile"} />
          </div>

          <section className="profile-card">
            <div
              className="profile-card__avatar profile-card__avatar--image"
              role="img"
              aria-label={`${user.name} avatar`}
            >
              <img src={profileAvatarImage} alt={user.name} />
            </div>

            <div className="profile-card__header">
              <h1>{user.name}</h1>
              <p className="profile-card__role">{localizedRole}</p>
            </div>

            <div className="profile-info">
              <div className="section-head section-head--compact">
                <h2>{copy.profileInfo}</h2>
              </div>

              <div className="profile-info__list">
                <div className="profile-info__item">
                  <span className="profile-info__icon">
                    <IonIcon icon={atOutline} />
                  </span>
                  <div className="profile-info__copy">
                    <strong>{copy.email}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="profile-info__item">
                  <span className="profile-info__icon">
                    <IonIcon icon={idCardOutline} />
                  </span>
                  <div className="profile-info__copy">
                    <strong>{copy.role}</strong>
                    <span>{localizedRole}</span>
                  </div>
                </div>

                <div className="profile-info__item">
                  <span className="profile-info__icon">
                    <IonIcon icon={globeOutline} />
                  </span>
                  <div className="profile-info__copy">
                    <strong>{copy.language}</strong>
                    <span>{isArabic ? copy.arabic : copy.english}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card">
            <div className="section-head section-head--compact">
              <h2>{copy.recentAchievements}</h2>
            </div>

            <div className="achievement-list">
              {profile.achievements.map((achievement) => {
                const localizedAchievement = getAchievementCopy(
                  achievement,
                  settings.language,
                );

                return (
                  <article key={achievement.id} className="achievement-card">
                    <div className="achievement-card__marker" />
                    <div className="achievement-card__copy">
                      <strong>{localizedAchievement.title}</strong>
                      <p>{localizedAchievement.description}</p>
                    </div>
                    <span>{localizedAchievement.time}</span>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProgressPage;
