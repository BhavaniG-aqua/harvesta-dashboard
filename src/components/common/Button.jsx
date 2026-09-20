// Reusable button. Variants: primary, secondary, ghost, danger, success.
const VARIANT_STYLES = {
  primary:
    "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-sm shadow-brand-600/20 hover:from-brand-700 hover:to-brand-800",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  danger:
    "bg-slate-100 text-red-500 hover:bg-red-50 hover:text-red-600 dark:bg-slate-700/70 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300",
  success: "bg-success-100 text-success-600 hover:bg-success-100/80 dark:bg-success-600/20 dark:text-success-500 dark:hover:bg-success-600/30",
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
