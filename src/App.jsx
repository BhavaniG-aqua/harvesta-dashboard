import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { ThemeProvider } from "./services/ThemeContext";
import { SettingsProvider } from "./services/SettingsContext";
import { PlacementsProvider } from "./services/PlacementsContext";
import { PreparationProvider } from "./services/PreparationContext";
import { InterviewFilesProvider } from "./services/InterviewFilesContext";
import { NotesProvider } from "./services/NotesContext";
import { HealthProvider } from "./services/HealthContext";
import { OneMoreThingProvider } from "./services/OneMoreThingContext";
import { LettersProvider } from "./services/LettersContext";

import DashboardPage from "./pages/Dashboard";
import PlacementsListPage from "./pages/Placements";
import PlacementDetailPage from "./pages/Placements/PlacementDetail";
import PlacementFormPage from "./pages/Placements/PlacementForm";
import PreparationCategoriesPage from "./pages/Preparation";
import PreparationCompaniesPage from "./pages/Preparation/Companies";
import InterviewFilesRootPage from "./pages/Preparation/InterviewFilesRoot";
import InterviewFolderDetailPage from "./pages/Preparation/InterviewFolderDetail";
import HealthPage from "./pages/Health";
import NotesListPage from "./pages/Notes";
import NoteEditorPage from "./pages/Notes/NoteEditor";
import OneMoreThingPage from "./pages/OneMoreThing";
import LettersPage from "./pages/Letters";
import SettingsPage from "./pages/Settings";
import HelpPage from "./pages/Help";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SettingsProvider>
          <PlacementsProvider>
            <PreparationProvider>
              <InterviewFilesProvider>
                <NotesProvider>
                  <OneMoreThingProvider>
                    <LettersProvider>
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

                            <Route path="preparation" element={<PreparationCategoriesPage />} />
                            <Route
                              path="preparation/companies"
                              element={<PreparationCompaniesPage />}
                            />
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

                            <Route path="one-more-thing" element={<OneMoreThingPage />} />

                            <Route path="letters" element={<LettersPage />} />

                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="help" element={<HelpPage />} />
                          </Route>
                        </Routes>
                      </HealthProvider>
                    </LettersProvider>
                  </OneMoreThingProvider>
                </NotesProvider>
              </InterviewFilesProvider>
            </PreparationProvider>
          </PlacementsProvider>
        </SettingsProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
