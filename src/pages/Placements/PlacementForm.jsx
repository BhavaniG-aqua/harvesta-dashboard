import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import FormField from "../../components/common/FormField";
import RichTextField from "../../components/common/RichTextField";
import Button from "../../components/common/Button";
import { usePlacementsContext } from "../../services/PlacementsContext";

const EMPTY_EVENT = {
  company: "",
  date: "",
  time: "",
  role: "",
  package: "",
  requirements: "",
  selectionProcess: "",
  whatToPrepare: "",
  notes: "",
};

// Shared create/edit form for a Placement event.
// If :eventId is present in the route, edits that event; otherwise creates.
function PlacementFormPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEvent, addEvent, updateEvent } = usePlacementsContext();

  const isEditing = Boolean(eventId);
  const existing = isEditing ? getEvent(eventId) : null;
  const [form, setForm] = useState(existing || EMPTY_EVENT);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.date) return;

    if (isEditing) {
      await updateEvent(eventId, form);
      navigate(`/placements/${eventId}`);
    } else {
      await addEvent(form);
      navigate("/placements");
    }
  }

  return (
    <div>
      <BackLink
        to={isEditing ? `/placements/${eventId}` : "/placements"}
        label="Back"
      />

      <h1 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
        {isEditing ? "Edit Placement Event" : "Add Placement Event"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField
          label="Company *"
          value={form.company}
          onChange={(e) => setField("company", e.target.value)}
          placeholder="e.g. Siemens"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Date *"
            type="date"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
            required
          />
          <FormField
            label="Time"
            value={form.time}
            onChange={(e) => setField("time", e.target.value)}
            placeholder="10:00 AM"
          />
        </div>
        <FormField
          label="Role"
          value={form.role}
          onChange={(e) => setField("role", e.target.value)}
          placeholder="e.g. Graduate Engineer Trainee"
        />
        <FormField
          label="Package / CTC"
          value={form.package}
          onChange={(e) => setField("package", e.target.value)}
          placeholder="e.g. 16 LPA"
        />
        <RichTextField
          label="Requirements"
          value={form.requirements}
          onChange={(html) => setField("requirements", html)}
          placeholder="e.g. EEE/EE, CGPA > 7.5"
        />
        <RichTextField
          label="Selection Process"
          value={form.selectionProcess}
          onChange={(html) => setField("selectionProcess", html)}
          placeholder="e.g. Online Test -> GD -> Technical Interview -> HR"
        />
        <RichTextField
          label="What to Prepare"
          value={form.whatToPrepare}
          onChange={(html) => setField("whatToPrepare", html)}
          placeholder="e.g. Power Systems, Electrical Machines"
        />
        <RichTextField
          label="Additional Notes"
          value={form.notes}
          onChange={(html) => setField("notes", html)}
          placeholder="Anything else worth remembering"
        />

        <Button type="submit" className="mt-2 self-start">
          {isEditing ? "✨ Save Changes" : "+ Add Event"}
        </Button>
      </form>
    </div>
  );
}

export default PlacementFormPage;
