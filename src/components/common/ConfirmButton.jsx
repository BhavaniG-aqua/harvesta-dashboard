import { useState } from "react";
import Button from "./Button";

// Lightweight inline confirmation, avoids a full modal system.
// Renders the trigger button; on click, swaps to a Confirm/Cancel pair.
function ConfirmButton({ label = "🗑️ Delete", confirmLabel = "Confirm?", onConfirm, variant = "danger" }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant={variant} onClick={() => setConfirming(true)}>
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-slate-500">{confirmLabel}</span>
      <Button
        variant="danger"
        onClick={() => {
          onConfirm();
          setConfirming(false);
        }}
      >
        Yes
      </Button>
      <Button variant="ghost" onClick={() => setConfirming(false)}>
        No
      </Button>
    </span>
  );
}

export default ConfirmButton;
