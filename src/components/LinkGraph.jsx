import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

/**
 * A palette of distinct notebook-based node colors.
 * Cycles through these if there are more notebooks than colors.
 */
const PALETTE = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
];

function notebookColor(notebookId, notebookIds) {
  const idx = notebookIds.indexOf(notebookId);
  return PALETTE[(idx < 0 ? 0 : idx) % PALETTE.length];
}

/**
 * LinkGraph — renders a Cytoscape.js force-directed graph of notes and links.
 *
 * Props:
 *   nodes         {Array<{id, label, notebookId}>}
 *   edges         {Array<{source, target}>}
 *   highlightId   {string|null}  node to center/highlight (active note)
 *   searchQuery   {string}       filter/highlight matching nodes
 *   onNodeClick   {Function}     called with note id on node tap
 */
export default function LinkGraph({ nodes = [], edges = [], highlightId = null, searchQuery = '', onNodeClick }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // Build unique notebook id list for stable color assignment
  const notebookIds = [...new Set(nodes.map((n) => n.notebookId).filter(Boolean))];

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    const elements = [
      ...nodes.map((n) => ({
        group: 'nodes',
        data: {
          id: n.id,
          label: n.label,
          notebookId: n.notebookId,
          color: notebookColor(n.notebookId, notebookIds),
        },
      })),
      ...edges.map((e, i) => ({
        group: 'edges',
        data: { id: `e-${i}`, source: e.source, target: e.target },
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#ffffff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'font-family': 'var(--font-sans, system-ui)',
            'text-wrap': 'ellipsis',
            'text-max-width': '70px',
            'width': 36,
            'height': 36,
            'border-width': 2,
            'border-color': 'rgba(255,255,255,0.15)',
            'transition-property': 'border-color, border-width, background-color, opacity',
            'transition-duration': '0.15s',
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-color': '#ffffff',
            'border-width': 3,
            'width': 46,
            'height': 46,
            'font-size': '11px',
            'z-index': 10,
          },
        },
        {
          selector: 'node.dimmed',
          style: {
            'opacity': 0.25,
          },
        },
        {
          selector: 'node.search-match',
          style: {
            'border-color': '#fbbf24',
            'border-width': 3,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': 'rgba(148, 163, 184, 0.4)',
            'target-arrow-color': 'rgba(148, 163, 184, 0.4)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.7,
            'transition-property': 'line-color, opacity',
            'transition-duration': '0.15s',
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': 'rgba(99, 102, 241, 0.8)',
            'target-arrow-color': 'rgba(99, 102, 241, 0.8)',
            'width': 2.5,
          },
        },
        {
          selector: 'edge.dimmed',
          style: {
            'opacity': 0.1,
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 600,
        randomize: true,
        nodeRepulsion: () => 4500,
        idealEdgeLength: () => 120,
        edgeElasticity: () => 0.45,
        gravity: 0.25,
        numIter: 1000,
        coolingFactor: 0.99,
        fit: true,
        padding: 30,
      },
      minZoom: 0.1,
      maxZoom: 5,
      wheelSensitivity: 0.3,
    });

    cyRef.current = cy;

    // Navigate to note on tap
    cy.on('tap', 'node', (evt) => {
      if (onNodeClick) onNodeClick(evt.target.id());
    });

    // Highlight neighborhood on select
    cy.on('select', 'node', (evt) => {
      const node = evt.target;
      const neighborhood = node.closedNeighborhood();
      cy.elements().addClass('dimmed');
      neighborhood.removeClass('dimmed').addClass('highlighted');
    });

    cy.on('unselect', 'node', () => {
      cy.elements().removeClass('dimmed highlighted');
      applySearchHighlight(cy, searchQuery);
    });

    applySearchHighlight(cy, searchQuery);

    // Highlight the active note
    if (highlightId) {
      const target = cy.getElementById(highlightId);
      if (target.length) {
        cy.animate({ fit: { eles: target.closedNeighborhood(), padding: 80 } }, { duration: 400 });
        target.select();
      }
    }

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // Re-run only when the graph data or highlightId changes (not searchQuery — handled separately)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, highlightId]);

  // Re-apply search highlight without destroying the graph
  useEffect(() => {
    if (cyRef.current) {
      applySearchHighlight(cyRef.current, searchQuery);
    }
  }, [searchQuery]);

  if (nodes.length === 0) {
    return (
      <div className="graph-view-empty">
        <p>No notes with links yet.</p>
        <p>Use <code>[[Note Title]]</code> in your notes to create connections.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="graph-view-canvas" />;
}

function applySearchHighlight(cy, query) {
  cy.nodes().removeClass('search-match');
  if (!query || !query.trim()) return;
  const q = query.toLowerCase();
  cy.nodes().forEach((n) => {
    if ((n.data('label') || '').toLowerCase().includes(q)) {
      n.addClass('search-match');
    }
  });
}
