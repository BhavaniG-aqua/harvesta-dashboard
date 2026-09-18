import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionTitle from "../../components/common/SectionTitle";
import Button from "../../components/common/Button";
import HealthTabs from "../../components/health/HealthTabs";
import DaySelector from "../../components/health/DaySelector";
import ToggleCheck from "../../components/health/ToggleCheck";
import MealCountSelector from "../../components/health/MealCountSelector";
import SleepInput from "../../components/health/SleepInput";
import MonthYearPicker from "../../components/health/MonthYearPicker";
import MonthlyHistoryList from "../../components/health/MonthlyHistoryList";
import { useHealthContext } from "../../services/HealthContext";
import { todayStr, yesterdayStr } from "../../hooks/useHealthData";
import { formatShortDate } from "../../utils/date";

const EMPTY_LOG = { fruits: false, nuts: false, meals: 1, sleepHours: 0 };

function HealthPage() {
  const { getLogForDate, saveLogForDate, getLogsForMonth } =
    useHealthContext();

  const [tab, setTab] = useState("today");

  // --- "Today" tab state ---------------------------------------------
  const [selectedDay, setSelectedDay] = useState("today");
  const dateKey = selectedDay === "today" ? todayStr() : yesterdayStr();

  const [form, setForm] = useState(() => getLogForDate(dateKey) || EMPTY_LOG);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(getLogForDate(dateKey) || EMPTY_LOG);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  function setField(partial) {
    setForm((prev) => ({ ...prev, ...partial }));
    setSaved(false);
  }

  function handleSave() {
    saveLogForDate(dateKey, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // --- "History" tab state --------------------------------------------
  const now = new Date();
  const [historyYear, setHistoryYear] = useState(now.getFullYear());
  const [historyMonth, setHistoryMonth] = useState(now.getMonth());

  const monthlyLogs = useMemo(
    () => getLogsForMonth(historyYear, historyMonth),
    [getLogsForMonth, historyYear, historyMonth]
  );

  function handleMonthChange(year, month) {
    setHistoryYear(year);
    setHistoryMonth(month);
  }

  return (
    <div>
      <PageHeader title="Health" subtitle="Quick daily habit tracker" />

      <HealthTabs active={tab} onChange={setTab} />

      {tab === "today" ? (
        <div className="flex flex-col gap-3">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {formatShortDate(dateKey)}
            </p>
            <DaySelector selected={selectedDay} onChange={setSelectedDay} />
          </div>

          <div className="flex gap-3">
            <ToggleCheck
              label="Fruits"
              icon="🍎"
              checked={!!form.fruits}
              onChange={(v) => setField({ fruits: v })}
            />
            <ToggleCheck
              label="Nuts"
              icon="🥜"
              checked={!!form.nuts}
              onChange={(v) => setField({ nuts: v })}
            />
          </div>

          <MealCountSelector
            value={form.meals ?? 1}
            onChange={(v) => setField({ meals: v })}
          />

          <SleepInput
            value={form.sleepHours ?? 0}
            onChange={(v) => setField({ sleepHours: v })}
          />

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="self-start">
              💾 Save
            </Button>
            {saved ? (
              <span className="text-xs font-medium text-emerald-600">
                Saved ✓
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <MonthYearPicker
            year={historyYear}
            month={historyMonth}
            onChange={handleMonthChange}
          />
          <div>
            <SectionTitle>
              {monthlyLogs.length} {monthlyLogs.length === 1 ? "entry" : "entries"}
            </SectionTitle>
            <MonthlyHistoryList logs={monthlyLogs} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthPage;
