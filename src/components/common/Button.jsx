// Reusable button. Variants: primary, secondary, ghost, danger.
const VARIANT_STYLES = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors active:scale-[0.98]",
        VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
