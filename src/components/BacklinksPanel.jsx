import { useState } from 'react';
import { Link2, ChevronDown, ChevronRight } from 'lucide-react';

/**
 * BacklinksPanel — shows which notes link to the current note.
 * Props:
 *   backlinks    {Array}    notes returned by getBacklinks(noteId)
 *   onNavigate   {Function} called with a note id when user clicks a backlink
 */
export default function BacklinksPanel({ backlinks = [], onNavigate }) {
  const [open, setOpen] = useState(true);

  if (backlinks.length === 0) {
    return (
      <div className="backlinks-panel backlinks-panel--empty">
        <div className="backlinks-panel__header" onClick={() => setOpen((v) => !v)}>
          <Link2 size={13} />
          <span>Linked references</span>
          <span className="backlinks-panel__count">0</span>
        </div>
        {open && (
          <p className="backlinks-panel__empty-msg">
            No other notes link here yet. Use <code>[[{'{note title}'}]]</code> in another note to create a link.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="backlinks-panel">
      <button
        className="backlinks-panel__header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Linked references — ${backlinks.length} note${backlinks.length !== 1 ? 's' : ''}`}
      >
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        <Link2 size={13} />
        <span>Linked references</span>
        <span className="backlinks-panel__count">{backlinks.length}</span>
      </button>

      {open && (
        <ul className="backlinks-panel__list" role="list">
          {backlinks.map((note) => {
            const snippet = note.content
              ? note.content.replace(/\s+/g, ' ').trim().slice(0, 120)
              : '';
            return (
              <li key={note.id} className="backlinks-panel__item">
                <button
                  className="backlinks-panel__item-title"
                  onClick={() => onNavigate && onNavigate(note.id)}
                  title={`Open "${note.title || 'Untitled'}"`}
                >
                  {note.title || 'Untitled'}
                </button>
                {snippet && (
                  <p className="backlinks-panel__item-snippet">
                    {snippet}
                    {note.content.length > 120 ? '…' : ''}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
