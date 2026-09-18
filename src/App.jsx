import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { ThemeProvider } from "./services/ThemeContext";
import { SettingsProvider } from "./services/SettingsContext";
import { PlacementsProvider } from "./services/PlacementsContext";
import { InterviewFilesProvider } from "./services/InterviewFilesContext";
import { NotesProvider } from "./services/NotesContext";
import { HealthProvider } from "./services/HealthContext";
import { InspirationProvider } from "./services/InspirationContext";

import DashboardPage from "./pages/Dashboard";
import PlacementsListPage from "./pages/Placements";
import PlacementDetailPage from "./pages/Placements/PlacementDetail";
import PlacementFormPage from "./pages/Placements/PlacementForm";
import PreparationTopicsPage from "./pages/Preparation";
import InterviewFilesRootPage from "./pages/Preparation/InterviewFilesRoot";
import InterviewFolderDetailPage from "./pages/Preparation/InterviewFolderDetail";
import HealthPage from "./pages/Health";
import NotesListPage from "./pages/Notes";
import NoteEditorPage from "./pages/Notes/NoteEditor";
import InspirationPage from "./pages/Inspiration";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SettingsProvider>
          <PlacementsProvider>
            <InterviewFilesProvider>
              <NotesProvider>
                <InspirationProvider>
                  <HealthProvider>
                    <Routes>
                      <Route element={<AppLayout />}>
                        <Route index element={<DashboardPage />} />

                        <Route path="placements" element={<PlacementsListPage />} />
                        <Route path="placements/new" element={<PlacementFormPage />} />
                        <Route
                          path="placements/:eventId"
                          element={<PlacementDetailPage />}
                        />
                        <Route
                          path="placements/:eventId/edit"
                          element={<PlacementFormPage />}
                        />

                        <Route path="preparation" element={<PreparationTopicsPage />} />
                        <Route
                          path="preparation/files"
                          element={<InterviewFilesRootPage />}
                        />
                        <Route
                          path="preparation/files/:folderId"
                          element={<InterviewFolderDetailPage />}
                        />

                        <Route path="health" element={<HealthPage />} />

                        <Route path="notes" element={<NotesListPage />} />
                        <Route path="notes/:noteId" element={<NoteEditorPage />} />

                        <Route path="inspiration" element={<InspirationPage />} />

                        <Route path="settings" element={<SettingsPage />} />
                      </Route>
                    </Routes>
                  </HealthProvider>
                </InspirationProvider>
              </NotesProvider>
            </InterviewFilesProvider>
          </PlacementsProvider>
        </SettingsProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
