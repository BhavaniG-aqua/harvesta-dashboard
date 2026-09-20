import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { uploadToStorage, buildStoragePath } from "../utils/supabaseStorage";
import { getPreviewCategory } from "../utils/fileTypes";

function fromFolderRow(row) {
  return { id: row.id, name: row.name, parentFolderId: row.parent_folder_id };
}

function fromFileRow(row) {
  return {
    id: row.id,
    folderId: row.folder_id,
    name: row.name,
    type: row.type,
    size: row.size,
    url: row.storage_path, // already a public Storage URL
    createdAt: row.created_at?.slice(0, 10),
  };
}

// Supabase-backed hook for the Interview Preparation file/folder manager.
// Folder nesting is modeled via `parent_folder_id` self-reference; file
// content lives in the "interview-files" Storage bucket, with only its
// public URL + a bit of metadata stored in the `interview_files` table.
export function useInterviewFiles() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [{ data: folderRows, error: fErr }, { data: fileRows, error: fileErr }] =
      await Promise.all([
        supabase.from("interview_folders").select("*"),
        supabase.from("interview_files").select("*"),
      ]);
    if (fErr) console.error("Failed to load interview folders:", fErr);
    if (fileErr) console.error("Failed to load interview files:", fileErr);
    setFolders((folderRows || []).map(fromFolderRow));
    setFiles((fileRows || []).map(fromFileRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

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

  // Builds a readable Storage path prefix from a folder's full breadcrumb
  // (e.g. "Siemens/Previous Questions") instead of its raw UUID, so
  // browsing the Supabase Storage dashboard directly shows meaningful
  // names — matching the in-app folder hierarchy — rather than opaque ids.
  const getFolderPathPrefix = useCallback(
    (folderId) => getBreadcrumb(folderId).map((f) => f.name).join("/"),
    [getBreadcrumb]
  );

  const addFolder = useCallback(async (parentFolderId, name) => {
    const { data, error } = await supabase
      .from("interview_folders")
      .insert({ name, parent_folder_id: parentFolderId })
      .select()
      .single();
    if (error) {
      console.error("Failed to add folder:", error);
      return;
    }
    setFolders((prev) => [...prev, fromFolderRow(data)]);
  }, []);

  const renameFolder = useCallback(async (folderId, name) => {
    const { error } = await supabase
      .from("interview_folders")
      .update({ name })
      .eq("id", folderId);
    if (error) {
      console.error("Failed to rename folder:", error);
      return;
    }
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name } : f))
    );
  }, []);

  // Deletes a folder and, recursively, all of its descendant folders —
  // `on delete cascade` on `parent_folder_id` handles descendant folders
  // AND their files automatically at the database level.
  const deleteFolder = useCallback(async (folderId) => {
    const { error } = await supabase
      .from("interview_folders")
      .delete()
      .eq("id", folderId);
    if (error) {
      console.error("Failed to delete folder:", error);
      return;
    }
    await loadAll();
  }, [loadAll]);

  const addFile = useCallback(async (folderId, file) => {
    const type = getPreviewCategory(file.name);
    const size = `${Math.max(1, Math.round(file.size / 1024))} KB`;
    const path = buildStoragePath(getFolderPathPrefix(folderId), file.name);
    const publicUrl = await uploadToStorage("interview-files", path, file);

    const { data, error } = await supabase
      .from("interview_files")
      .insert({
        folder_id: folderId,
        name: file.name,
        type,
        size,
        storage_path: publicUrl,
      })
      .select()
      .single();
    if (error) {
      console.error("Failed to add file:", error);
      return;
    }
    setFiles((prev) => [...prev, fromFileRow(data)]);
  }, [getFolderPathPrefix]);

  const deleteFile = useCallback(async (fileId) => {
    const { error } = await supabase
      .from("interview_files")
      .delete()
      .eq("id", fileId);
    if (error) {
      console.error("Failed to delete file:", error);
      return;
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // Replaces a text-based file's content (used when editing .txt/.py
  // files in the FileViewer) — re-uploads to the same folder path and
  // updates the stored URL + size.
  const updateFileContent = useCallback(async (fileId, newText) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;
    const blob = new Blob([newText], { type: "text/plain" });
    const path = buildStoragePath(getFolderPathPrefix(file.folderId), file.name);
    const publicUrl = await uploadToStorage("interview-files", path, blob);
    const size = `${Math.max(1, Math.round(blob.size / 1024))} KB`;

    const { error } = await supabase
      .from("interview_files")
      .update({ storage_path: publicUrl, size })
      .eq("id", fileId);
    if (error) {
      console.error("Failed to update file content:", error);
      return;
    }
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, url: publicUrl, size } : f))
    );
  }, [files, getFolderPathPrefix]);

  return {
    folders,
    files,
    loading,
    getChildFolders,
    getFilesInFolder,
    getFolder,
    getBreadcrumb,
    getFolderPathPrefix,
    addFolder,
    renameFolder,
    deleteFolder,
    addFile,
    deleteFile,
    updateFileContent,
  };
}
