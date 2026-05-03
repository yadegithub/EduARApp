import { IonContent, IonPage } from "@ionic/react";
import { type MouseEvent, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardPhonePreview from "../components/DashboardPhonePreview";

const features = [
  {
    title: "Lecons en RA",
    description:
      "Projetez le contenu scientifique dans le monde reel pour apprendre dans un contexte vivant.",
  },
  {
    title: "Modeles 3D",
    description:
      "Observez des structures anatomiques detaillees sous tous les angles pour une meilleure comprehension spatiale.",
  },
  {
    title: "Guidage audio",
    description:
      "Ecoutez des explications guidees pendant l'exploration pour rendre l'apprentissage plus accessible.",
  },
  {
    title: "Interaction",
    description:
      "Touchez, faites pivoter et examinez chaque modele pour apprendre de facon active.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connexion",
    description: "Connectez-vous pour acceder a l'application, a votre progression et aux lecons disponibles.",
  },
  {
    number: "02",
    title: "Choisir une matiere",
    description: "Selectionnez un sujet comme la biologie ou l'anatomie dans la bibliotheque d'apprentissage.",
  },
  {
    number: "03",
    title: "Scanner le QR code",
    description: "Utilisez la camera de l'appareil pour scanner un QR code et ouvrir l'activite en realite augmentee.",
  },
  {
    number: "04",
    title: "Voir le modele 3D",
    description: "Ouvrez le modele interactif et explorez-le avec les controles tactiles et l'audio.",
  },
];

const storyLearningSteps = [
  {
    number: "01",
    title: "Apprendre a travers une histoire",
    description:
      "Chaque lecon se deroule comme une courte histoire pour relier les connaissances a une experience memorable.",
  },
  {
    number: "02",
    title: "Interagir pendant l'exploration",
    description:
      "Les eleves touchent, observent et repondent a des invites pendant l'histoire pour apprendre activement.",
  },
  {
    number: "03",
    title: "Realiser un exercice final",
    description:
      "L'activite finale aide l'eleve a explorer et exprimer ce qu'il a compris de l'histoire.",
  },
];

const subjects = [
  {
    title: "Science naturelle",
    description:
      "Decouvrez des modeles lies au corps humain, aux organes et aux systemes vivants dans un format immersif.",
  },
  {
    title: "Physique",
    description:
      "Explorez des modeles interactifs autour du mouvement, des forces, du magnetisme et d'autres notions physiques.",
  },
  {
    title: "Histoire",
    description:
      "Parcourez des scenes et des contenus immersifs pour mieux comprendre les civilisations et les epoques.",
  },
  {
    title: "Geographie",
    description:
      "Visualisez les cartes, les reliefs et les phenomenes de la Terre avec des modeles clairs et interactifs.",
  },
];

const LandingPage: React.FC = () => {
  const location = useLocation();
  const sectionHref = (sectionId: string) => `${location.pathname}#${sectionId}`;

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    window.history.replaceState({}, "", `${location.pathname}#${sectionId}`);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSectionLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    scrollToSection(sectionId);
  };

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.hash]);

  return (
    <IonPage>
      <IonContent fullscreen className="landing-page">
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
          <div className="pointer-events-none absolute left-0 top-24 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl animate-float-soft" />
          <div className="pointer-events-none absolute right-0 top-72 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl animate-float-soft" />

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <header className="sticky top-0 z-20 -mx-6 border-b border-slate-200/80 bg-slate-50/80 px-6 backdrop-blur lg:-mx-8 lg:px-8 animate-fade-in">
              <nav className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 py-4">
                <a
                  href={sectionHref("top")}
                  onClick={(event) => handleSectionLinkClick(event, "top")}
                  className="text-lg font-semibold tracking-tight text-slate-950 transition hover:text-slate-700"
                >
                  AR Learn
                </a>

                <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
                  <a
                    href={sectionHref("features")}
                    className="transition hover:text-slate-950"
                    onClick={(event) => handleSectionLinkClick(event, "features")}
                  >
                    Fonctionnalites
                  </a>
                  <a
                    href={sectionHref("how-it-works")}
                    className="transition hover:text-slate-950"
                    onClick={(event) => handleSectionLinkClick(event, "how-it-works")}
                  >
                    Comment ca marche
                  </a>
                  <a
                    href={sectionHref("story-learning")}
                    className="transition hover:text-slate-950"
                    onClick={(event) => handleSectionLinkClick(event, "story-learning")}
                  >
                    Apprentissage narratif
                  </a>
                  <a
                    href={sectionHref("demo")}
                    className="transition hover:text-slate-950"
                    onClick={(event) => handleSectionLinkClick(event, "demo")}
                  >
                    Demo
                  </a>
                  <a
                    href={sectionHref("subjects")}
                    className="transition hover:text-slate-950"
                    onClick={(event) => handleSectionLinkClick(event, "subjects")}
                  >
                    Sujets
                  </a>
                </div>

                <Link
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100"
                  to="/login"
                >
                  Se connecter
                </Link>
              </nav>
            </header>

            <main id="top" className="pb-16">
              <section className="grid gap-14 pb-12 pt-12 md:pb-16 md:pt-16 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div className="max-w-2xl animate-fade-up">
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
                    Plateforme educative en realite augmentee
                  </span>

                  <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    Rendez l'apprentissage mobile plus simple.
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    Une page claire, moderne et dynamique pour presenter une experience
                    d'apprentissage immersive, interactive et adaptee au mobile.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                      to="/register"
                    >
                      Commencer
                    </Link>
                    <Link
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100"
                      to="/login"
                    >
                      Se connecter
                    </Link>
                  </div>
                </div>

                <div
                  className="landing-phone-shell mx-auto w-full max-w-md animate-fade-up"
                  style={{ animationDelay: "120ms" }}
                >
                  <div className="landing-phone-device hover-lift">
                    <div className="landing-phone-notch" aria-hidden="true" />
                    <div
                      className="landing-phone-side landing-phone-side--top"
                      aria-hidden="true"
                    />
                    <div
                      className="landing-phone-side landing-phone-side--middle"
                      aria-hidden="true"
                    />
                    <div className="landing-phone-screen">
                      <div className="landing-phone-scroll">
                        <DashboardPhonePreview />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="features" className="scroll-mt-24 py-8 md:py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                      Fonctionnalites
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      Des outils penses pour un apprentissage scientifique immersif.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {features.map((feature, index) => (
                    <article
                      key={feature.title}
                      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm animate-fade-up hover-lift"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {feature.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="how-it-works" className="scroll-mt-24 py-8 md:py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                      Comment ca marche
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      Un parcours d'apprentissage en 4 etapes.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {steps.map((step, index) => (
                    <article
                      key={step.number}
                      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm animate-fade-up hover-lift"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <p className="text-sm font-medium text-slate-500">{step.number}</p>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="story-learning" className="scroll-mt-24 py-8 md:py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                      Apprentissage narratif interactif
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      Des lecons qui ressemblent a une aventure guidee.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm animate-fade-up hover-lift md:p-8">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      Apprentissage par l'histoire
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                      Les eleves apprennent a travers une histoire, pas seulement un ecran.
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      Au lieu d'entrer directement dans un modele, l'eleve avance dans une
                      histoire, decouvre des indices, interagit avec les scenes et construit
                      sa comprehension etape par etape. A la fin, il realise un exercice pour
                      explorer ce qu'il a retenu de l'histoire.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-500">Histoires</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          Des chapitres guides avec contexte et progression.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-500">Interaction</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          Des actions, reponses et decouvertes dans chaque lecon.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-500">Exercice</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          Une activite finale pour approfondir ce qui a ete compris.
                        </p>
                      </div>
                    </div>
                  </article>

                  <div className="grid gap-4">
                    {storyLearningSteps.map((step, index) => (
                      <article
                        key={step.number}
                        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm animate-fade-up hover-lift"
                        style={{ animationDelay: `${index * 100 + 120}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {step.number}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                              {step.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section id="subjects" className="scroll-mt-24 py-8 md:py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                      Sujets
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      Explorez les matieres disponibles dans l'application.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {subjects.map((subject, index) => (
                    <article
                      key={subject.title}
                      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm animate-fade-up hover-lift"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                        {subject.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {subject.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="demo" className="scroll-mt-24 py-8 md:py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                      Demo
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      Decouvrez l'experience avant de commencer.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm animate-fade-up hover-lift">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      Apercu video
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Utilisez cet espace pour presenter une courte video de demonstration de l'experience RA.
                    </p>
                    <div className="mt-6 flex h-64 items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-500 sm:h-72">
                      Emplacement video
                    </div>
                  </article>

                  <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm animate-fade-up hover-lift" style={{ animationDelay: "100ms" }}>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      Scanner le QR de demo
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Ajoutez ici un QR code pour ouvrir rapidement la demonstration sur mobile.
                    </p>

                    <div className="mt-6 flex justify-center">
                      <div className="flex h-48 w-48 items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-500">
                        Emplacement QR
                      </div>
                    </div>

                    <Link
                      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                      to="/login"
                    >
                      Essayer la demo
                    </Link>
                  </article>
                </div>
              </section>

            </main>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
