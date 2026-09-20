import { useState } from "react";
import BackLink from "../../components/common/BackLink";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";

// One collapsible section per app area, so the guide stays scannable
// instead of one giant wall of text.
function GuideSection({ icon, title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="bg-white dark:bg-slate-800" padded={false}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</span>
        </span>
        <span className="text-slate-400 dark:text-slate-500">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="border-t border-slate-100 px-4 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {children}
        </div>
      ) : null}
    </Card>
  );
}

function Steps({ items }) {
  return (
    <ol className="ml-4 list-decimal space-y-1.5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}

// A neat, structured user guide covering exactly what each feature does
// and how to use it — written for the person using the app, not for a
// developer, so it only explains what to tap and what happens next.
function HelpPage() {
  return (
    <div>
      <BackLink to="/settings" label="Back to Settings" />
      <PageHeader title="User Guide" subtitle="How to use every part of this website" />

      <div className="flex flex-col gap-3">
        <GuideSection icon="🏠" title="Dashboard" defaultOpen>
          <p className="mb-2">Your at-a-glance home screen.</p>
          <Steps
            items={[
              "See a greeting, today's date, and your Permanent Reminder if you've added one.",
              "\"Next Event\" shows your closest upcoming placement company.",
              "\"Health Summary\" shows this month's habits at a glance.",
              "\"Upcoming Events\" shows a few more events coming up — open Placements to see all of them.",
              "\"One More Thing\" shows a small quote or image for today.",
            ]}
          />
        </GuideSection>

        <GuideSection icon="💼" title="Placements">
          <p className="mb-2">Track which companies are coming, and what to prepare for each.</p>
          <Steps
            items={[
              "Tap \"+ New\" to add a company: date, time, role, package, requirements, and what to prepare.",
              "Tap any company to see its full details, or switch to the calendar view to see everything by date.",
              "Open an event to edit or delete it.",
            ]}
          />
        </GuideSection>

        <GuideSection icon="🎯" title="Preparation">
          <p className="mb-2">
            Track topics you need to study, organized two ways — by Category and by Company —
            plus a file manager for interview documents.
          </p>
          <p className="mb-1 font-medium text-slate-700 dark:text-slate-200">📂 Categories tab</p>
          <Steps
            items={[
              "Add a category (e.g. \"Power Systems\") with \"+ Category\".",
              "Add a topic with \"+ Topic\": type its name, then pick a category or type a new one. Leave it blank and it goes into \"Others\".",
              "You can also tag the topic with one or more companies at the same time.",
              "Each topic shows its name and three status buttons — New, Done, Revise — tap one to update it.",
              "Tap a category's arrow to show or hide its topics; double-tap the category name to rename it.",
              "Tap a topic's name to rename it, or the trash icon to remove it.",
              "Use the New/Completed/Revise filters at the top to narrow the list — you can select more than one at once.",
            ]}
          />
          <p className="mb-1 mt-3 font-medium text-slate-700 dark:text-slate-200">🏢 Companies tab</p>
          <Steps
            items={[
              "Same idea, but grouped by company instead of category.",
              "Add a company with \"+ Company\", then tag topics to it the same way.",
              "A topic tagged with two companies shows up under both.",
            ]}
          />
          <p className="mb-1 mt-3 font-medium text-slate-700 dark:text-slate-200">🗂️ Interview Files tab</p>
          <Steps
            items={[
              "Create folders (e.g. one per company) and subfolders inside them.",
              "Upload files: images, PDFs, Word, Excel, PowerPoint, and text files.",
              "Tap a file to open it full-screen. Most files open right in the browser; PowerPoint files can only be downloaded.",
              "Rename or delete folders and files anytime.",
            ]}
          />
        </GuideSection>

        <GuideSection icon="❤️" title="Health">
          <Steps
            items={[
              "On \"Today\", mark whether you ate fruits/nuts, pick your meal count, and enter sleep hours, then tap Save.",
              "You can also fill in yesterday's log using the day selector.",
              "The \"History\" tab shows a full month's summary plus every day you've logged — switch months with the picker at the top.",
            ]}
          />
        </GuideSection>

        <GuideSection icon="📝" title="Notes">
          <Steps
            items={[
              "Tap \"+ New Note\" to start writing — it works like a simple notepad.",
              "Use the toolbar above the note to bold/italic text or change its size and color.",
              "\"Insert Image\" drops a picture right into your text.",
              "\"Attach File\" adds a separate downloadable file below your note.",
              "Save, download, or delete your note from the buttons at the top.",
              "Use the search bar on the Notes list to find any note quickly.",
            ]}
          />
        </GuideSection>

        <GuideSection icon="🪶" title="Letters">
          <p className="mb-2">
            A private, day-wise personal journal — just for you, protected by its own passcode.
          </p>
          <Steps
            items={[
              "The first time you open Letters, choose a 6-digit passcode.",
              "From then on, entering that passcode unlocks it each time you visit.",
              "Tap \"Write today's letter\" to start writing — one letter per day.",
              "Tap any past letter in the list to read or edit it.",
              "Leaving the Letters tab automatically locks it again, so you never have to remember to lock it yourself.",
              "You can change your passcode anytime from Settings.",
            ]}
          />
        </GuideSection>

        <GuideSection icon="🌿" title="One More Thing">
          <p>
            A quiet little space with a single quote or image shown each day, plus one favorite
            image that's always the same. Just something small to see — nothing to track here.
          </p>
        </GuideSection>

        <GuideSection icon="⚙️" title="Settings">
          <Steps
            items={[
              "Tap \"Edit\" on your Profile to add your photo, name, birthday, a short bio, your current goal, and a Permanent Reminder (which also shows on your Dashboard).",
              "Name and birthday are the only required fields — everything else is optional.",
              "Switch between light and dark mode using the toggle next to the page title.",
              "Change your Letters passcode anytime by entering your current one, then a new one.",
              "Tap the User Guide button anytime you need a refresher on how something works.",
            ]}
          />
        </GuideSection>
      </div>
    </div>
  );
}

export default HelpPage;
