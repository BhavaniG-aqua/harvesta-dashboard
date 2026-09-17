import PageHeader from "../../components/common/PageHeader";
import PreparationTabs from "../../components/preparation/PreparationTabs";
import FolderCard from "../../components/files/FolderCard";
import InlineAddForm from "../../components/common/InlineAddForm";
import EmptyState from "../../components/common/EmptyState";
import { useInterviewFilesContext } from "../../services/InterviewFilesContext";

// Root of the Interview Preparation file manager (top-level folders only).
function InterviewFilesRootPage() {
  const { getChildFolders, addFolder, renameFolder, deleteFolder } =
    useInterviewFilesContext();

  const rootFolders = getChildFolders(null);

  return (
    <div>
      <PageHeader
        title="Preparation"
        subtitle="Organize interview prep files by company"
      />
      <PreparationTabs />

      <div className="mb-4">
        <InlineAddForm
          placeholder="New folder name"
          buttonLabel="+ New Folder"
          onSubmit={(name) => addFolder(null, name)}
        />
      </div>

      {rootFolders.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title="No folders yet"
          description="Create a folder for each company, e.g. 'Siemens'."
        />
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {rootFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onDelete={deleteFolder}
              onRename={renameFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewFilesRootPage;
