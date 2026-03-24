import { useState, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  Copy,
  Check,
  X,
  ChevronDown,
  FileText,
  Globe,
  GraduationCap,
  BookMarked,
  Newspaper,
  ClipboardList,
} from 'lucide-react';
import { useNotesContext } from '../context/NotesContext';
import {
  formatCitation,
  formatBibliography,
  shortLabel,
  REFERENCE_TYPES,
  CITATION_STYLES,
} from '../utils/citations';
import { generateId } from '../utils';

// ── Type icon map ─────────────────────────────────────────────────────────────

const TYPE_ICONS = {
  article:    Newspaper,
  book:       BookOpen,
  conference: BookMarked,
  thesis:     GraduationCap,
  website:    Globe,
  report:     ClipboardList,
};

// ── Empty reference template ──────────────────────────────────────────────────

function emptyRef() {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    type: 'article',
    title: '',
    authors: [''],
    year: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    publisher: '',
    location: '',
    edition: '',
    conference: '',
    editors: [],
    institution: '',
    degree: '',
    url: '',
    accessDate: '',
    websiteName: '',
    abstract: '',
    notes: '',
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ── Field definitions per type ────────────────────────────────────────────────

const FIELDS_BY_TYPE = {
  article: [
    { key: 'journal',  label: 'Journal', placeholder: 'Nature, Science, …' },
    { key: 'volume',   label: 'Volume',  placeholder: '12' },
    { key: 'issue',    label: 'Issue',   placeholder: '3' },
    { key: 'pages',    label: 'Pages',   placeholder: '123–145' },
    { key: 'doi',      label: 'DOI',     placeholder: '10.1000/xyz' },
  ],
  book: [
    { key: 'publisher', label: 'Publisher', placeholder: 'Oxford University Press' },
    { key: 'location',  label: 'City',       placeholder: 'New York' },
    { key: 'edition',   label: 'Edition',    placeholder: '3rd' },
    { key: 'doi',       label: 'DOI / ISBN', placeholder: '978-…' },
  ],
  conference: [
    { key: 'conference', label: 'Conference',  placeholder: 'NeurIPS 2023' },
    { key: 'pages',      label: 'Pages',       placeholder: '1–10' },
    { key: 'publisher',  label: 'Publisher',   placeholder: 'ACM' },
    { key: 'doi',        label: 'DOI',         placeholder: '10.1145/…' },
  ],
  thesis: [
    { key: 'institution', label: 'Institution', placeholder: 'MIT' },
    { key: 'degree',      label: 'Degree',      placeholder: 'PhD / Master\'s' },
  ],
  website: [
    { key: 'websiteName', label: 'Website Name', placeholder: 'Wikipedia' },
    { key: 'url',         label: 'URL',          placeholder: 'https://…' },
    { key: 'accessDate',  label: 'Access Date',  placeholder: '', type: 'date' },
  ],
  report: [
    { key: 'publisher', label: 'Institution / Publisher', placeholder: 'NIST' },
    { key: 'volume',    label: 'Report No.',              placeholder: 'TR-2023-01' },
    { key: 'doi',       label: 'DOI / URL',               placeholder: '10.1000/…' },
  ],
};

// ── Author list editor ────────────────────────────────────────────────────────

function AuthorEditor({ authors, onChange, label = 'Authors' }) {
  const add = () => onChange([...authors, '']);
  const remove = (i) => onChange(authors.filter((_, idx) => idx !== i));
  const update = (i, val) => onChange(authors.map((a, idx) => (idx === i ? val : a)));

  return (
    <div className="ref-field-group">
      <label className="ref-field-label">{label}</label>
      {authors.map((a, i) => (
        <div key={i} className="ref-author-row">
          <input
            className="ref-input"
            value={a}
            onChange={(e) => update(i, e.target.value)}
            placeholder="Last, First  or  First Last"
            aria-label={`${label} ${i + 1}`}
          />
          {authors.length > 1 && (
            <button
              type="button"
              className="ref-author-remove"
              onClick={() => remove(i)}
              aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
            >
              <X size={13} />
            </button>
          )}
        </div>
      ))}
      <button type="button" className="ref-add-author-btn" onClick={add}>
        <Plus size={13} /> Add {label.toLowerCase().replace(/s$/, '')}
      </button>
    </div>
  );
}

// ── Tag editor ────────────────────────────────────────────────────────────────

function TagEditor({ tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = (raw) => {
    const t = raw.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  };

  return (
    <div className="ref-field-group">
      <label className="ref-field-label">Tags</label>
      <div className="ref-tags-row">
        {tags.map((t) => (
          <span key={t} className="ref-tag">
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              aria-label={`Remove tag ${t}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          className="ref-tag-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTag(input);
            }
          }}
          onBlur={() => input.trim() && addTag(input)}
          placeholder="Add tag…"
          aria-label="Add tag"
        />
      </div>
    </div>
  );
}

// ── Reference form (add / edit) ───────────────────────────────────────────────

function ReferenceForm({ initial, onSave, onCancel }) {
  const [draft, setDraft] = useState(initial);

  const set = (key, val) => setDraft((prev) => ({ ...prev, [key]: val }));

  const typeFields = FIELDS_BY_TYPE[draft.type] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onSave({ ...draft, authors: draft.authors.filter(Boolean) });
  };

  return (
    <form className="ref-form" onSubmit={handleSubmit}>
      {/* Type */}
      <div className="ref-field-group">
        <label className="ref-field-label" htmlFor="ref-type">Type</label>
        <div className="ref-select-wrapper">
          <select
            id="ref-type"
            className="ref-select"
            value={draft.type}
            onChange={(e) => set('type', e.target.value)}
          >
            {REFERENCE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="ref-select-icon" aria-hidden="true" />
        </div>
      </div>

      {/* Title */}
      <div className="ref-field-group">
        <label className="ref-field-label" htmlFor="ref-title">Title *</label>
        <input
          id="ref-title"
          className="ref-input"
          value={draft.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Full title of the work"
          required
        />
      </div>

      {/* Authors */}
      <AuthorEditor
        authors={draft.authors.length ? draft.authors : ['']}
        onChange={(v) => set('authors', v)}
      />

      {/* Year */}
      <div className="ref-field-group">
        <label className="ref-field-label" htmlFor="ref-year">Year</label>
        <input
          id="ref-year"
          className="ref-input"
          value={draft.year}
          onChange={(e) => set('year', e.target.value)}
          placeholder="2024"
          maxLength={4}
        />
      </div>

      {/* Type-specific fields */}
      {typeFields.map(({ key, label, placeholder, type = 'text' }) => (
        <div key={key} className="ref-field-group">
          <label className="ref-field-label" htmlFor={`ref-${key}`}>{label}</label>
          <input
            id={`ref-${key}`}
            className="ref-input"
            type={type}
            value={draft[key] || ''}
            onChange={(e) => set(key, e.target.value)}
            placeholder={placeholder}
          />
        </div>
      ))}

      {/* Conference editors */}
      {draft.type === 'conference' && (
        <AuthorEditor
          authors={draft.editors.length ? draft.editors : []}
          onChange={(v) => set('editors', v)}
          label="Editors"
        />
      )}

      {/* Abstract */}
      <div className="ref-field-group">
        <label className="ref-field-label" htmlFor="ref-abstract">Abstract</label>
        <textarea
          id="ref-abstract"
          className="ref-textarea"
          value={draft.abstract || ''}
          onChange={(e) => set('abstract', e.target.value)}
          placeholder="Optional abstract…"
          rows={3}
        />
      </div>

      {/* Notes */}
      <div className="ref-field-group">
        <label className="ref-field-label" htmlFor="ref-notes">Notes</label>
        <textarea
          id="ref-notes"
          className="ref-textarea"
          value={draft.notes || ''}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Personal notes…"
          rows={2}
        />
      </div>

      {/* Tags */}
      <TagEditor tags={draft.tags || []} onChange={(v) => set('tags', v)} />

      <div className="ref-form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Reference</button>
      </div>
    </form>
  );
}

// ── Citation card ─────────────────────────────────────────────────────────────

function CitationCard({ style, text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text.replace(/\*/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div className="citation-card">
      <div className="citation-card-header">
        <span className="citation-style-badge">{style}</span>
        <button
          className="citation-copy-btn"
          onClick={copy}
          title="Copy citation"
          aria-label={`Copy ${style} citation`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="citation-text">{text.replace(/\*/g, '')}</p>
    </div>
  );
}

// ── Reference detail panel ────────────────────────────────────────────────────

function ReferenceDetail({ reference: r, onEdit, onDelete }) {
  const [showCitations, setShowCitations] = useState(false);
  const TypeIcon = TYPE_ICONS[r.type] || FileText;

  return (
    <div className="ref-detail">
      <div className="ref-detail-header">
        <TypeIcon size={18} className="ref-detail-type-icon" aria-hidden="true" />
        <div className="ref-detail-meta">
          <span className="ref-type-badge">
            {REFERENCE_TYPES.find((t) => t.id === r.type)?.label || r.type}
          </span>
          <span className="ref-detail-year">{r.year || 'n.d.'}</span>
        </div>
        <div className="ref-detail-actions">
          <button className="toolbar-btn" onClick={onEdit} title="Edit" aria-label="Edit reference">
            <Edit3 size={14} />
          </button>
          <button
            className="toolbar-btn danger"
            onClick={onDelete}
            title="Delete"
            aria-label="Delete reference"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="ref-detail-title">{r.title || 'Untitled'}</h3>

      {r.authors?.length > 0 && (
        <p className="ref-detail-authors">{r.authors.filter(Boolean).join('; ')}</p>
      )}

      {r.journal && <p className="ref-detail-field"><strong>Journal:</strong> {r.journal}</p>}
      {r.conference && <p className="ref-detail-field"><strong>Conference:</strong> {r.conference}</p>}
      {r.institution && <p className="ref-detail-field"><strong>Institution:</strong> {r.institution}</p>}
      {r.publisher && <p className="ref-detail-field"><strong>Publisher:</strong> {r.publisher}</p>}
      {r.doi && (
        <p className="ref-detail-field">
          <strong>DOI:</strong>{' '}
          <a
            href={`https://doi.org/${r.doi.replace(/^https?:\/\/doi\.org\//i, '').trim()}`}
            target="_blank"
            rel="noreferrer"
            className="ref-doi-link"
          >
            {r.doi}
          </a>
        </p>
      )}
      {r.url && (
        <p className="ref-detail-field">
          <strong>URL:</strong>{' '}
          <a href={r.url} target="_blank" rel="noreferrer" className="ref-doi-link">
            {r.url}
          </a>
        </p>
      )}

      {r.abstract && (
        <div className="ref-abstract">
          <p className="ref-field-label">Abstract</p>
          <p>{r.abstract}</p>
        </div>
      )}

      {r.notes && (
        <div className="ref-notes-block">
          <p className="ref-field-label">Notes</p>
          <p>{r.notes}</p>
        </div>
      )}

      {r.tags?.length > 0 && (
        <div className="ref-detail-tags">
          {r.tags.map((t) => (
            <span key={t} className="ref-tag ref-tag-readonly">{t}</span>
          ))}
        </div>
      )}

      {/* Citation styles */}
      <button
        className="ref-citations-toggle"
        onClick={() => setShowCitations((v) => !v)}
        aria-expanded={showCitations}
      >
        <BookOpen size={13} aria-hidden="true" />
        {showCitations ? 'Hide' : 'Show'} formatted citations
        <ChevronDown
          size={13}
          style={{ transform: showCitations ? 'rotate(180deg)' : 'none', transition: '150ms' }}
          aria-hidden="true"
        />
      </button>

      {showCitations && (
        <div className="ref-citations-list">
          {CITATION_STYLES.map((s) => (
            <CitationCard
              key={s.id}
              style={s.label}
              text={formatCitation(r, s.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ReferenceManager component ──────────────────────────────────────────

export default function ReferenceManager({ onInsertCitation }) {
  const { references, createReference, updateReference, deleteReference } =
    useNotesContext();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('list'); // 'list' | 'add' | 'edit' | 'export'
  const [exportStyle, setExportStyle] = useState('apa');
  const [exportCopied, setExportCopied] = useState(false);

  // Filtered + sorted list
  const filtered = (() => {
    if (!search.trim()) return references;
    const q = search.toLowerCase();
    return references.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        (r.authors || []).some((a) => a.toLowerCase().includes(q)) ||
        r.journal?.toLowerCase().includes(q) ||
        r.year?.includes(q) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  })();

  const selectedRef = references.find((r) => r.id === selectedId) ?? null;
  const editingRef = mode === 'edit' && selectedRef ? selectedRef : null;

  const handleCreate = useCallback(() => {
    setMode('add');
    setSelectedId(null);
  }, []);

  const handleSaveNew = useCallback(
    (fields) => {
      const created = createReference(fields);
      if (created) {
        setSelectedId(created.id);
        setMode('list');
      }
    },
    [createReference],
  );

  const handleSaveEdit = useCallback(
    (fields) => {
      updateReference(fields.id, fields);
      setMode('list');
    },
    [updateReference],
  );

  const handleDelete = useCallback(
    (id) => {
      if (!window.confirm('Delete this reference? This cannot be undone.')) return;
      deleteReference(id);
      if (selectedId === id) setSelectedId(null);
    },
    [deleteReference, selectedId],
  );

  const handleCopyBibliography = useCallback(async () => {
    const text = formatBibliography(filtered, exportStyle);
    try {
      await navigator.clipboard.writeText(text.replace(/\*/g, ''));
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [filtered, exportStyle]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="ref-manager">
      {/* ── Left panel: list ── */}
      <div className="ref-list-panel">
        {/* Header */}
        <div className="ref-list-header">
          <h2 className="ref-list-title">References</h2>
          <div className="ref-list-header-actions">
            <button
              className={`toolbar-btn ${mode === 'export' ? 'active' : ''}`}
              onClick={() => setMode((m) => (m === 'export' ? 'list' : 'export'))}
              title="Export bibliography"
              aria-label="Export bibliography"
            >
              <FileText size={15} />
            </button>
            <button
              className="btn btn-primary ref-add-btn"
              onClick={handleCreate}
              aria-label="Add reference"
            >
              <Plus size={15} />
              Add
            </button>
          </div>
        </div>

        {/* Search */}
        <label className="ref-search-box" aria-label="Search references">
          <Search size={14} className="icon" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search references…"
          />
          {search && (
            <button
              className="ref-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </label>

        {/* Count */}
        <p className="ref-list-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'reference' : 'references'}
        </p>

        {/* List */}
        <ul className="ref-list-scroll" role="listbox" aria-label="References list">
          {filtered.length === 0 ? (
            <li className="ref-list-empty">
              {search ? 'No matches found.' : 'No references yet. Click Add to get started.'}
            </li>
          ) : (
            filtered.map((r) => {
              const TypeIcon = TYPE_ICONS[r.type] || FileText;
              return (
                <li
                  key={r.id}
                  role="option"
                  aria-selected={selectedId === r.id}
                  className={`ref-list-item ${selectedId === r.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedId(r.id);
                    if (mode === 'add' || mode === 'edit') setMode('list');
                  }}
                >
                  <TypeIcon
                    size={14}
                    className="ref-list-item-icon"
                    aria-hidden="true"
                  />
                  <div className="ref-list-item-body">
                    <span className="ref-list-item-title">
                      {r.title || 'Untitled'}
                    </span>
                    <span className="ref-list-item-meta">{shortLabel(r)}</span>
                  </div>
                  {onInsertCitation && (
                    <button
                      className="ref-insert-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInsertCitation(r);
                      }}
                      title="Insert citation into note"
                      aria-label={`Insert citation for ${r.title || 'untitled'}`}
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* ── Right panel: detail / form / export ── */}
      <div className="ref-detail-panel">
        {mode === 'add' && (
          <div className="ref-detail-scroll">
            <h3 className="ref-panel-heading">New Reference</h3>
            <ReferenceForm
              initial={emptyRef()}
              onSave={handleSaveNew}
              onCancel={() => setMode('list')}
            />
          </div>
        )}

        {mode === 'edit' && editingRef && (
          <div className="ref-detail-scroll">
            <h3 className="ref-panel-heading">Edit Reference</h3>
            <ReferenceForm
              initial={{ ...editingRef, authors: editingRef.authors?.length ? editingRef.authors : [''] }}
              onSave={handleSaveEdit}
              onCancel={() => setMode('list')}
            />
          </div>
        )}

        {mode === 'export' && (
          <div className="ref-detail-scroll">
            <h3 className="ref-panel-heading">Export Bibliography</h3>
            <div className="ref-export-controls">
              <label className="ref-field-label" htmlFor="export-style">Citation style</label>
              <div className="ref-select-wrapper">
                <select
                  id="export-style"
                  className="ref-select"
                  value={exportStyle}
                  onChange={(e) => setExportStyle(e.target.value)}
                >
                  {CITATION_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="ref-select-icon" aria-hidden="true" />
              </div>
              <p className="ref-export-hint">
                {filtered.length} reference{filtered.length !== 1 ? 's' : ''} will be exported
                {search ? ' (filtered by search)' : ''}.
              </p>
              <button
                className="btn btn-primary"
                onClick={handleCopyBibliography}
                disabled={filtered.length === 0}
              >
                {exportCopied ? <Check size={14} /> : <Copy size={14} />}
                {exportCopied ? 'Copied!' : 'Copy Bibliography'}
              </button>
            </div>

            {filtered.length > 0 && (
              <div className="ref-export-preview">
                {filtered.map((r, i) => (
                  <p key={r.id} className="ref-export-entry">
                    {formatCitation(r, exportStyle, i + 1).replace(/\*/g, '')}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'list' && selectedRef && (
          <div className="ref-detail-scroll">
            <ReferenceDetail
              reference={selectedRef}
              onEdit={() => setMode('edit')}
              onDelete={() => handleDelete(selectedRef.id)}
            />
            {onInsertCitation && (
              <button
                className="btn btn-primary ref-insert-full-btn"
                onClick={() => onInsertCitation(selectedRef)}
              >
                <Plus size={14} /> Insert Citation into Note
              </button>
            )}
          </div>
        )}

        {mode === 'list' && !selectedRef && (
          <div className="ref-empty-detail">
            <BookOpen size={36} aria-hidden="true" />
            <p>Select a reference to view details,</p>
            <p>or click <strong>Add</strong> to create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
