import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import FolderBreadcrumb from "../../components/files/FolderBreadcrumb";
import FolderCard from "../../components/files/FolderCard";
import FileRow from "../../components/files/FileRow";
import InlineAddForm from "../../components/common/InlineAddForm";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import { useInterviewFilesContext } from "../../services/InterviewFilesContext";

function InterviewFolderDetailPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    getFolder,
    getChildFolders,
    getFilesInFolder,
    getBreadcrumb,
    addFolder,
    addFile,
    deleteFolder,
    deleteFile,
  } = useInterviewFilesContext();

  const folder = getFolder(folderId);
  const childFolders = getChildFolders(folderId);
  const filesHere = getFilesInFolder(folderId);
  const trail = getBreadcrumb(folderId);

  if (!folder) {
    return (
      <div>
        <BackLink to="/preparation/files" label="Back" />
        <EmptyState icon="🔍" title="Folder not found" />
      </div>
    );
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const type =
      ext === "pdf" ? "pdf" : ["png", "jpg", "jpeg"].includes(ext) ? "image" : "doc";
    addFile(folderId, {
      name: file.name,
      type,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    });
    e.target.value = "";
  }

  function handleDeleteFolder() {
    deleteFolder(folder.id);
    navigate("/preparation/files");
  }

  return (
    <div>
      <FolderBreadcrumb trail={trail} />

      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold text-slate-900">{folder.name}</h1>
        <button
          type="button"
          onClick={handleDeleteFolder}
          className="text-xs font-medium text-red-500 hover:underline"
        >
          Delete folder
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <InlineAddForm
          placeholder="New subfolder name"
          buttonLabel="+ Subfolder"
          onSubmit={(name) => addFolder(folderId, name)}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelected}
        />
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          ⬆️ Upload File
        </Button>
      </div>

      {childFolders.length > 0 ? (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {childFolders.map((f) => (
            <FolderCard key={f.id} folder={f} onDelete={deleteFolder} />
          ))}
        </div>
      ) : null}

      {filesHere.length === 0 && childFolders.length === 0 ? (
        <EmptyState
          icon="📂"
          title="This folder is empty"
          description="Create a subfolder or upload a file."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filesHere.map((file) => (
            <FileRow key={file.id} file={file} onDelete={deleteFile} />
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewFolderDetailPage;
