interface BrandMarkProps {
  className?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({ className = "" }) => {
  const classes = ["brand-mark", className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-hidden="true">
      <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <path
          className="brand-mark__frame"
          d="M24 46V29C24 18.507 32.507 10 43 10H59C69.493 10 78 18.507 78 29V46"
        />
        <path className="brand-mark__glyph" d="M18 71L40 39L56 62" />
        <path className="brand-mark__glyph" d="M30 54H49" />
        <path
          className="brand-mark__glyph"
          d="M54 50H63C69.075 50 74 54.925 74 61C74 67.075 69.075 72 63 72H56L74 86"
        />
        <circle className="brand-mark__accent" cx="72" cy="16" r="4.5" />
      </svg>
    </span>
  );
};

export default BrandMark;
