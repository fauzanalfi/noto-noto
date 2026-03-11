import { NotesProvider } from "./context/NotesContext";
import { UIProvider } from "./context/UIContext";
import AppLayout from "./components/AppLayout";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <NotesProvider>
        <UIProvider>
          <AppLayout />
        </UIProvider>
      </NotesProvider>
    </ErrorBoundary>
  );
}
