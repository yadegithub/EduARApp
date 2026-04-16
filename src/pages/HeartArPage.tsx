import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./HeartArPage.css";

type HeartArPageProps = {
  experienceTitle: string;
  language: string;
  onBack: () => void;
  theme: string;
};

const HeartArPage: React.FC<HeartArPageProps> = ({
  experienceTitle,
  language,
  onBack,
  theme,
}) => {
  const resolvedLanguage = language === "ar" ? "ar" : "en";
  const searchParams = new URLSearchParams({
    lang: resolvedLanguage,
    theme: theme === "light" ? "light" : "dark",
  });

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} className="heart-ar-content">
        <div
          className="heart-ar-shell"
          dir={resolvedLanguage === "ar" ? "rtl" : "ltr"}
        >
          <iframe
            className="heart-ar-frame"
            title={experienceTitle}
            src={`/test_heart/indexx.html?${searchParams.toString()}`}
            allow="camera; microphone; autoplay; fullscreen"
            allowFullScreen
          />

          <div className="heart-ar-overlay">
            <div className="heart-ar-topbar">
              <button
                type="button"
                className="icon-button icon-button--dark"
                aria-label={resolvedLanguage === "ar" ? "العودة" : "Go back"}
                onClick={onBack}
              >
                <IonIcon icon={arrowBack} />
              </button>

              <div className="heart-ar-title-pill">{experienceTitle}</div>

              <span className="heart-ar-topbar__spacer" aria-hidden="true" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HeartArPage;
