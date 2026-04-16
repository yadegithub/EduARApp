import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

interface ProfileShortcutProps {
  dark?: boolean;
  label: string;
  onClick?: () => void;
}

const ProfileShortcut: React.FC<ProfileShortcutProps> = ({
  dark = false,
  label,
  onClick,
}) => {
  const className = `icon-button icon-button--profile${
    dark ? " icon-button--dark" : ""
  }`;

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        aria-label={label}
        onClick={onClick}
      >
        <IonIcon icon={personCircleOutline} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className={className} role="img" aria-label={label}>
      <IonIcon icon={personCircleOutline} aria-hidden="true" />
    </div>
  );
};

export default ProfileShortcut;
