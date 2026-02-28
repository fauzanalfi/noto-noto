import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import typescript from 'highlight.js/lib/languages/typescript';
import markdown from 'highlight.js/lib/languages/markdown';
import sql from 'highlight.js/lib/languages/sql';
import java from 'highlight.js/lib/languages/java';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('java', java);

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch {
        return hljs.highlightAuto(code).value;
      }
    }
    try {
      return hljs.highlightAuto(code).value;
    } catch {
      return code;
    }
  },
});

function resolveWikiLinks(content, notes) {
  if (!notes || notes.length === 0) return content;
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, title) => {
    const target = notes.find(
      (n) => !n.trashed && (n.title || '').toLowerCase() === title.trim().toLowerCase()
    );
    if (target) {
      return `<a class="wiki-link" data-note-id="${target.id}">${title}</a>`;
    }
    return `<a class="wiki-link wiki-link-missing">${title}</a>`;
  });
}

export default function Preview({ content, notes = [], onNavigateNote }) {
  const html = useMemo(() => {
    if (!content) return '<p style="color: var(--text-tertiary); font-style: italic;">Nothing to preview yet...</p>';
    try {
      const withWikiLinks = resolveWikiLinks(content, notes);
      return DOMPurify.sanitize(marked.parse(withWikiLinks), {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['data-note-id', 'class'],
      });
    } catch {
      return '<p>Error rendering preview</p>';
    }
  }, [content, notes]);

  const handleClick = (e) => {
    const link = e.target.closest('a.wiki-link');
    if (link) {
      e.preventDefault();
      const noteId = link.dataset.noteId;
      if (noteId && onNavigateNote) {
        onNavigateNote(noteId);
      }
    }
  };

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={handleClick}
    />
  );
}
