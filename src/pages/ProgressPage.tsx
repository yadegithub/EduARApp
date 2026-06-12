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
import {
  useAppSettings,
  type AppLanguage,
} from "../settings/AppSettingsContext";

const normalizeRoleLabel = (role: string, language: AppLanguage) => {
  const normalizedRole = role.trim().toLowerCase();

  if (
    normalizedRole === "student explorer" ||
    normalizedRole === "student" ||
    normalizedRole === "studant"
  ) {
    if (language === "ar") {
      return "طالب";
    }

    if (language === "fr") {
      return "Étudiant";
    }

    return "Student";
  }

  if (normalizedRole === "new learner") {
    if (language === "ar") {
      return "متعلم جديد";
    }

    if (language === "fr") {
      return "Nouvel apprenant";
    }
  }

  return role.trim();
};

const progressCopy = {
  en: {
    back: "Back to dashboard",
    profile: "Profile",
    profileInfo: "Profile Information",
    email: "Email",
    role: "Role",
    language: "Language",
    english: "English",
    arabic: "Arabic",
    french: "French",
    recentAchievements: "Recent Achievements",
  },
  ar: {
    back: "العودة إلى الرئيسية",
    profile: "الملف الشخصي",
    profileInfo: "المعلومات الشخصية",
    email: "البريد الإلكتروني",
    role: "الدور",
    language: "اللغة",
    english: "الإنجليزية",
    arabic: "العربية",
    french: "الفرنسية",
    recentAchievements: "الإنجازات الأخيرة",
  },
  fr: {
    back: "Retour au tableau de bord",
    profile: "Profil",
    profileInfo: "Informations du profil",
    email: "E-mail",
    role: "Rôle",
    language: "Langue",
    english: "Anglais",
    arabic: "Arabe",
    french: "Français",
    recentAchievements: "Succès récents",
  },
} as const;

const ProgressPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { settings } = useAppSettings();

  if (!user) {
    return <Redirect to="/login" />;
  }

  const profile = getUserProgressProfile(user);
  const isArabic = settings.language === "ar";
  const localizedRole = normalizeRoleLabel(user.role, settings.language);
  const copy = progressCopy[settings.language] ?? progressCopy.en;
  const languageLabel =
    settings.language === "ar"
      ? copy.arabic
      : settings.language === "fr"
        ? copy.french
        : copy.english;

  return (
    <IonPage>
      <IonContent fullscreen className="app-page">
        <div className="screen screen--progress" dir={isArabic ? "rtl" : "ltr"}>
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

            <ProfileShortcut label={copy.profile} />
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
                    <span>{languageLabel}</span>
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
