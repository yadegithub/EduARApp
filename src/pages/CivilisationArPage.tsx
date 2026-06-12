import AnatomyModelArPage from "./AnatomyModelArPage";
import civilisationIcon from "../test_civilisation/assets/civilisation_icon.jpg";

type CivilisationArPageProps = {
  experienceTitle: string;
  language: string;
  onBack: () => void;
  theme: string;
};

const CivilisationArPage: React.FC<CivilisationArPageProps> = ({
  experienceTitle,
  language,
  onBack,
  theme,
}) => (
  <AnatomyModelArPage
    experienceTitle={experienceTitle}
    language={language}
    onBack={onBack}
    theme={theme}
    experiencePath="test_civilisation"
    hintIcon={civilisationIcon}
    hintCopy={{
      en: {
        title: "Castle of Consuegra",
        description:
          "Explore a medieval Spanish castle in AR and tap numbered labels to study its defensive features.",
      },
      ar: {
        title: "\u0642\u0644\u0639\u0629 \u0643\u0648\u0646\u0633\u0648\u064a\u063a\u0631\u0627",
        description:
          "\u0627\u0633\u062a\u0643\u0634\u0641 \u0642\u0644\u0639\u0629 \u0625\u0633\u0628\u0627\u0646\u064a\u0629 \u0645\u0646 \u0627\u0644\u0639\u0635\u0648\u0631 \u0627\u0644\u0648\u0633\u0637\u0649 \u0641\u064a \u0627\u0644\u0648\u0627\u0642\u0639 \u0627\u0644\u0645\u0639\u0632\u0632 \u0648\u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0644\u062f\u0631\u0627\u0633\u0629 \u0639\u0646\u0627\u0635\u0631\u0647\u0627 \u0627\u0644\u062f\u0641\u0627\u0639\u064a\u0629.",
      },
      fr: {
        title: "Chateau de Consuegra",
        description:
          "Explorez un chateau espagnol medieval en realite augmentee et touchez les reperes numerotes pour etudier ses elements defensifs.",
      },
    }}
  />
);

export default CivilisationArPage;
