import { useState, useRef } from 'react';
import {
  BookOpen, Compass, Rocket, Archive, FileText,
  Pin, Trash2, Plus, ChevronDown, ChevronRight,
  Edit3, X, Tag, Sun, Moon, Glasses, FolderInput, Inbox
} from 'lucide-react';
import { DEFAULT_PARA_CATEGORIES } from '../utils';

const ICON_MAP = {
  inbox: Inbox,
  rocket: Rocket,
  compass: Compass,
  'book-open': BookOpen,
  archive: Archive,
};

const THEME_OPTIONS = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'eyecare', icon: Glasses, label: 'Eye Care' },
  { id: 'dark', icon: Moon, label: 'Dark' },
];

export default function Sidebar({
  notebooks,
  activeView,
  setActiveView,
  activeNotebookId,
  setActiveNotebookId,
  activeTag,
  setActiveTag,
  allTags,
  noteCountByNotebook,
  noteCountByTag,
  totalNotes,
  pinnedCount,
  trashedCount,
  onCreateNotebook,
  onRenameNotebook,
  onDeleteNotebook,
  onMoveNotebookCategory,
  isOpen,
  onClose,
  theme,
  onThemeChange,
  user,
  onSignOut,
}) {
  const [expandedCategories, setExpandedCategories] = useState({
    projects: true,
    areas: true,
    resources: true,
    archive: false,
  });
  const [showNewNotebook, setShowNewNotebook] = useState(null);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [editingNotebook, setEditingNotebook] = useState(null);
  const [editName, setEditName] = useState('');
  const [movingNotebook, setMovingNotebook] = useState(null); // { id, anchorRect }
  const moveButtonRefs = useRef({});

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleCreateNotebook = (paraCategory) => {
    if (newNotebookName.trim()) {
      onCreateNotebook(newNotebookName.trim(), paraCategory);
      setNewNotebookName('');
      setShowNewNotebook(null);
    }
  };

  const handleRename = (id) => {
    if (editName.trim()) {
      onRenameNotebook(id, editName.trim());
      setEditingNotebook(null);
    }
  };

  const handleNavClick = (view, notebookId = null, tag = null) => {
    setActiveView(view);
    setActiveNotebookId(notebookId);
    setActiveTag(tag);
    if (window.innerWidth <= 768) onClose();
  };

  const handleMoveClick = (e, nbId, currentCategory) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMovingNotebook({ id: nbId, currentCategory, anchorRect: { top: rect.bottom + 2, left: rect.left } });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">N</div>
        <div className="sidebar-brand">
          Noto<span>.</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Quick Access</div>
          <button
            className={`sidebar-item ${activeView === 'all' ? 'active' : ''}`}
            onClick={() => handleNavClick('all')}
          >
            <FileText className="icon" size={18} />
            All Notes
            <span className="count">{totalNotes}</span>
          </button>
          <button
            className={`sidebar-item ${activeView === 'pinned' ? 'active' : ''}`}
            onClick={() => handleNavClick('pinned')}
          >
            <Pin className="icon" size={18} />
            Starred
            <span className="count">{pinnedCount}</span>
          </button>
          <button
            className={`sidebar-item ${activeView === 'trash' ? 'active' : ''}`}
            onClick={() => handleNavClick('trash')}
          >
            <Trash2 className="icon" size={18} />
            Trash
            <span className="count">{trashedCount}</span>
          </button>
        </div>

        {DEFAULT_PARA_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || FileText;
          const catNotebooks = notebooks.filter(
            (nb) => nb.paraCategory === cat.id && nb.id !== cat.id
          );
          const isExpanded = expandedCategories[cat.id];
          const mainNotebook = notebooks.find((nb) => nb.id === cat.id);

          return (
            <div className="sidebar-section" key={cat.id}>
              <div className="sidebar-section-title">
                <span
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <span className="para-dot" style={{ background: cat.color }} />
                  {cat.name}
                </span>
                <button
                  onClick={() => {
                    setShowNewNotebook(cat.id);
                    setNewNotebookName('');
                    setExpandedCategories((prev) => ({ ...prev, [cat.id]: true }));
                  }}
                  title={`Add notebook to ${cat.name}`}
                >
                  <Plus size={14} />
                </button>
              </div>

              {isExpanded && (
                <>
                  {mainNotebook && (
                    <button
                      className={`sidebar-item ${activeView === 'notebook' && activeNotebookId === cat.id ? 'active' : ''}`}
                      onClick={() => handleNavClick('notebook', cat.id)}
                    >
                      <Icon className="icon" size={18} />
                      {cat.name}
                      <span className="count">{noteCountByNotebook[cat.id] || 0}</span>
                    </button>
                  )}

                  {catNotebooks.map((nb) => (
                    <div key={nb.id}>
                      {editingNotebook === nb.id ? (
                        <div style={{ padding: '4px 24px', display: 'flex', gap: '4px' }}>
                          <input
                            className="modal-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(nb.id);
                              if (e.key === 'Escape') setEditingNotebook(null);
                            }}
                            autoFocus
                            style={{ padding: '4px 8px', fontSize: '0.8125rem' }}
                          />
                        </div>
                      ) : (
                        <button
                          className={`sidebar-item ${activeView === 'notebook' && activeNotebookId === nb.id ? 'active' : ''}`}
                          onClick={() => handleNavClick('notebook', nb.id)}
                          style={{ paddingLeft: '40px' }}
                        >
                          <FileText className="icon" size={16} />
                          {nb.name}
                          <div className="notebook-actions">
                            <button
                              onClick={(e) => handleMoveClick(e, nb.id, nb.paraCategory)}
                              title="Move to category"
                            >
                              <FolderInput size={13} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingNotebook(nb.id);
                                setEditName(nb.name);
                              }}
                              title="Rename"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNotebook(nb.id);
                              }}
                              title="Delete"
                            >
                              <X size={13} />
                            </button>
                          </div>
                          <span className="count">{noteCountByNotebook[nb.id] || 0}</span>
                        </button>
                      )}
                    </div>
                  ))}

                  {showNewNotebook === cat.id && (
                    <div style={{ padding: '4px 24px', display: 'flex', gap: '4px' }}>
                      <input
                        className="modal-input"
                        placeholder="Notebook name..."
                        value={newNotebookName}
                        onChange={(e) => setNewNotebookName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateNotebook(cat.id);
                          if (e.key === 'Escape') setShowNewNotebook(null);
                        }}
                        autoFocus
                        style={{ padding: '4px 8px', fontSize: '0.8125rem' }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {allTags.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={12} />
                Tags
              </span>
            </div>
            <div className="sidebar-tags">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`sidebar-tag ${activeView === 'tag' && activeTag === tag ? 'active' : ''}`}
                  onClick={() => handleNavClick('tag', null, tag)}
                >
                  #{tag}
                  {noteCountByTag?.[tag] ? <span className="count">{noteCountByTag[tag]}</span> : null}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Move Notebook Dropdown (fixed position) */}
      {movingNotebook && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => setMovingNotebook(null)}
          />
          <div className="context-menu" style={{
            position: 'fixed',
            top: movingNotebook.anchorRect.top,
            left: movingNotebook.anchorRect.left,
            zIndex: 9999,
            minWidth: '160px',
          }}>
            <div style={{ padding: '4px 12px', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              Move to…
            </div>
            {DEFAULT_PARA_CATEGORIES
              .filter((cat) => cat.id !== movingNotebook.currentCategory)
              .map((cat) => (
                <button
                  key={cat.id}
                  className="context-menu-item"
                  onClick={() => {
                    onMoveNotebookCategory(movingNotebook.id, cat.id);
                    setMovingNotebook(null);
                  }}
                >
                  <span className="para-dot" style={{ background: cat.color, width: 8, height: 8, borderRadius: '50%' }} />
                  {cat.name}
                </button>
              ))}
          </div>
        </>
      )}

      {/* Theme Switcher */}
      <div className="sidebar-footer">
        {/* User info */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', padding: '0 2px' }}>
            {user.photoURL
              ? <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
              : <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', flexShrink: 0 }}>
                  {user.displayName?.[0] || user.email?.[0] || '?'}
                </div>
            }
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName || user.email}
            </span>
            <button
              onClick={onSignOut}
              title="Sign out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
        }}>
          {THEME_OPTIONS.map(({ id, icon: ThemeIcon, label }) => (
            <button
              key={id}
              onClick={() => onThemeChange(id)}
              title={label}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '6px 8px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-xs)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                transition: 'all var(--transition-fast)',
                background: theme === id ? 'var(--accent-primary)' : 'transparent',
                color: theme === id ? 'white' : 'var(--text-tertiary)',
                boxShadow: theme === id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <ThemeIcon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
