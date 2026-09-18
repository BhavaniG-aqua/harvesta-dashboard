import { useRef, useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";

// Add form for a new inspiration item. Type toggle switches between
// "Motivation" (quote + author), "Funny" (plain text), and "Image"
// (upload a picture — shown full-width, optionally with a caption).
function AddInspirationForm({ onSubmit }) {
  const [type, setType] = useState("motivation");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  function resetImage() {
    setImagePreview(null);
    setCaption("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handlePickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview({ url: URL.createObjectURL(file), name: file.name });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (type === "motivation") {
      if (!quote.trim()) return;
      onSubmit({ type, quote: quote.trim(), author: author.trim() });
      setQuote("");
      setAuthor("");
    } else if (type === "funny") {
      if (!text.trim()) return;
      onSubmit({ type, text: text.trim() });
      setText("");
    } else {
      if (!imagePreview) return;
      onSubmit({ type: "image", imageUrl: imagePreview.url, caption: caption.trim() });
      resetImage();
    }
  }

  return (
    <Card className="bg-white">
      <div className="mb-3 flex flex-wrap gap-2">
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
        <Button
          variant={type === "image" ? "primary" : "secondary"}
          onClick={() => setType("image")}
        >
          🖼️ Image
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
        ) : type === "funny" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Something funny..."
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        ) : (
          <>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickImage}
            />
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview.url}
                  alt={imagePreview.name}
                  className="h-40 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={resetImage}
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-accent-600 shadow ring-1 ring-slate-200"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => imageInputRef.current?.click()}
              >
                ⬆️ Choose Image
              </Button>
            )}
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </>
        )}
        <Button type="submit" className="self-start">
          + Add
        </Button>
      </form>
    </Card>
  );
}

export default AddInspirationForm;
