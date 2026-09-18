import { getGreeting, formatFullDate } from "../../utils/date";

// Greeting banner shown at the top of the Dashboard.
function GreetingBanner({ name }) {
  const today = new Date();

  return (
    <div>
      <p className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">
        {getGreeting(today)}
        {name ? `, ${name}` : ""} <span className="inline-block">👋</span>
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatFullDate(today)}</p>
    </div>
  );
}

export default GreetingBanner;
