import { useEffect, useState } from "react";
import { getPreviewCategory } from "../../utils/fileTypes";

// Renders the actual preview content based on file category. Loads/parses
// content lazily (only when opened) since parsing docx/xlsx has a real
// cost. All parsing happens fully client-side, in the browser — no data
// ever leaves the device.
function usePreviewContent(file) {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, data: null });

    async function load() {
      if (!file?.url) {
        setState({ loading: false, error: "No file content available.", data: null });
        return;
      }

      const category = getPreviewCategory(file.name);

      try {
        if (category === "image" || category === "pdf") {
          // Rendered directly via <img>/<iframe> using the existing URL —
          // nothing to parse here.
          if (!cancelled) setState({ loading: false, error: null, data: file.url });
          return;
        }

        const response = await fetch(file.url);
        const blob = await response.blob();

        if (category === "text") {
          const text = await blob.text();
          if (!cancelled) setState({ loading: false, error: null, data: text });
        } else if (category === "word") {
          const mammoth = await import("mammoth");
          const arrayBuffer = await blob.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          if (!cancelled) setState({ loading: false, error: null, data: result.value });
        } else if (category === "sheet") {
          const XLSX = await import("xlsx");
          const arrayBuffer = await blob.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheets = workbook.SheetNames.map((sheetName) => ({
            name: sheetName,
            rows: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              header: 1,
              defval: "",
            }),
          }));
          if (!cancelled) setState({ loading: false, error: null, data: sheets });
        } else {
          if (!cancelled) {
            setState({
              loading: false,
              error: null,
              data: null,
            });
          }
        }
      } catch (err) {
        console.error("File preview failed:", err);
        if (!cancelled) {
          setState({
            loading: false,
            error: "Couldn't preview this file. Try downloading it instead.",
            data: null,
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [file]);

  return state;
}

function SheetTable({ sheets }) {
  const [activeSheet, setActiveSheet] = useState(0);
  const sheet = sheets[activeSheet];

  return (
    <div>
      {sheets.length > 1 ? (
        <div className="no-scrollbar mb-2 flex gap-1 overflow-x-auto border-b border-slate-200 pb-2">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setActiveSheet(i)}
              className={[
                "shrink-0 rounded-lg px-3 py-1 text-xs font-medium",
                i === activeSheet
                  ? "bg-brand-100 text-brand-700"
                  : "text-slate-500 hover:bg-slate-100",
              ].join(" ")}
            >
              {s.name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-xs">
          <tbody>
            {sheet.rows.map((row, i) => (
              <tr
                key={i}
                className={i === 0 ? "bg-slate-50 font-semibold" : "odd:bg-white even:bg-slate-50/40"}
              >
                {row.map((cell, j) => (
                  <td key={j} className="whitespace-nowrap border-b border-slate-100 px-3 py-1.5 text-slate-700">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FileViewerBody({ file }) {
  const category = getPreviewCategory(file.name);
  const { loading, error, data } = usePreviewContent(file);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Loading preview…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-1 text-center text-sm text-slate-400">
        <span className="text-2xl">⚠️</span>
        {error}
      </div>
    );
  }

  if (category === "image") {
    return (
      <img
        src={data}
        alt={file.name}
        className="mx-auto max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
      />
    );
  }

  if (category === "pdf") {
    return (
      <iframe
        title={file.name}
        src={data}
        className="h-[70vh] w-full rounded-xl border border-slate-200"
      />
    );
  }

  if (category === "text") {
    return (
      <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs text-slate-700">
        {data}
      </pre>
    );
  }

  if (category === "word") {
    return (
      <div
        className="doc-preview max-h-[70vh] max-w-none overflow-auto rounded-xl border border-slate-200 p-4 text-sm text-slate-700"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    );
  }

  if (category === "sheet") {
    return (
      <div className="max-h-[70vh] overflow-auto">
        <SheetTable sheets={data} />
      </div>
    );
  }

  // "unsupported" — e.g. PowerPoint. No good lightweight in-browser
  // renderer exists; offer a clear explanation + download instead.
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
      <span className="text-3xl">📁</span>
      <p>Preview isn't available for this file type yet.</p>
      <p className="text-xs text-slate-400">Download it to open in its own app.</p>
    </div>
  );
}

export default FileViewerBody;
