import { useState, useMemo, useCallback } from 'react';
import { X, Search, BookMarked, Plus, Check } from 'lucide-react';
import { useNotesContext } from '../context/NotesContext';
import { useUIContext } from '../context/UIContext';
import { CITATION_STYLES, REFERENCE_TYPES, formatCitation } from '../utils/citations';

/**
 * CitationPicker — Modal that lets users pick a reference from their library,
 * preview it in different citation styles, and insert it into the active note.
 */
export default function CitationPicker({ onInsert }) {
  const { references } = useNotesContext();
  const { setShowCitationPicker, setShowReferenceManager } = useUIContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [citationStyle, setCitationStyle] = useState('apa');
  const [inserted, setInserted] = useState(false);

  // ── Filter references ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return references;
    const q = searchQuery.toLowerCase();
    return references.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.authors?.some((a) => a.toLowerCase().includes(q)) ||
        r.journal?.toLowerCase().includes(q) ||
        r.year?.toString().includes(q),
    );
  }, [references, searchQuery]);

  const selectedRef = useMemo(
    () => references.find((r) => r.id === selectedId) ?? null,
    [references, selectedId],
  );

  const selectedIdx = useMemo(
    () => references.findIndex((r) => r.id === selectedId),
    [references, selectedId],
  );

  const formattedCitation = useMemo(() => {
    if (!selectedRef) return '';
    return formatCitation(selectedRef, citationStyle, selectedIdx + 1);
  }, [selectedRef, citationStyle, selectedIdx]);

  // ── Insert citation into note ──────────────────────────────────────────────
  const handleInsert = useCallback(() => {
    if (!formattedCitation) return;
    if (onInsert) onInsert(formattedCitation);
    setInserted(true);
    setTimeout(() => {
      setShowCitationPicker(false);
    }, 800);
  }, [formattedCitation, onInsert, setShowCitationPicker]);

  const handleClose = useCallback(() => {
    setShowCitationPicker(false);
  }, [setShowCitationPicker]);

  const handleOpenManager = useCallback(() => {
    setShowCitationPicker(false);
    setShowReferenceManager(true);
  }, [setShowCitationPicker, setShowReferenceManager]);

  const typeLabel = (type) =>
    REFERENCE_TYPES.find((t) => t.id === type)?.label || type;

  return (
    <div className="citation-picker-overlay" onClick={handleClose}>
      <div className="citation-picker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="citation-picker-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <BookMarked size={16} style={{ color: 'var(--accent-primary)' }} />
            <span className="citation-picker-title">Insert Citation</span>
          </div>
          <button className="ref-manager-close" onClick={handleClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="ref-manager-search">
          <Search size={14} className="ref-search-icon" />
          <input
            className="ref-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search references…"
            autoFocus
          />
        </div>

        <div className="citation-picker-body">
          {/* Reference list */}
          <div className="citation-picker-list">
            {references.length === 0 ? (
              <div className="ref-empty" style={{ padding: 'var(--space-xl)' }}>
                <BookMarked size={28} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }} />
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                  Your reference library is empty.
                </p>
                <button className="ref-btn ref-btn-primary" onClick={handleOpenManager}>
                  <Plus size={14} /> Add References
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="ref-empty" style={{ padding: 'var(--space-xl)' }}>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                  No references match your search.
                </p>
              </div>
            ) : (
              filtered.map((ref) => (
                <button
                  key={ref.id}
                  className={`citation-picker-item ${selectedId === ref.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(ref.id)}
                >
                  <span className="ref-item-type">{typeLabel(ref.type)}</span>
                  <span className="citation-picker-item-title">
                    {ref.title || 'Untitled'}
                  </span>
                  {(ref.authors?.length > 0 || ref.year) && (
                    <span className="citation-picker-item-meta">
                      {ref.authors?.slice(0, 1).join(', ')}{ref.authors?.length > 1 ? ' et al.' : ''}
                      {ref.year ? `, ${ref.year}` : ''}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Preview panel */}
          <div className="citation-picker-preview">
            <div className="ref-preview-header">
              <span className="ref-preview-label">Citation Style</span>
              <div className="ref-preview-styles">
                {CITATION_STYLES.map((s) => (
                  <button
                    key={s.id}
                    className={`ref-style-btn ${citationStyle === s.id ? 'active' : ''}`}
                    onClick={() => setCitationStyle(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="citation-picker-preview-text">
              {selectedRef ? (
                <p>{formattedCitation}</p>
              ) : (
                <p className="citation-picker-placeholder">
                  Select a reference on the left to preview the formatted citation.
                </p>
              )}
            </div>

            {references.length > 0 && (
              <button
                className="citation-picker-manage-btn"
                onClick={handleOpenManager}
              >
                <Plus size={12} /> Manage References
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="citation-picker-footer">
          <button className="ref-btn ref-btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            className={`ref-btn ref-btn-primary ${inserted ? 'inserted' : ''}`}
            onClick={handleInsert}
            disabled={!selectedRef || inserted}
          >
            {inserted ? (
              <><Check size={14} /> Inserted!</>
            ) : (
              'Insert Citation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
