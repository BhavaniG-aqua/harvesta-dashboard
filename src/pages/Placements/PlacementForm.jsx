import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import FormField from "../../components/common/FormField";
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.date) return;

    if (isEditing) {
      updateEvent(eventId, form);
      navigate(`/placements/${eventId}`);
    } else {
      const id = addEvent(form);
      navigate(`/placements/${id}`);
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
        <FormField
          label="Requirements"
          as="textarea"
          rows={2}
          value={form.requirements}
          onChange={(e) => setField("requirements", e.target.value)}
        />
        <FormField
          label="Selection Process"
          as="textarea"
          rows={2}
          value={form.selectionProcess}
          onChange={(e) => setField("selectionProcess", e.target.value)}
        />
        <FormField
          label="What to Prepare"
          as="textarea"
          rows={2}
          value={form.whatToPrepare}
          onChange={(e) => setField("whatToPrepare", e.target.value)}
        />
        <FormField
          label="Additional Notes"
          as="textarea"
          rows={2}
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />

        <Button type="submit" className="mt-2 self-start">
          {isEditing ? "💾 Save Changes" : "+ Add Event"}
        </Button>
      </form>
    </div>
  );
}

export default PlacementFormPage;
