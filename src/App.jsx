import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { InterviewFilesProvider } from "./services/InterviewFilesContext";
import { NotesProvider } from "./services/NotesContext";

import DashboardPage from "./pages/Dashboard";
import PlacementsListPage from "./pages/Placements";
import PlacementDetailPage from "./pages/Placements/PlacementDetail";
import PreparationTopicsPage from "./pages/Preparation";
import InterviewFilesRootPage from "./pages/Preparation/InterviewFilesRoot";
import InterviewFolderDetailPage from "./pages/Preparation/InterviewFolderDetail";
import HealthPage from "./pages/Health";
import NotesListPage from "./pages/Notes";
import NoteEditorPage from "./pages/Notes/NoteEditor";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <InterviewFilesProvider>
        <NotesProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />

              <Route path="placements" element={<PlacementsListPage />} />
              <Route path="placements/:eventId" element={<PlacementDetailPage />} />

              <Route path="preparation" element={<PreparationTopicsPage />} />
              <Route path="preparation/files" element={<InterviewFilesRootPage />} />
              <Route
                path="preparation/files/:folderId"
                element={<InterviewFolderDetailPage />}
              />

              <Route path="health" element={<HealthPage />} />

              <Route path="notes" element={<NotesListPage />} />
              <Route path="notes/:noteId" element={<NoteEditorPage />} />

              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </NotesProvider>
      </InterviewFilesProvider>
    </BrowserRouter>
  );
}

export default App;
