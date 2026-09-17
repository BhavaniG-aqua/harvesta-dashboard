import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";

// Add form for a new inspiration item. Type toggle switches between
// "Motivation" (quote + author) and "Funny" (plain text).
function AddInspirationForm({ onSubmit }) {
  const [type, setType] = useState("motivation");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (type === "motivation") {
      if (!quote.trim()) return;
      onSubmit({ type, quote: quote.trim(), author: author.trim() });
      setQuote("");
      setAuthor("");
    } else {
      if (!text.trim()) return;
      onSubmit({ type, text: text.trim() });
      setText("");
    }
  }

  return (
    <Card>
      <div className="mb-3 flex gap-2">
        <Button
          variant={type === "motivation" ? "primary" : "secondary"}
          onClick={() => setType("motivation")}
        >
          ✨ Motivation
        </Button>
        <Button
          variant={type === "funny" ? "primary" : "secondary"}
          onClick={() => setType("funny")}
        >
          😄 Funny
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {type === "motivation" ? (
          <>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Quote or short inspirational text..."
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author (optional)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Something funny..."
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        )}
        <Button type="submit" className="self-start">
          + Add
        </Button>
      </form>
    </Card>
  );
}

export default AddInspirationForm;
