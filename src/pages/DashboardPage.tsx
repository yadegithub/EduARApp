import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { arrowForward, menuOutline, playCircle } from "ionicons/icons";
import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { useHistory } from "react-router-dom";
import geographyImage from "../assets/images/geography.jpg";
import historyImage from "../assets/images/history.jpg";
import humanLungImage from "../assets/images/corps humain.jpg";
import physicsImage from "../assets/images/physics.jpg";
import ProfileShortcut from "../components/ProfileShortcut";
import {
  featuredExperiences,
  subjects,
  type SubjectId,
} from "../data/arData";
import { getExperienceCopy, getSubjectCopy } from "../i18n/appCopy";
import { useAppSettings } from "../settings/AppSettingsContext";

const subjectImageMap: Record<SubjectId, string> = {
  biology: humanLungImage,
  physics: physicsImage,
  history: historyImage,
  geography: geographyImage,
};

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const { settings } = useAppSettings();
  const featuredStripRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
  });
  const isArabic = settings.language === "ar";
  const [isDragging, setIsDragging] = useState(false);
  const copy = isArabic
    ? {
        eyebrow: "فصل دراسي غامر",
        profile: "الملف الشخصي",
        title: "تعلّم مع مشاهد ثلاثية الأبعاد مصممة للواقع المعزز على الهاتف.",
        subtitle: "ابدأ بالعلوم ثم افتح التاريخ والجغرافيا في الواقع المعزز.",
        openDemo: "افتح العرض",
        explore: "استكشف",
        subjects: "المواد",
        viewAll: "عرض الكل",
        featured: "مميز",
        featuredTitle: "تجارب AR المميزة",
      }
    : {
        eyebrow: "Immersive classroom",
        profile: "Profile",
        title: "Learn with 3D scenes built for mobile AR.",
        subtitle: "Start with science, then open history and geography in AR.",
        openDemo: "Open demo",
        explore: "Explore",
        subjects: "Subjects",
        viewAll: "View all",
        featured: "Featured",
        featuredTitle: "Featured AR Experiences",
      };

  const handleStripPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const strip = featuredStripRef.current;

    if (!strip) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: strip.scrollLeft,
    };
    strip.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handleStripPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const strip = featuredStripRef.current;

    if (
      !strip ||
      !isDragging ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    strip.scrollLeft = dragStateRef.current.scrollLeft - deltaX;
  };

  const stopStripDragging = (event?: ReactPointerEvent<HTMLDivElement>) => {
    const strip = featuredStripRef.current;

    if (strip && event && dragStateRef.current.pointerId === event.pointerId) {
      strip.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current.pointerId = -1;
    setIsDragging(false);
  };

  const handleStripWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const strip = featuredStripRef.current;

    if (!strip) {
      return;
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      strip.scrollLeft += event.deltaY;
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="app-page">
        <div
          className="screen screen--dashboard"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="screen__ambient screen__ambient--left" />
          <div className="screen__ambient screen__ambient--right" />

          <div className="topbar topbar--light">
            <button type="button" className="icon-button" aria-label="Menu">
              <IonIcon icon={menuOutline} />
            </button>

            <div className="brand-lockup">
              <div className="brand-copy">
                <span className="brand-copy__eyebrow">{copy.eyebrow}</span>
                <strong>AR Learn</strong>
              </div>
            </div>

            <ProfileShortcut
              label={copy.profile}
              onClick={() => history.push("/tabs/progress")}
            />
          </div>

          <section className="spotlight-card">
            <div>
              <h1>{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </div>

            <button
              type="button"
              className="pill-action"
              onClick={() => history.push("/viewer/human-heart")}
            >
              {copy.openDemo}
              <IonIcon icon={arrowForward} />
            </button>
          </section>

          <div className="section-head">
            <div>
              <span className="section-head__eyebrow">{copy.explore}</span>
              <h2>{copy.subjects}</h2>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={() => history.push("/tabs/library")}
            >
              {copy.viewAll}
            </button>
          </div>

          <div className="subject-grid">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                type="button"
                className="subject-card"
                onClick={() => history.push(`/tabs/library?subject=${subject.id}`)}
                style={{
                  backgroundImage: `url(${subjectImageMap[subject.id]})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="subject-card__overlay">
                  <span className="subject-card__title">
                    {getSubjectCopy(subject.id, settings.language).name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="section-head">
            <div>
              <span className="section-head__eyebrow">{copy.featured}</span>
              <h2>{copy.featuredTitle}</h2>
            </div>
          </div>

          <div
            className={`featured-strip ${isDragging ? "featured-strip--dragging" : ""}`}
            ref={featuredStripRef}
            onPointerDown={handleStripPointerDown}
            onPointerMove={handleStripPointerMove}
            onPointerUp={stopStripDragging}
            onPointerCancel={stopStripDragging}
            onPointerLeave={stopStripDragging}
            onWheel={handleStripWheel}
          >
            {featuredExperiences.map((experience) => {
              const localizedExperience =
                getExperienceCopy(experience.id, settings.language) ?? experience;

              return (
                <article
                  key={experience.id}
                  className="featured-card featured-card--photo"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(8, 15, 27, 0.08) 0%, rgba(8, 15, 27, 0.72) 100%), url(${experience.image})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <button
                    type="button"
                    className="featured-card__play"
                    aria-label={`${copy.openDemo} ${localizedExperience.title}`}
                    onClick={() => history.push(`/viewer/${experience.id}`)}
                  >
                    <IonIcon icon={playCircle} />
                  </button>
                  <div className="featured-card__copy">
                    <span>{localizedExperience.duration}</span>
                    <strong>{localizedExperience.title}</strong>
                    <p>{localizedExperience.teaser}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
