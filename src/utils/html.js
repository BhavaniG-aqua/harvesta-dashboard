// Strips HTML tags for a plain-text preview snippet (note content is now
// rich HTML since images can be embedded inline, Word-style).
export function stripHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
