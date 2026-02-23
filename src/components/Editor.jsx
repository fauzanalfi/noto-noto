import { useRef, useCallback } from 'react';
import { countWords } from '../utils';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare, Code, Link, Image, Quote, Minus
} from 'lucide-react';

export default function Editor({ note, onUpdateNote }) {
  const textareaRef = useRef(null);

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

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const cursorPos = start + before.length + text.length;
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + text.length
        );
      }, 0);
    },
    [note, onUpdateNote]
  );

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

  if (!note) return null;

  const toolbarButtons = [
    { group: 'format', items: [
      { icon: Bold, action: () => insertMarkdown('**', '**', 'bold'), title: 'Bold (Ctrl+B)' },
      { icon: Italic, action: () => insertMarkdown('*', '*', 'italic'), title: 'Italic (Ctrl+I)' },
      { icon: Strikethrough, action: () => insertMarkdown('~~', '~~', 'strikethrough'), title: 'Strikethrough' },
    ]},
    { group: 'heading', items: [
      { icon: Heading1, action: () => insertMarkdown('# ', '', 'Heading 1'), title: 'Heading 1' },
      { icon: Heading2, action: () => insertMarkdown('## ', '', 'Heading 2'), title: 'Heading 2' },
      { icon: Heading3, action: () => insertMarkdown('### ', '', 'Heading 3'), title: 'Heading 3' },
    ]},
    { group: 'list', items: [
      { icon: List, action: () => insertMarkdown('- ', '', 'list item'), title: 'Bullet List' },
      { icon: ListOrdered, action: () => insertMarkdown('1. ', '', 'list item'), title: 'Numbered List' },
      { icon: CheckSquare, action: () => insertMarkdown('- [ ] ', '', 'task'), title: 'Task List' },
    ]},
    { group: 'insert', items: [
      { icon: Code, action: () => insertMarkdown('`', '`', 'code'), title: 'Inline Code' },
      { icon: Quote, action: () => insertMarkdown('> ', '', 'quote'), title: 'Blockquote' },
      { icon: Link, action: () => insertMarkdown('[', '](url)', 'link text'), title: 'Link' },
      { icon: Image, action: () => insertMarkdown('![', '](url)', 'alt text'), title: 'Image' },
      { icon: Minus, action: () => insertMarkdown('\n---\n', '', ''), title: 'Horizontal Rule' },
    ]},
  ];

  return (
    <div className="markdown-editor-wrap">
      {/* Formatting Toolbar */}
      <div className="editor-toolbar" style={{ borderBottom: 'none', paddingLeft: 'var(--space-xl)' }} role="toolbar" aria-label="Markdown formatting">
        {toolbarButtons.map((group, gi) => (
          <div key={group.group} style={{ display: 'contents' }}>
            {gi > 0 && <div className="toolbar-divider" aria-hidden="true" />}
            <div className="toolbar-group">
              {group.items.map(({ icon: Icon, action, title }) => (
                <button
                  key={title}
                  className="toolbar-btn"
                  onClick={action}
                  title={title}
                  aria-label={title}
                >
                  <Icon className="icon" size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

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
