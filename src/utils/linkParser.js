/** Matches all [[Title]] wiki-link patterns in text */
const WIKI_LINK_RE = /\[\[([^\]]+)\]\]/g;

/**
 * Extracts all wiki link titles from note content (deduplicated, order-preserved).
 * @param {string} content
 * @returns {string[]}
 */
export function extractWikiLinks(content) {
  if (!content) return [];
  const titles = new Set();
  let match;
  const re = new RegExp(WIKI_LINK_RE.source, 'g');
  while ((match = re.exec(content)) !== null) {
    const title = match[1].trim();
    if (title) titles.add(title);
  }
  return [...titles];
}

/**
 * Resolves an array of titles to note IDs.
 * When multiple notes share a title, the most recently created note wins.
 * @param {string[]} titles
 * @param {Array} allNotes
 * @returns {Array<{title: string, targetId: string|null}>}
 */
export function resolveLinksToIds(titles, allNotes) {
  return titles.map((title) => {
    const lower = title.toLowerCase();
    const matches = allNotes.filter(
      (n) => !n.trashed && (n.title || '').toLowerCase() === lower
    );
    if (matches.length === 0) return { title, targetId: null };
    const best = [...matches].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    return { title, targetId: best.id };
  });
}

/**
 * Parses all [[Title]] links from content and resolves them to note IDs.
 * @param {string} content
 * @param {Array} allNotes
 * @returns {Array<{title: string, targetId: string|null}>}
 */
export function parseLinksInContent(content, allNotes) {
  return resolveLinksToIds(extractWikiLinks(content), allNotes);
}
