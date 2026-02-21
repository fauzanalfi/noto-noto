import { useState, useEffect, useRef, useMemo } from 'react';
import { Search } from 'lucide-react';
import { formatDate } from '../utils';

export default function QuickSwitcher({ notes, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

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
      <div className="quick-switcher-backdrop" onClick={onClose} />
      <div className="quick-switcher" onKeyDown={handleKeyDown}>
        <div className="quick-switcher-input-wrap">
          <Search size={16} />
          <input
            ref={inputRef}
            className="quick-switcher-input"
            value={query}
            onChange={handleQueryChange}
            placeholder="Jump to note..."
          />
        </div>
        <div className="quick-switcher-list">
          {filtered.length === 0 ? (
            <div className="quick-switcher-empty">No notes found</div>
          ) : (
            filtered.map((note, i) => (
              <button
                key={note.id}
                className={`quick-switcher-item ${i === selectedIdx ? 'active' : ''}`}
                onClick={() => onSelect(note.id)}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <span className="quick-switcher-title">{note.title || 'Untitled'}</span>
                <span className="quick-switcher-date">{formatDate(note.updatedAt)}</span>
              </button>
            ))
          )}
        </div>
        <div className="quick-switcher-hint">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>Esc close</span>
        </div>
      </div>
    </>
  );
}
