import { IonContent, IonPage } from "@ionic/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { useAppSettings } from "../settings/AppSettingsContext";

const SplashPage: React.FC = () => {
  const history = useHistory();
  const { settings } = useAppSettings();
  const isArabic = settings.language === "ar";
  const copy = isArabic
    ? {
        eyebrow: "فصل دراسي غامر",
        subtitle: "دروس واقع معزز مصممة للتعلم عبر الهاتف.",
        loading: "جاري التحميل",
      }
    : {
        eyebrow: "Immersive classroom",
        subtitle: "Augmented reality lessons made for mobile-first learning.",
        loading: "Loading",
      };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      history.replace("/login");
    }, 1700);

    return () => window.clearTimeout(timeoutId);
  }, [history]);

  return (
    <IonPage>
      <IonContent fullscreen className="app-page">
        <div className="screen screen--splash">
          <div className="screen__ambient screen__ambient--splash-left" />
          <div className="screen__ambient screen__ambient--splash-right" />

          <div className="splash-layout">
            <div className="brand-hero">
              <BrandMark className="brand-mark--hero" />
              <div className="brand-hero__copy">
                <span className="brand-copy__eyebrow">{copy.eyebrow}</span>
                <strong>AR Learn</strong>
                <p>{copy.subtitle}</p>
              </div>
            </div>

            <div className="splash-loader" role="status" aria-label={copy.loading}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashPage;
