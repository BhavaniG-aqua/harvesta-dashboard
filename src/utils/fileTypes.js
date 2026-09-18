// Maps a file name/extension to a preview category, used by FileViewer
// to decide how to render a file (image, pdf, text/code, docx, sheet, or
// "unsupported" — download-only, e.g. PowerPoint).
const EXT_CATEGORY = {
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  pdf: "pdf",
  txt: "text",
  py: "text",
  csv: "sheet",
  doc: "word",
  docx: "word",
  xls: "sheet",
  xlsx: "sheet",
  ppt: "unsupported",
  pptx: "unsupported",
};

export function getFileExtension(name = "") {
  return name.split(".").pop()?.toLowerCase() || "";
}

export function getPreviewCategory(name) {
  const ext = getFileExtension(name);
  return EXT_CATEGORY[ext] || "unsupported";
}

// File-type icon used across FileRow / file pickers.
const EXT_ICON = {
  png: "🖼️",
  jpg: "🖼️",
  jpeg: "🖼️",
  gif: "🖼️",
  webp: "🖼️",
  svg: "🖼️",
  pdf: "📕",
  txt: "📄",
  py: "🐍",
  csv: "📊",
  doc: "📘",
  docx: "📘",
  xls: "📗",
  xlsx: "📗",
  ppt: "📙",
  pptx: "📙",
};

export function getFileIcon(name) {
  const ext = getFileExtension(name);
  return EXT_ICON[ext] || "📄";
}
