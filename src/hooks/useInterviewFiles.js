import { useState, useCallback } from "react";
import { interviewFoldersMock, interviewFilesMock } from "../data/mockData";

// Local state hook for the Interview Preparation file/folder manager.
// Mirrors the future `interview_folders` / `interview_files` tables
// (folder.parent_folder_id supports arbitrary nesting).
export function useInterviewFiles() {
  const [folders, setFolders] = useState(interviewFoldersMock);
  const [files, setFiles] = useState(interviewFilesMock);

  const getChildFolders = useCallback(
    (parentFolderId) =>
      folders.filter((f) => f.parentFolderId === parentFolderId),
    [folders]
  );

  const getFilesInFolder = useCallback(
    (folderId) => files.filter((f) => f.folderId === folderId),
    [files]
  );

  const getFolder = useCallback(
    (folderId) => folders.find((f) => f.id === folderId) || null,
    [folders]
  );

  // Returns [{ id, name }] from root to the given folder (inclusive).
  const getBreadcrumb = useCallback(
    (folderId) => {
      const trail = [];
      let current = folders.find((f) => f.id === folderId) || null;
      while (current) {
        trail.unshift({ id: current.id, name: current.name });
        current = folders.find((f) => f.id === current.parentFolderId) || null;
      }
      return trail;
    },
    [folders]
  );

  const addFolder = useCallback((parentFolderId, name) => {
    setFolders((prev) => [
      ...prev,
      { id: `fol-${Date.now()}`, name, parentFolderId },
    ]);
  }, []);

  const renameFolder = useCallback((folderId, name) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name } : f))
    );
  }, []);

  // Deletes a folder and, recursively, all of its descendant folders/files.
  const deleteFolder = useCallback((folderId) => {
    setFolders((prevFolders) => {
      const idsToDelete = new Set([folderId]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const f of prevFolders) {
          if (idsToDelete.has(f.parentFolderId) && !idsToDelete.has(f.id)) {
            idsToDelete.add(f.id);
            changed = true;
          }
        }
      }
      setFiles((prevFiles) =>
        prevFiles.filter((file) => !idsToDelete.has(file.folderId))
      );
      return prevFolders.filter((f) => !idsToDelete.has(f.id));
    });
  }, []);

  const addFile = useCallback((folderId, file) => {
    setFiles((prev) => [
      ...prev,
      {
        id: `file-${Date.now()}`,
        folderId,
        name: file.name,
        type: file.type || "file",
        size: file.size || "",
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  }, []);

  const deleteFile = useCallback((fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  return {
    folders,
    files,
    getChildFolders,
    getFilesInFolder,
    getFolder,
    getBreadcrumb,
    addFolder,
    renameFolder,
    deleteFolder,
    addFile,
    deleteFile,
  };
}
