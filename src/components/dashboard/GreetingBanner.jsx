import { getGreeting, formatFullDate } from "../../utils/date";

// Greeting banner shown at the top of the Dashboard. `light` renders it
// for use on a dark/colored background (the Dashboard header band).
function GreetingBanner({ name, light = false }) {
  const today = new Date();

  return (
    <div>
      <p
        className={[
          "text-2xl font-bold tracking-tight md:text-3xl",
          light ? "text-white" : "text-slate-900 dark:text-slate-100",
        ].join(" ")}
      >
        {getGreeting(today)}
        {name ? `, ${name}` : ""} <span className="inline-block">👋</span>
      </p>
      <p
        className={[
          "mt-1 text-sm",
          light ? "text-white/80" : "text-slate-500 dark:text-slate-400",
        ].join(" ")}
      >
        {formatFullDate(today)}
      </p>
    </div>
  );
}

export default GreetingBanner;
