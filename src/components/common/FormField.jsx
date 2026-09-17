// Labeled text input / textarea used across create/edit forms.
function FormField({ label, as = "input", className = "", ...rest }) {
  const Tag = as;
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <Tag
        className={[
          "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
          as === "textarea" ? "resize-none" : "",
          className,
        ].join(" ")}
        {...rest}
      />
    </label>
  );
}

export default FormField;
