import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, FileText, Sparkles } from 'lucide-react';
import { formatDate } from '../utils';

export default function QuickSwitcher({ notes, notebooks = [], onSelect, onClose, onCreateNote }) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  const notebookNameById = useMemo(
    () => Object.fromEntries(notebooks.map((nb) => [nb.id, nb.name])),
    [notebooks],
  );

  const filtered = useMemo(() => {
    const base = notes.filter((n) => !n.trashed);
    if (!query.trim()) return base.slice(0, 8);
    const q = query.toLowerCase();
    return base
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [notes, query]);

  const sectionLabel = query.trim() ? 'Results' : 'Recent';

  const shortcuts = [
    {
      id: 'new-note',
      label: 'Create new note',
      hint: 'Ctrl+N',
      onRun: () => {
        onCreateNote?.();
        onClose();
      },
    },
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setSelectedIdx(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && filtered[selectedIdx]) {
      onSelect(filtered[selectedIdx].id);
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      <div className="quick-switcher-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="quick-switcher" onKeyDown={handleKeyDown} role="dialog" aria-label="Quick note switcher">
        <div className="quick-switcher-topbar">
          <span>All Notes</span>
          <span className="quick-switcher-kbd">ESC</span>
        </div>

        <div className="quick-switcher-input-wrap">
          <Search size={16} aria-hidden="true" />
          <input
            ref={inputRef}
            className="quick-switcher-input"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search notes, commands..."
            aria-label="Search notes"
          />
        </div>

        <div className="quick-switcher-section-title">{sectionLabel}</div>
        <div className="quick-switcher-list" role="listbox">
          {filtered.length === 0 ? (
            <div className="quick-switcher-empty" role="status">No notes found</div>
          ) : (
            filtered.map((note, i) => (
              <button
                key={note.id}
                className={`quick-switcher-item ${i === selectedIdx ? 'active' : ''}`}
                onClick={() => onSelect(note.id)}
                onMouseEnter={() => setSelectedIdx(i)}
                role="option"
                aria-selected={i === selectedIdx}
              >
                <div className="quick-switcher-item-main">
                  <span className="quick-switcher-item-icon">
                    <FileText size={13} aria-hidden="true" />
                  </span>
                  <div className="quick-switcher-item-texts">
                    <span className="quick-switcher-title">{note.title || 'Untitled'}</span>
                    <span className="quick-switcher-subtitle">
                      Last edited {formatDate(note.updatedAt)}
                      {note.notebookId && notebookNameById[note.notebookId]
                        ? ` in ${notebookNameById[note.notebookId]}`
                        : ''}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="quick-switcher-section-title">Shortcuts</div>
        <div className="quick-switcher-shortcuts">
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.id}
              className="quick-switcher-shortcut"
              onClick={shortcut.onRun}
              type="button"
            >
              <span className="quick-switcher-shortcut-main">
                <Sparkles size={13} aria-hidden="true" />
                <span>{shortcut.label}</span>
              </span>
              <span className="quick-switcher-shortcut-hint">{shortcut.hint}</span>
            </button>
          ))}
        </div>

        <div className="quick-switcher-hint" aria-hidden="true">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>Esc close</span>
        </div>
      </div>
    </>
  );
}
