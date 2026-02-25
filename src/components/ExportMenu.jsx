import { useState, useEffect, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';

export default function ExportMenu({
  note,
  notes,
  filteredNotes,
  listTitle,
  onExportNote,
  onExportAllMarkdown,
  onExportCurrentMarkdown,
}) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleExportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noto-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShow(false);
  }, [notes]);

  const handleToggle = useCallback(() => {
    if (!show && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left });
    }
    setShow((v) => !v);
  }, [show]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show]);

  return (
    <>
      <button
        className="toolbar-btn"
        ref={buttonRef}
        onClick={handleToggle}
        title="Export"
        aria-label="Export note"
        aria-expanded={show}
        aria-haspopup="menu"
      >
        <Download size={16} aria-hidden="true" />
      </button>
      {show && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => setShow(false)}
          />
          <div
            ref={menuRef}
            className="context-menu"
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
          >
            <button
              className="context-menu-item"
              onClick={() => {
                onExportNote(note);
                setShow(false);
              }}
            >
              <Download size={15} />
              Export as Markdown
            </button>
            <button
              className="context-menu-item"
              onClick={() => {
                onExportAllMarkdown(notes);
                setShow(false);
              }}
            >
              <Download size={15} />
              Backup all (.md zip)
            </button>
            <button
              className="context-menu-item"
              disabled={filteredNotes.length === 0}
              style={filteredNotes.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              onClick={() => {
                if (filteredNotes.length === 0) return;
                onExportCurrentMarkdown(filteredNotes, listTitle);
                setShow(false);
              }}
            >
              <Download size={15} />
              Export current list (.md zip)
            </button>
            <button
              className="context-menu-item"
              onClick={handleExportJSON}
            >
              <Download size={15} />
              Backup all (JSON)
            </button>
          </div>
        </>
      )}
    </>
  );
}
