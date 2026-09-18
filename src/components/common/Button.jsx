// Reusable button. Variants: primary, secondary, ghost, danger, success.
const VARIANT_STYLES = {
  primary:
    "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-sm shadow-brand-600/20 hover:from-brand-700 hover:to-brand-800",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger: "bg-accent-100 text-accent-600 hover:bg-accent-100/80",
  success: "bg-success-100 text-success-600 hover:bg-success-100/80",
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
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97]",
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
