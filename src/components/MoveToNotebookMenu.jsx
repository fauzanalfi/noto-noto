import { useEffect, useRef } from 'react';

export default function MoveToNotebookMenu({
  show,
  position,
  notebooks,
  currentNotebookId,
  onMove,
  onClose,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
        onClick={onClose}
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
        {notebooks.map((nb) => (
          <button
            key={nb.id}
            className="context-menu-item"
            onClick={() => onMove(nb.id)}
          >
            <span
              className="para-dot"
              style={{ background: nb.color, width: 8, height: 8, borderRadius: '50%' }}
            />
            {nb.name}
            {nb.id === currentNotebookId && ' ✓'}
          </button>
        ))}
      </div>
    </>
  );
}
