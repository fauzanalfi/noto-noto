import { useState, useMemo } from 'react';
import { X, GitBranch, Search } from 'lucide-react';
import LinkGraph from './LinkGraph';

/**
 * GraphView — fullscreen modal showing the note link network.
 *
 * Props:
 *   getLinkGraph   {Function}  returns {nodes, edges}
 *   activeNoteId   {string}    highlights the currently open note
 *   notebooks      {Array}     notebook list (for filter)
 *   onClose        {Function}
 *   onNavigateNote {Function}  called with noteId to open a note
 */
export default function GraphView({ getLinkGraph, activeNoteId, notebooks = [], onClose, onNavigateNote }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNotebookId, setFilterNotebookId] = useState('all');

  const rawGraph = useMemo(() => getLinkGraph(), [getLinkGraph]);

  const graph = useMemo(() => {
    if (filterNotebookId === 'all') return rawGraph;
    // Keep only nodes in the selected notebook and edges between them
    const nodeIds = new Set(
      rawGraph.nodes
        .filter((n) => n.notebookId === filterNotebookId)
        .map((n) => n.id)
    );
    return {
      nodes: rawGraph.nodes.filter((n) => nodeIds.has(n.id)),
      edges: rawGraph.edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target)),
    };
  }, [rawGraph, filterNotebookId]);

  const handleNodeClick = (noteId) => {
    if (onNavigateNote) onNavigateNote(noteId);
    if (onClose) onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="graph-view-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Note graph view"
    >
      <div className="graph-view-modal">
        {/* Header */}
        <div className="graph-view-header">
          <GitBranch size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <h2>Note Graph</h2>

          <div className="graph-view-controls">
            {/* Notebook filter */}
            <label>
              Notebook
              <select
                value={filterNotebookId}
                onChange={(e) => setFilterNotebookId(e.target.value)}
                style={{
                  marginLeft: '6px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '2px 6px',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                <option value="all">All notebooks</option>
                {notebooks.map((nb) => (
                  <option key={nb.id} value={nb.id}>{nb.name}</option>
                ))}
              </select>
            </label>

            {/* Search */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={12} style={{ position: 'absolute', left: 8, color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
              <input
                className="graph-view-search"
                style={{ paddingLeft: 24 }}
                placeholder="Highlight nodes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search nodes in graph"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
            }}
            aria-label="Close graph view"
          >
            <X size={16} />
          </button>
        </div>

        {/* Stats bar */}
        <div style={{
          padding: '4px var(--space-lg)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-tertiary)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: 'var(--space-md)',
        }}>
          <span>{graph.nodes.length} notes</span>
          <span>·</span>
          <span>{graph.edges.length} links</span>
          <span style={{ marginLeft: 'auto' }}>Click a node to open note · Scroll to zoom · Drag to pan</span>
        </div>

        {/* Graph canvas */}
        <div className="graph-view-body">
          <LinkGraph
            nodes={graph.nodes}
            edges={graph.edges}
            highlightId={activeNoteId}
            searchQuery={searchQuery}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>
    </div>
  );
}
