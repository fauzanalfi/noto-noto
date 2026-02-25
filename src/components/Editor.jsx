import { useRef, useCallback, useState } from 'react';
import { countWords } from '../utils';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare, Code, Link, Image, Quote, Minus, Table
} from 'lucide-react';

const TOOLBAR_GROUPS = [
  {
    group: 'format',
    items: [
      { key: 'bold', icon: Bold, title: 'Bold (Ctrl+B)' },
      { key: 'italic', icon: Italic, title: 'Italic (Ctrl+I)' },
      { key: 'strikethrough', icon: Strikethrough, title: 'Strikethrough' },
    ],
  },
  {
    group: 'heading',
    items: [
      { key: 'h1', icon: Heading1, title: 'Heading 1' },
      { key: 'h2', icon: Heading2, title: 'Heading 2' },
      { key: 'h3', icon: Heading3, title: 'Heading 3' },
    ],
  },
  {
    group: 'list',
    items: [
      { key: 'list-bullet', icon: List, title: 'Bullet List' },
      { key: 'list-numbered', icon: ListOrdered, title: 'Numbered List' },
      { key: 'list-task', icon: CheckSquare, title: 'Task List' },
    ],
  },
  {
    group: 'insert',
    items: [
      { key: 'code-inline', icon: Code, title: 'Inline Code' },
      { key: 'quote', icon: Quote, title: 'Blockquote' },
      { key: 'link', icon: Link, title: 'Link' },
      { key: 'image', icon: Image, title: 'Image' },
      { key: 'table', icon: Table, title: 'Table' },
      { key: 'hr', icon: Minus, title: 'Horizontal Rule' },
    ],
  },
];

export default function Editor({ note, onUpdateNote }) {
  const textareaRef = useRef(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(3);

  const insertMarkdown = useCallback(
    (before, after = '', placeholder = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const text = selectedText || placeholder;

      const newValue =
        textarea.value.substring(0, start) +
        before +
        text +
        after +
        textarea.value.substring(end);

      onUpdateNote(note.id, { content: newValue });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + text.length
        );
      }, 0);
    },
    [note, onUpdateNote]
  );

  const insertTable = useCallback((rows, cols) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const safeRows = Math.max(1, Math.min(Number(rows) || 1, 20));
    const safeCols = Math.max(1, Math.min(Number(cols) || 1, 12));
    const headerCells = Array.from({ length: safeCols }, (_, i) => `Header ${i + 1}`);
    const separatorCells = Array.from({ length: safeCols }, () => '---');
    const bodyRows = Array.from({ length: safeRows }, (_, r) => {
      const rowCells = Array.from(
        { length: safeCols },
        (_, c) => `Cell ${r + 1}-${c + 1}`
      );
      return `| ${rowCells.join(' | ')} |`;
    });
    const tableTemplate = `\n| ${headerCells.join(' | ')} |\n| ${separatorCells.join(' | ')} |\n${bodyRows.join('\n')}\n`;

    const newValue =
      textarea.value.substring(0, start) +
      tableTemplate +
      textarea.value.substring(start);

    onUpdateNote(note.id, { content: newValue });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tableTemplate.length, start + tableTemplate.length);
    }, 0);
  }, [note, onUpdateNote]);

  const handleOpenTableModal = () => {
    setShowTableModal(true);
  };

  const handleCloseTableModal = () => {
    setShowTableModal(false);
  };

  const handleCreateTable = (e) => {
    e.preventDefault();
    insertTable(tableRows, tableCols);
    setShowTableModal(false);
  };

  const handleKeyDown = (e) => {
    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Remove indent
        const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
        const lineText = textarea.value.substring(lineStart, start);
        if (lineText.startsWith('  ')) {
          const newValue = textarea.value.substring(0, lineStart) + textarea.value.substring(lineStart + 2);
          onUpdateNote(note.id, { content: newValue });
          setTimeout(() => {
            textarea.setSelectionRange(start - 2, end - 2);
          }, 0);
        }
      } else {
        const newValue =
          textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        onUpdateNote(note.id, { content: newValue });
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      }
    }

    // Ctrl+B for bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertMarkdown('**', '**', 'bold text');
    }

    // Ctrl+I for italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertMarkdown('*', '*', 'italic text');
    }
  };

  const handleToolbarAction = useCallback((actionKey) => {
    switch (actionKey) {
      case 'bold':
        insertMarkdown('**', '**', 'bold');
        break;
      case 'italic':
        insertMarkdown('*', '*', 'italic');
        break;
      case 'strikethrough':
        insertMarkdown('~~', '~~', 'strikethrough');
        break;
      case 'h1':
        insertMarkdown('# ', '', 'Heading 1');
        break;
      case 'h2':
        insertMarkdown('## ', '', 'Heading 2');
        break;
      case 'h3':
        insertMarkdown('### ', '', 'Heading 3');
        break;
      case 'list-bullet':
        insertMarkdown('- ', '', 'list item');
        break;
      case 'list-numbered':
        insertMarkdown('1. ', '', 'list item');
        break;
      case 'list-task':
        insertMarkdown('- [ ] ', '', 'task');
        break;
      case 'code-inline':
        insertMarkdown('`', '`', 'code');
        break;
      case 'quote':
        insertMarkdown('> ', '', 'quote');
        break;
      case 'link':
        insertMarkdown('[', '](url)', 'link text');
        break;
      case 'image':
        insertMarkdown('![', '](url)', 'alt text');
        break;
      case 'table':
        handleOpenTableModal();
        break;
      case 'hr':
        insertMarkdown('\n---\n', '', '');
        break;
      default:
        break;
    }
  }, [insertMarkdown]);

  if (!note) return null;

  return (
    <div className="markdown-editor-wrap">
      {/* Formatting Toolbar */}
      <div className="editor-toolbar" style={{ borderBottom: 'none', paddingLeft: 'var(--space-xl)' }} role="toolbar" aria-label="Markdown formatting">
        {TOOLBAR_GROUPS.map((group, gi) => (
          <div key={group.group} style={{ display: 'contents' }}>
            {gi > 0 && <div className="toolbar-divider" aria-hidden="true" />}
            <div className="toolbar-group">
              {group.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.key}
                    className="toolbar-btn"
                    onClick={() => handleToolbarAction(item.key)}
                    title={item.title}
                    aria-label={item.title}
                  >
                    <ItemIcon className="icon" size={16} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showTableModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Insert table" onClick={handleCloseTableModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Insert Table</h3>
            <form onSubmit={handleCreateTable}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Rows</div>
                  <input
                    className="modal-input"
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) => setTableRows(Number(e.target.value))}
                  />
                </label>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Columns</div>
                  <input
                    className="modal-input"
                    type="number"
                    min="1"
                    max="12"
                    value={tableCols}
                    onChange={(e) => setTableCols(Number(e.target.value))}
                  />
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={handleCloseTableModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Insert</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        className="markdown-textarea"
        value={note.content}
        onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
        onKeyDown={handleKeyDown}
        placeholder="Start writing in Markdown..."
        spellCheck={false}
        aria-label="Note content editor"
      />

      {/* Word count bar */}
      <div className="word-count-bar">
        <span>{countWords(note.content).toLocaleString()} words</span>
        <span>·</span>
        <span>~{Math.max(1, Math.ceil(countWords(note.content) / 200))} min read</span>
      </div>
    </div>
  );
}
