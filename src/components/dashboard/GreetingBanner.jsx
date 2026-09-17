import { getGreeting, formatFullDate } from "../../utils/date";

// Greeting banner shown at the top of the Dashboard.
function GreetingBanner({ name }) {
  const today = new Date();

  return (
    <div>
      <p className="text-lg font-semibold text-slate-900 md:text-xl">
        {getGreeting(today)}
        {name ? `, ${name}` : ""} 👋
      </p>
      <p className="text-sm text-slate-500">{formatFullDate(today)}</p>
    </div>
  );
}

export default GreetingBanner;
