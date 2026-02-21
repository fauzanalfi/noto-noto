import { FileText, Feather } from 'lucide-react';

export default function EmptyState({ type = 'no-selection' }) {
  if (type === 'no-notes') {
    return (
      <div className="empty-state">
        <Feather className="empty-state-icon" size={80} />
        <h3>No notes yet</h3>
        <p>
          Create your first note by clicking the <strong>+</strong> button below.
        </p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <FileText className="empty-state-icon" size={80} />
      <h3>Select a note</h3>
      <p>
        Choose a note from the list to start editing, or create a new one.
      </p>
    </div>
  );
}
