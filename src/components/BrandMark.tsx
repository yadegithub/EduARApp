import brandLogo from "../assets/images/eduar-logo.png";

interface BrandMarkProps {
  className?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({ className = "" }) => {
  const classes = ["brand-mark", className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-hidden="true">
      <img
        src={brandLogo}
        alt=""
        className="brand-mark__image"
        decoding="async"
      />
    </span>
  );
};

export default BrandMark;
