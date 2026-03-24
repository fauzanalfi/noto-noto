/**
 * Citation and reference formatting utilities.
 * Supports APA 7th, MLA 9th, Chicago 17th (author-date), and IEEE styles.
 *
 * Reference object shape:
 * {
 *   id: string,
 *   type: 'article' | 'book' | 'conference' | 'thesis' | 'website' | 'report',
 *   title: string,
 *   authors: string[],   // each entry: "LastName, FirstName" or "FirstName LastName"
 *   year: string,
 *   journal: string,     // article
 *   volume: string,      // article / report
 *   issue: string,       // article
 *   pages: string,       // article / conference
 *   doi: string,
 *   publisher: string,   // book / report
 *   location: string,    // book
 *   edition: string,     // book
 *   conference: string,  // conference
 *   editors: string[],   // conference
 *   institution: string, // thesis
 *   degree: string,      // thesis — e.g. "PhD" / "Master's"
 *   url: string,         // website
 *   accessDate: string,  // website — ISO date string
 *   websiteName: string, // website
 *   abstract: string,
 *   notes: string,
 *   tags: string[],
 *   createdAt: string,
 *   updatedAt: string,
 * }
 */

export const REFERENCE_TYPES = [
  { id: 'article',    label: 'Journal Article' },
  { id: 'book',       label: 'Book' },
  { id: 'conference', label: 'Conference Paper' },
  { id: 'thesis',     label: 'Thesis / Dissertation' },
  { id: 'website',    label: 'Website / Webpage' },
  { id: 'report',     label: 'Technical Report' },
];

export const CITATION_STYLES = [
  { id: 'apa',     label: 'APA 7th' },
  { id: 'mla',     label: 'MLA 9th' },
  { id: 'chicago', label: 'Chicago 17th' },
  { id: 'ieee',    label: 'IEEE' },
];

// ── Author helpers ────────────────────────────────────────────────────────────

/**
 * Parse "LastName, FirstName" → { last, first, initials }
 * Also handles "FirstName LastName" without a comma.
 */
export function parseAuthor(raw = '') {
  const trimmed = raw.trim();
  if (!trimmed) return { last: '', first: '', initials: '' };

  if (trimmed.includes(',')) {
    const [last, ...rest] = trimmed.split(',');
    const first = rest.join(',').trim();
    const initials = first
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => `${n[0].toUpperCase()}.`)
      .join(' ');
    return { last: last.trim(), first, initials };
  }

  const parts = trimmed.split(/\s+/);
  const last = parts.pop() || '';
  const first = parts.join(' ');
  const initials = parts
    .filter(Boolean)
    .map((n) => `${n[0].toUpperCase()}.`)
    .join(' ');
  return { last, first, initials };
}

/** "Last, F. I." */
function toApaAuthor(raw) {
  const { last, initials } = parseAuthor(raw);
  if (!last) return '';
  return initials ? `${last}, ${initials}` : last;
}

/** "Last, First" (for MLA/Chicago first author) */
function toMlaAuthorFirst(raw) {
  const { last, first } = parseAuthor(raw);
  if (!last) return '';
  return first ? `${last}, ${first}` : last;
}

/** "First Last" (for subsequent MLA/Chicago authors) */
function toMlaAuthorOther(raw) {
  const { last, first } = parseAuthor(raw);
  if (!last) return '';
  return first ? `${first} ${last}` : last;
}

/** "F. I. Last" for IEEE */
function toInitialLast(raw) {
  const { last, initials } = parseAuthor(raw);
  if (!last) return '';
  return initials ? `${initials} ${last}` : last;
}

function joinApaAuthors(authors = []) {
  const formatted = authors.filter(Boolean).map(toApaAuthor);
  if (formatted.length === 0) return '';
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]}, & ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
}

function joinMlaAuthors(authors = []) {
  const f = authors.filter(Boolean);
  if (f.length === 0) return '';
  if (f.length === 1) return toMlaAuthorFirst(f[0]);
  if (f.length === 2) return `${toMlaAuthorFirst(f[0])}, and ${toMlaAuthorOther(f[1])}`;
  return `${toMlaAuthorFirst(f[0])}, et al`;
}

function joinChicagoAuthors(authors = []) {
  const f = authors.filter(Boolean);
  if (f.length === 0) return '';
  if (f.length === 1) return toMlaAuthorFirst(f[0]);
  if (f.length === 2) return `${toMlaAuthorFirst(f[0])}, and ${toMlaAuthorOther(f[1])}`;
  if (f.length === 3)
    return `${toMlaAuthorFirst(f[0])}, ${toMlaAuthorOther(f[1])}, and ${toMlaAuthorOther(f[2])}`;
  return `${toMlaAuthorFirst(f[0])} et al`;
}

function joinIeeeAuthors(authors = []) {
  const f = authors.filter(Boolean);
  if (f.length === 0) return '';
  if (f.length <= 3) return f.map(toInitialLast).join(', ');
  return `${toInitialLast(f[0])} et al`;
}

// ── DOI / URL helpers ─────────────────────────────────────────────────────────

function doiSuffix(doi) {
  if (!doi) return '';
  const clean = doi.replace(/^https?:\/\/doi\.org\//i, '').trim();
  return clean ? ` https://doi.org/${clean}` : '';
}

function formatAccessDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ── APA 7th ───────────────────────────────────────────────────────────────────

function formatApa(ref) {
  const { type, title = '', authors = [] } = ref;
  const year = ref.year || 'n.d.';
  const authorStr = joinApaAuthors(authors) || 'Unknown Author';

  switch (type) {
    case 'article': {
      const { journal = '', volume = '', issue = '', pages = '', doi } = ref;
      let vol = volume ? `, ${volume}` : '';
      if (volume && issue) vol += `(${issue})`;
      const pp = pages ? `, ${pages}` : '';
      return `${authorStr} (${year}). ${title}. *${journal}*${vol}${pp}.${doiSuffix(doi)}`;
    }
    case 'book': {
      const { publisher = '', location = '', edition } = ref;
      const ed = edition ? ` (${edition} ed.)` : '';
      const pub = [location, publisher].filter(Boolean).join(': ');
      return `${authorStr} (${year}). *${title}*${ed}. ${pub}.`;
    }
    case 'conference': {
      const { conference = '', pages = '', editors = [], doi } = ref;
      const eds = editors.length ? `In ${joinApaAuthors(editors)} (Ed.), ` : '';
      const pp = pages ? ` (pp. ${pages})` : '';
      return `${authorStr} (${year}). ${title}. ${eds}*${conference}*${pp}.${doiSuffix(doi)}`;
    }
    case 'thesis': {
      const { institution = '', degree = 'Doctoral dissertation' } = ref;
      const inst = institution ? `, ${institution}` : '';
      return `${authorStr} (${year}). *${title}* [${degree}${inst}].`;
    }
    case 'website': {
      const { websiteName = '', url = '', accessDate } = ref;
      const accessed = accessDate
        ? ` Retrieved ${formatAccessDate(accessDate)}, from ${url}`
        : url ? ` ${url}` : '';
      const site = websiteName ? ` *${websiteName}*.` : '';
      return `${authorStr} (${year}). ${title}.${site}${accessed}`;
    }
    case 'report': {
      const { publisher = '', volume = '', doi } = ref;
      const vol = volume ? ` (Vol. ${volume})` : '';
      return `${authorStr} (${year}). *${title}*${vol}. ${publisher}.${doiSuffix(doi)}`;
    }
    default:
      return `${authorStr} (${year}). ${title}.`;
  }
}

// ── MLA 9th ───────────────────────────────────────────────────────────────────

function formatMla(ref) {
  const { type, title = '', authors = [], year = '' } = ref;
  const authorStr = joinMlaAuthors(authors);

  switch (type) {
    case 'article': {
      const { journal = '', volume = '', issue = '', pages = '', doi, url } = ref;
      const vol = volume ? `, vol. ${volume}` : '';
      const no = issue ? `, no. ${issue}` : '';
      const yr = year ? `, ${year}` : '';
      const pp = pages ? `, pp. ${pages}` : '';
      const link = doi
        ? ` doi:${doi.replace(/^https?:\/\/doi\.org\//i, '').trim()}.`
        : url ? ` ${url}.` : '';
      return `${authorStr ? authorStr + '.' : ''} "${title}." *${journal}*${vol}${no}${yr}${pp}.${link}`;
    }
    case 'book': {
      const { publisher = '', location = '', edition } = ref;
      const ed = edition ? `, ${edition} ed.` : '';
      const pub = publisher
        ? location ? `${location}: ${publisher}` : publisher
        : location;
      const yr = year ? `, ${year}` : '';
      return `${authorStr ? authorStr + '.' : ''} *${title}*${ed}. ${pub}${yr}.`;
    }
    case 'conference': {
      const { conference = '', pages = '' } = ref;
      const pp = pages ? `, pp. ${pages}` : '';
      const yr = year ? `, ${year}` : '';
      return `${authorStr ? authorStr + '.' : ''} "${title}." *${conference}*${yr}${pp}.`;
    }
    case 'thesis': {
      const { institution = '', degree = 'Dissertation' } = ref;
      const yr = year ? `, ${year}` : '';
      return `${authorStr ? authorStr + '.' : ''} *${title}*. ${degree}, ${institution}${yr}.`;
    }
    case 'website': {
      const { websiteName = '', url = '', accessDate } = ref;
      const accessed = accessDate ? ` Accessed ${formatAccessDate(accessDate)}.` : '';
      const yr = year ? `, ${year}` : '';
      return `${authorStr ? authorStr + '.' : ''} "${title}." *${websiteName || 'Web'}*${yr}, ${url}.${accessed}`;
    }
    case 'report': {
      const { publisher = '', volume = '' } = ref;
      const vol = volume ? `, vol. ${volume}` : '';
      const yr = year ? `, ${year}` : '';
      return `${authorStr ? authorStr + '.' : ''} *${title}*${vol}. ${publisher}${yr}.`;
    }
    default:
      return `${authorStr ? authorStr + '.' : ''} *${title}*. ${year}.`;
  }
}

// ── Chicago 17th (Author-Date) ────────────────────────────────────────────────

function formatChicago(ref) {
  const { type, title = '', authors = [], year = '' } = ref;
  const authorStr = joinChicagoAuthors(authors);

  switch (type) {
    case 'article': {
      const { journal = '', volume = '', issue = '', pages = '', doi, url } = ref;
      const vol = volume ? ` ${volume}` : '';
      const no = issue ? `, no. ${issue}` : '';
      const pp = pages ? `: ${pages}` : '';
      const link = doi
        ? ` https://doi.org/${doi.replace(/^https?:\/\/doi\.org\//i, '').trim()}.`
        : url ? ` ${url}.` : '';
      return `${authorStr}. ${year}. "${title}." *${journal}*${vol}${no}${pp}.${link}`;
    }
    case 'book': {
      const { publisher = '', location = '', edition } = ref;
      const ed = edition ? `, ${edition} edition` : '';
      const place = [location, publisher].filter(Boolean).join(': ');
      return `${authorStr}. ${year}. *${title}*${ed}. ${place}.`;
    }
    case 'conference': {
      const { conference = '', pages = '' } = ref;
      const pp = pages ? `, ${pages}` : '';
      return `${authorStr}. ${year}. "${title}." *${conference}*${pp}.`;
    }
    case 'thesis': {
      const { institution = '', degree = 'PhD diss.' } = ref;
      return `${authorStr}. ${year}. "${title}." ${degree}, ${institution}.`;
    }
    case 'website': {
      const { websiteName = '', url = '', accessDate } = ref;
      const accessed = accessDate ? ` Accessed ${formatAccessDate(accessDate)}.` : '';
      const site = websiteName ? `${websiteName}. ` : '';
      return `${authorStr}. ${year}. "${title}." ${site}${url}.${accessed}`;
    }
    case 'report': {
      const { publisher = '', volume = '' } = ref;
      const vol = volume ? `, vol. ${volume}` : '';
      return `${authorStr}. ${year}. *${title}*${vol}. ${publisher}.`;
    }
    default:
      return `${authorStr}. ${year}. *${title}*.`;
  }
}

// ── IEEE ──────────────────────────────────────────────────────────────────────

function formatIeee(ref, index = 1) {
  const { type, title = '', authors = [], year = '' } = ref;
  const authorStr = joinIeeeAuthors(authors);
  const prefix = `[${index}]`;

  switch (type) {
    case 'article': {
      const { journal = '', volume = '', issue = '', pages = '', doi } = ref;
      const vol = volume ? `, vol. ${volume}` : '';
      const no = issue ? `, no. ${issue}` : '';
      const pp = pages ? `, pp. ${pages}` : '';
      const doiStr = doi ? `, doi: ${doi.replace(/^https?:\/\/doi\.org\//i, '').trim()}` : '';
      return `${prefix} ${authorStr}, "${title}," *${journal}*${vol}${no}${pp}, ${year}${doiStr}.`;
    }
    case 'book': {
      const { publisher = '', location = '', edition } = ref;
      const ed = edition ? `, ${edition} ed.` : '';
      const place = [location, publisher].filter(Boolean).join(': ');
      return `${prefix} ${authorStr}, *${title}*${ed}. ${place}, ${year}.`;
    }
    case 'conference': {
      const { conference = '', pages = '' } = ref;
      const pp = pages ? `, pp. ${pages}` : '';
      return `${prefix} ${authorStr}, "${title}," in *${conference}*${pp}, ${year}.`;
    }
    case 'thesis': {
      const { institution = '', degree = 'Ph.D. dissertation' } = ref;
      return `${prefix} ${authorStr}, "${title}," ${degree}, ${institution}, ${year}.`;
    }
    case 'website': {
      const { url = '', accessDate } = ref;
      const accessed = accessDate ? ` (accessed ${formatAccessDate(accessDate)})` : '';
      return `${prefix} ${authorStr}, "${title}," ${year}. [Online]. Available: ${url}${accessed}.`;
    }
    case 'report': {
      const { publisher = '', volume = '' } = ref;
      const vol = volume ? `, vol. ${volume}` : '';
      return `${prefix} ${authorStr}, "${title},"${vol} ${publisher}, ${year}.`;
    }
    default:
      return `${prefix} ${authorStr}, "${title}," ${year}.`;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Format a single reference in the given citation style.
 * @param {Object} ref - Reference object
 * @param {'apa'|'mla'|'chicago'|'ieee'} style
 * @param {number} [index=1] - Used by IEEE for the [N] prefix
 * @returns {string} Formatted citation text (may contain markdown italic markers)
 */
export function formatCitation(ref, style = 'apa', index = 1) {
  switch (style) {
    case 'mla':     return formatMla(ref);
    case 'chicago': return formatChicago(ref);
    case 'ieee':    return formatIeee(ref, index);
    default:        return formatApa(ref);
  }
}

/**
 * Format a short in-text citation.
 * APA/Chicago: (Smith, 2020) or (Smith, 2020, p. 42)
 * MLA: (Smith 2020) or (Smith 42)
 * IEEE: [1]
 * @param {Object} ref
 * @param {string} [page] - Optional page number
 * @param {'apa'|'mla'|'chicago'|'ieee'} style
 * @param {number} [index=1]
 */
export function formatInTextCitation(ref, page = '', style = 'apa', index = 1) {
  if (style === 'ieee') return `[${index}]`;

  const first = ref.authors?.[0];
  const { last } = parseAuthor(first || '');
  const authorPart = last || 'Unknown';
  const hasMultiple = (ref.authors || []).filter(Boolean).length > 1;
  const authorDisplay = hasMultiple ? `${authorPart} et al.` : authorPart;
  const year = ref.year || 'n.d.';

  if (style === 'mla') {
    return page ? `(${authorDisplay} ${page})` : `(${authorDisplay} ${year})`;
  }
  // APA and Chicago
  return page ? `(${authorDisplay}, ${year}, p. ${page})` : `(${authorDisplay}, ${year})`;
}

/**
 * Build a formatted bibliography for an array of references.
 * @param {Object[]} refs
 * @param {'apa'|'mla'|'chicago'|'ieee'} style
 * @returns {string} Newline-separated citation strings
 */
export function formatBibliography(refs, style = 'apa') {
  return refs
    .map((ref, i) => formatCitation(ref, style, i + 1))
    .join('\n\n');
}

/**
 * Return a short human-readable label for a reference,
 * e.g. "Smith (2020)" for use in lists.
 */
export function shortLabel(ref) {
  const first = ref.authors?.[0];
  const { last } = parseAuthor(first || '');
  const hasMultiple = (ref.authors || []).filter(Boolean).length > 1;
  const author = last || 'Unknown';
  const year = ref.year || 'n.d.';
  return hasMultiple ? `${author} et al. (${year})` : `${author} (${year})`;
}
