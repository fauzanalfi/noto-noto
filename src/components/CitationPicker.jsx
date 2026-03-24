import { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Plus, Check } from 'lucide-react';
import { useNotesContext } from '../context/NotesContext';
import {
  formatCitation,
  formatInTextCitation,
  shortLabel,
  CITATION_STYLES,
} from '../utils/citations';

/**
 * Modal for picking a reference and inserting a formatted citation
 * into the active note's editor.
 *
 * Props:
 *   onInsert(text: string)  — called with the citation text to insert
 *   onClose()               — called to dismiss the modal
 */
export default function CitationPicker({ onInsert, onClose }) {
  const { references } = useNotesContext();

  const [query, setQuery] = useState('');
  const [style, setStyle] = useState('apa');
  const [mode, setMode] = useState('intext'); // 'intext' | 'full'
  const [page, setPage] = useState('');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const searchRef = useRef(null);

  // Auto-focus search input
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Keyboard: Escape → close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Filter references
  const filtered = (() => {
    if (!query.trim()) return references;
    const q = query.toLowerCase();
    return references.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        (r.authors || []).some((a) => a.toLowerCase().includes(q)) ||
        r.year?.includes(q) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  })();

  const citationText = selected
    ? mode === 'intext'
      ? formatInTextCitation(selected, page, style, references.indexOf(selected) + 1)
      : formatCitation(selected, style, references.indexOf(selected) + 1).replace(/\*/g, '')
    : '';

  const handleInsert = () => {
    if (!citationText) return;
    onInsert(citationText);
    onClose();
  };

  const handleCopy = async () => {
    if (!citationText) return;
    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Insert Citation"
    >
      <div className="citation-picker" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="citation-picker-header">
          <BookOpen size={16} aria-hidden="true" />
          <h2>Insert Citation</h2>
          <button
            className="toolbar-btn"
            onClick={onClose}
            aria-label="Close"
            style={{ marginLeft: 'auto' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Options row */}
        <div className="citation-picker-options">
          {/* Style selector */}
          <div className="citation-picker-option-group">
            <span className="citation-picker-option-label">Style</span>
            <div className="citation-style-tabs" role="group" aria-label="Citation style">
              {CITATION_STYLES.map((s) => (
                <button
                  key={s.id}
                  className={`citation-style-tab ${style === s.id ? 'active' : ''}`}
                  onClick={() => setStyle(s.id)}
                  aria-pressed={style === s.id}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="citation-picker-option-group">
            <span className="citation-picker-option-label">Format</span>
            <div className="citation-style-tabs" role="group" aria-label="Citation format">
              <button
                className={`citation-style-tab ${mode === 'intext' ? 'active' : ''}`}
                onClick={() => setMode('intext')}
                aria-pressed={mode === 'intext'}
              >
                In-text
              </button>
              <button
                className={`citation-style-tab ${mode === 'full' ? 'active' : ''}`}
                onClick={() => setMode('full')}
                aria-pressed={mode === 'full'}
              >
                Full
              </button>
            </div>
          </div>

          {/* Page (only in-text) */}
          {mode === 'intext' && style !== 'ieee' && (
            <div className="citation-picker-option-group">
              <span className="citation-picker-option-label">Page</span>
              <input
                className="citation-page-input"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                placeholder="42"
                aria-label="Page number for in-text citation"
              />
            </div>
          )}
        </div>

        {/* Search */}
        <label className="ref-search-box" aria-label="Search references">
          <Search size={14} className="icon" aria-hidden="true" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search references by title, author, year…"
          />
          {query && (
            <button
              className="ref-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </label>

        {/* Reference list */}
        <ul
          className="citation-picker-list"
          role="listbox"
          aria-label="References"
        >
          {references.length === 0 && (
            <li className="ref-list-empty">
              No references in your library yet. Add some in the References view.
            </li>
          )}
          {references.length > 0 && filtered.length === 0 && (
            <li className="ref-list-empty">No matches found.</li>
          )}
          {filtered.map((r) => (
            <li
              key={r.id}
              role="option"
              aria-selected={selected?.id === r.id}
              className={`citation-picker-item ${selected?.id === r.id ? 'active' : ''}`}
              onClick={() => setSelected(r)}
            >
              <div className="citation-picker-item-main">
                <span className="ref-list-item-title">{r.title || 'Untitled'}</span>
                <span className="ref-list-item-meta">{shortLabel(r)}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Preview */}
        {selected && (
          <div className="citation-picker-preview">
            <p className="citation-preview-label">Preview</p>
            <p className="citation-preview-text">{citationText}</p>
          </div>
        )}

        {/* Actions */}
        <div className="citation-picker-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn"
            onClick={handleCopy}
            disabled={!selected}
            title="Copy to clipboard"
            aria-label="Copy citation to clipboard"
          >
            {copied ? <Check size={14} /> : null}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleInsert}
            disabled={!selected}
            aria-label="Insert citation into note"
          >
            <Plus size={14} />
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}
