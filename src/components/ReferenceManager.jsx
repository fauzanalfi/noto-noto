import { useState, useMemo, useCallback } from 'react';
import {
  X, Plus, Search, Pencil, Trash2, Copy, Check, BookMarked,
} from 'lucide-react';
import { useNotesContext } from '../context/NotesContext';
import { useUIContext } from '../context/UIContext';
import { CITATION_STYLES, REFERENCE_TYPES, formatCitation } from '../utils/citations';

const EMPTY_REF = {
  type: 'journal',
  authors: [],
  title: '',
  year: '',
  journal: '',
  volume: '',
  issue: '',
  pages: '',
  doi: '',
  publisher: '',
  location: '',
  url: '',
  accessed: '',
  conference: '',
  editors: [],
};

export default function ReferenceManager() {
  const { references, createReference, updateReference, deleteReference } = useNotesContext();
  const { setShowReferenceManager } = useUIContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingRef, setEditingRef] = useState(null); // null = list view, {} = new, {...} = existing
  const [formData, setFormData] = useState(EMPTY_REF);
  const [authorsInput, setAuthorsInput] = useState('');
  const [previewStyle, setPreviewStyle] = useState('apa');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // ── Filtered references ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return references;
    const q = searchQuery.toLowerCase();
    return references.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.authors?.some((a) => a.toLowerCase().includes(q)) ||
        r.journal?.toLowerCase().includes(q) ||
        r.year?.toString().includes(q) ||
        r.publisher?.toLowerCase().includes(q),
    );
  }, [references, searchQuery]);

  // ── Open add / edit form ───────────────────────────────────────────────────
  const openAdd = useCallback(() => {
    setFormData({ ...EMPTY_REF });
    setAuthorsInput('');
    setEditingRef('new');
  }, []);

  const openEdit = useCallback((ref) => {
    setFormData({ ...ref });
    setAuthorsInput((ref.authors || []).join(', '));
    setEditingRef(ref.id);
  }, []);

  const cancelForm = useCallback(() => {
    setEditingRef(null);
    setFormData({ ...EMPTY_REF });
    setAuthorsInput('');
  }, []);

  // ── Save reference ─────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const parsed = authorsInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const data = { ...formData, authors: parsed };

    if (editingRef === 'new') {
      createReference(data);
    } else {
      updateReference(editingRef, data);
    }
    cancelForm();
  }, [authorsInput, formData, editingRef, createReference, updateReference, cancelForm]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    (id) => {
      if (deleteConfirmId === id) {
        deleteReference(id);
        setDeleteConfirmId(null);
      } else {
        setDeleteConfirmId(id);
      }
    },
    [deleteConfirmId, deleteReference],
  );

  // ── Copy citation ──────────────────────────────────────────────────────────
  const handleCopy = useCallback(
    (ref, style) => {
      const text = formatCitation(ref, style, references.indexOf(ref) + 1);
      navigator.clipboard?.writeText(text).catch(() => {
        // Fallback for environments without Clipboard API (deprecated but widely supported)
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      });
      setCopiedId(ref.id);
      setTimeout(() => setCopiedId(null), 2000);
    },
    [references],
  );

  // ── Field helper ──────────────────────────────────────────────────────────
  const setField = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const typeLabel = (type) =>
    REFERENCE_TYPES.find((t) => t.id === type)?.label || type;

  // ── Render form ────────────────────────────────────────────────────────────
  if (editingRef !== null) {
    const isNew = editingRef === 'new';
    const preview = formatCitation(
      { ...formData, authors: authorsInput.split(',').map((a) => a.trim()).filter(Boolean) },
      previewStyle,
      1,
    );

    return (
      <div className="ref-manager-overlay" onClick={cancelForm}>
        <div className="ref-manager-modal" onClick={(e) => e.stopPropagation()}>
          <div className="ref-manager-header">
            <h2 className="ref-manager-title">
              {isNew ? 'Add Reference' : 'Edit Reference'}
            </h2>
            <button
              className="ref-manager-close"
              onClick={cancelForm}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="ref-manager-body">
            <div className="ref-form-group">
              <label className="ref-form-label">Type</label>
              <select
                className="ref-form-select"
                value={formData.type}
                onChange={(e) => setField('type', e.target.value)}
              >
                {REFERENCE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="ref-form-group">
              <label className="ref-form-label">
                Authors <span className="ref-form-hint">(comma-separated: Last, First or First Last)</span>
              </label>
              <input
                className="ref-form-input"
                value={authorsInput}
                onChange={(e) => setAuthorsInput(e.target.value)}
                placeholder="Smith, John, Doe, Jane"
              />
            </div>

            <div className="ref-form-group">
              <label className="ref-form-label">Title *</label>
              <input
                className="ref-form-input"
                value={formData.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Title of the work"
              />
            </div>

            <div className="ref-form-row">
              <div className="ref-form-group">
                <label className="ref-form-label">Year</label>
                <input
                  className="ref-form-input"
                  value={formData.year}
                  onChange={(e) => setField('year', e.target.value)}
                  placeholder="2024"
                />
              </div>

              {(formData.type === 'journal') && (
                <>
                  <div className="ref-form-group">
                    <label className="ref-form-label">Volume</label>
                    <input
                      className="ref-form-input"
                      value={formData.volume}
                      onChange={(e) => setField('volume', e.target.value)}
                      placeholder="12"
                    />
                  </div>
                  <div className="ref-form-group">
                    <label className="ref-form-label">Issue</label>
                    <input
                      className="ref-form-input"
                      value={formData.issue}
                      onChange={(e) => setField('issue', e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div className="ref-form-group">
                    <label className="ref-form-label">Pages</label>
                    <input
                      className="ref-form-input"
                      value={formData.pages}
                      onChange={(e) => setField('pages', e.target.value)}
                      placeholder="100–120"
                    />
                  </div>
                </>
              )}
            </div>

            {formData.type === 'journal' && (
              <div className="ref-form-group">
                <label className="ref-form-label">Journal Name</label>
                <input
                  className="ref-form-input"
                  value={formData.journal}
                  onChange={(e) => setField('journal', e.target.value)}
                  placeholder="Nature, Science, etc."
                />
              </div>
            )}

            {formData.type === 'conference' && (
              <div className="ref-form-group">
                <label className="ref-form-label">Conference Name</label>
                <input
                  className="ref-form-input"
                  value={formData.conference}
                  onChange={(e) => setField('conference', e.target.value)}
                  placeholder="Proceedings of…"
                />
              </div>
            )}

            {(formData.type === 'book' || formData.type === 'conference') && (
              <div className="ref-form-row">
                <div className="ref-form-group">
                  <label className="ref-form-label">Publisher</label>
                  <input
                    className="ref-form-input"
                    value={formData.publisher}
                    onChange={(e) => setField('publisher', e.target.value)}
                    placeholder="Publisher name"
                  />
                </div>
                <div className="ref-form-group">
                  <label className="ref-form-label">Location</label>
                  <input
                    className="ref-form-input"
                    value={formData.location}
                    onChange={(e) => setField('location', e.target.value)}
                    placeholder="New York"
                  />
                </div>
              </div>
            )}

            {(formData.type === 'journal' || formData.type === 'conference') && (
              <div className="ref-form-group">
                <label className="ref-form-label">DOI</label>
                <input
                  className="ref-form-input"
                  value={formData.doi}
                  onChange={(e) => setField('doi', e.target.value)}
                  placeholder="10.1000/xyz123"
                />
              </div>
            )}

            {formData.type === 'website' && (
              <>
                <div className="ref-form-group">
                  <label className="ref-form-label">URL</label>
                  <input
                    className="ref-form-input"
                    value={formData.url}
                    onChange={(e) => setField('url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="ref-form-row">
                  <div className="ref-form-group">
                    <label className="ref-form-label">Publisher / Site Name</label>
                    <input
                      className="ref-form-input"
                      value={formData.publisher}
                      onChange={(e) => setField('publisher', e.target.value)}
                      placeholder="Organization or website name"
                    />
                  </div>
                  <div className="ref-form-group">
                    <label className="ref-form-label">Date Accessed</label>
                    <input
                      className="ref-form-input"
                      value={formData.accessed}
                      onChange={(e) => setField('accessed', e.target.value)}
                      placeholder="January 1, 2024"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="ref-preview-block">
              <div className="ref-preview-header">
                <span className="ref-preview-label">Preview</span>
                <div className="ref-preview-styles">
                  {CITATION_STYLES.map((s) => (
                    <button
                      key={s.id}
                      className={`ref-style-btn ${previewStyle === s.id ? 'active' : ''}`}
                      onClick={() => setPreviewStyle(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="ref-preview-text">{preview || '—'}</p>
            </div>
          </div>

          <div className="ref-manager-footer">
            <button className="ref-btn ref-btn-secondary" onClick={cancelForm}>
              Cancel
            </button>
            <button
              className="ref-btn ref-btn-primary"
              onClick={handleSave}
              disabled={!formData.title.trim()}
            >
              {isNew ? 'Add Reference' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="ref-manager-overlay" onClick={() => setShowReferenceManager(false)}>
      <div className="ref-manager-modal ref-manager-list" onClick={(e) => e.stopPropagation()}>
        <div className="ref-manager-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <BookMarked size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="ref-manager-title">Reference Library</h2>
            <span className="ref-manager-count">{references.length}</span>
          </div>
          <button
            className="ref-manager-close"
            onClick={() => setShowReferenceManager(false)}
            aria-label="Close reference manager"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ref-manager-search">
          <Search size={14} className="ref-search-icon" />
          <input
            className="ref-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search references…"
          />
        </div>

        <div className="ref-manager-body ref-list">
          {filtered.length === 0 ? (
            <div className="ref-empty">
              <BookMarked size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }} />
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                {searchQuery ? 'No references match your search.' : 'No references yet. Add your first one!'}
              </p>
            </div>
          ) : (
            filtered.map((ref, idx) => (
              <div key={ref.id} className="ref-item">
                <div className="ref-item-type">{typeLabel(ref.type)}</div>
                <div className="ref-item-title">{ref.title || 'Untitled'}</div>
                <div className="ref-item-meta">
                  {ref.authors?.length > 0 && (
                    <span>{ref.authors.slice(0, 2).join(', ')}{ref.authors.length > 2 ? ' et al.' : ''}</span>
                  )}
                  {ref.year && <span>{ref.year}</span>}
                  {ref.journal && <span>{ref.journal}</span>}
                  {ref.publisher && <span>{ref.publisher}</span>}
                </div>
                <div className="ref-item-actions">
                  <button
                    className={`ref-action-btn ${copiedId === ref.id ? 'copied' : ''}`}
                    onClick={() => handleCopy(ref, previewStyle)}
                    title={`Copy ${CITATION_STYLES.find(s => s.id === previewStyle)?.label} citation`}
                    aria-label="Copy citation"
                  >
                    {copiedId === ref.id ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedId === ref.id ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    className="ref-action-btn"
                    onClick={() => openEdit(ref)}
                    title="Edit reference"
                    aria-label="Edit reference"
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    className={`ref-action-btn danger ${deleteConfirmId === ref.id ? 'confirm' : ''}`}
                    onClick={() => handleDelete(ref.id)}
                    title={deleteConfirmId === ref.id ? 'Click again to confirm' : 'Delete reference'}
                    aria-label="Delete reference"
                  >
                    <Trash2 size={14} />
                    <span>{deleteConfirmId === ref.id ? 'Confirm?' : 'Delete'}</span>
                  </button>
                </div>
                <div className="ref-item-preview">
                  {formatCitation(ref, previewStyle, idx + 1)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="ref-manager-footer">
          <div className="ref-preview-styles" style={{ flex: 1 }}>
            {CITATION_STYLES.map((s) => (
              <button
                key={s.id}
                className={`ref-style-btn ${previewStyle === s.id ? 'active' : ''}`}
                onClick={() => setPreviewStyle(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button className="ref-btn ref-btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Reference
          </button>
        </div>
      </div>
    </div>
  );
}
