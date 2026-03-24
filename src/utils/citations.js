/**
 * Citation formatting utilities for APA, MLA, Chicago, and IEEE styles.
 *
 * Supported reference types: journal, book, website, conference
 */

/**
 * Format a reference in APA 7th edition style.
 * @param {Object} ref - Reference object
 * @returns {string} Formatted citation string
 */
export function formatAPA(ref) {
  if (!ref) return '';

  const {
    type,
    authors = [],
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    publisher,
    location,
    url,
    accessed,
    conference,
    editors,
  } = ref;

  const authorStr = _formatAuthorsAPA(authors);
  const yearStr = year ? `(${year})` : '(n.d.)';

  if (type === 'journal') {
    const parts = [authorStr, yearStr, `${title}.`];
    if (journal) {
      let journalPart = `*${journal}*`;
      if (volume) journalPart += `, *${volume}*`;
      if (issue) journalPart += `(${issue})`;
      if (pages) journalPart += `, ${pages}`;
      parts.push(journalPart + '.');
    }
    if (doi) parts.push(`https://doi.org/${doi}`);
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'book') {
    const parts = [authorStr, yearStr, `*${title}*.`];
    if (editors && editors.length > 0) {
      parts.splice(2, 0, `(${_formatEditorsAPA(editors)}, Eds.)`);
    }
    const pubParts = [];
    if (location) pubParts.push(location);
    if (publisher) pubParts.push(publisher);
    if (pubParts.length) parts.push(pubParts.join(': ') + '.');
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'website') {
    const parts = [authorStr, yearStr, `${title}.`];
    if (url) {
      const accessStr = accessed ? ` (Retrieved ${accessed})` : '';
      parts.push(`${url}${accessStr}`);
    }
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'conference') {
    const parts = [authorStr, yearStr, `${title}.`];
    if (conference) {
      let confPart = `*${conference}*`;
      if (pages) confPart += `, ${pages}`;
      parts.push(confPart + '.');
    }
    if (publisher) parts.push(publisher + '.');
    if (doi) parts.push(`https://doi.org/${doi}`);
    return parts.filter(Boolean).join(' ');
  }

  // Generic fallback
  return [authorStr, yearStr, title].filter(Boolean).join(' ');
}

/**
 * Format a reference in MLA 9th edition style.
 * @param {Object} ref - Reference object
 * @returns {string} Formatted citation string
 */
export function formatMLA(ref) {
  if (!ref) return '';

  const {
    type,
    authors = [],
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    publisher,
    url,
    accessed,
    conference,
  } = ref;

  const authorStr = _formatAuthorsMLA(authors);

  if (type === 'journal') {
    const parts = [authorStr, `"${title}."`, journal ? `*${journal}*` : null];
    const volIssueParts = [];
    if (volume) volIssueParts.push(`vol. ${volume}`);
    if (issue) volIssueParts.push(`no. ${issue}`);
    if (year) volIssueParts.push(year);
    if (volIssueParts.length) parts.push(volIssueParts.join(', ') + ',');
    if (pages) parts.push(`pp. ${pages}.`);
    if (doi) parts.push(`doi:${doi}.`);
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'book') {
    const parts = [authorStr, `*${title}*.`];
    if (publisher) parts.push(publisher + ',');
    if (year) parts.push(year + '.');
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'website') {
    const parts = [authorStr, `"${title}."`];
    if (publisher) parts.push(publisher + ',');
    if (year) parts.push(year + '.');
    if (url) parts.push(url + '.');
    if (accessed) parts.push(`Accessed ${accessed}.`);
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'conference') {
    const parts = [authorStr, `"${title}."`];
    if (conference) parts.push(`*${conference}*,`);
    if (year) parts.push(year + ',');
    if (pages) parts.push(`pp. ${pages}.`);
    return parts.filter(Boolean).join(' ');
  }

  return [authorStr, title, year].filter(Boolean).join('. ');
}

/**
 * Format a reference in Chicago 17th edition (Notes-Bibliography) style.
 * @param {Object} ref - Reference object
 * @returns {string} Formatted citation string
 */
export function formatChicago(ref) {
  if (!ref) return '';

  const {
    type,
    authors = [],
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    publisher,
    location,
    url,
    accessed,
    conference,
  } = ref;

  const authorStr = _formatAuthorsChicago(authors);

  if (type === 'journal') {
    const parts = [authorStr, `"${title}."`, journal ? `*${journal}*` : null];
    if (volume) parts.push(volume);
    if (issue) parts.push(`no. ${issue}`);
    if (year) parts.push(`(${year})`);
    if (pages) parts.push(`: ${pages}.`);
    if (doi) parts.push(`https://doi.org/${doi}.`);
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'book') {
    const parts = [authorStr, `*${title}*.`];
    const pubParts = [];
    if (location) pubParts.push(location);
    if (publisher) pubParts.push(publisher);
    if (year) pubParts.push(year);
    if (pubParts.length) parts.push(pubParts.join(': ') + '.');
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'website') {
    const parts = [authorStr, `"${title}."`];
    if (publisher) parts.push(publisher + '.');
    if (year || accessed) {
      const dateParts = [];
      if (year) dateParts.push(year);
      if (accessed) dateParts.push(`Accessed ${accessed}`);
      parts.push(dateParts.join('. ') + '.');
    }
    if (url) parts.push(url + '.');
    return parts.filter(Boolean).join(' ');
  }

  if (type === 'conference') {
    const parts = [authorStr, `"${title}."`];
    if (conference) parts.push(`In *${conference}*,`);
    if (pages) parts.push(`${pages}.`);
    if (publisher) parts.push(publisher + ',');
    if (year) parts.push(year + '.');
    return parts.filter(Boolean).join(' ');
  }

  return [authorStr, title, year].filter(Boolean).join('. ');
}

/**
 * Format a reference in IEEE style.
 * @param {Object} ref - Reference object
 * @param {number} [index=1] - Reference number in the bibliography
 * @returns {string} Formatted citation string
 */
export function formatIEEE(ref, index = 1) {
  if (!ref) return '';

  const {
    type,
    authors = [],
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    publisher,
    location,
    url,
    accessed,
    conference,
  } = ref;

  const authorStr = _formatAuthorsIEEE(authors);
  const prefix = `[${index}]`;

  if (type === 'journal') {
    const parts = [authorStr, `"${title},"`, journal ? `*${journal}*` : null];
    const volIssueParts = [];
    if (volume) volIssueParts.push(`vol. ${volume}`);
    if (issue) volIssueParts.push(`no. ${issue}`);
    if (pages) volIssueParts.push(`pp. ${pages}`);
    if (year) volIssueParts.push(year);
    if (volIssueParts.length) parts.push(volIssueParts.join(', ') + '.');
    if (doi) parts.push(`doi: ${doi}.`);
    return `${prefix} ${parts.filter(Boolean).join(' ')}`;
  }

  if (type === 'book') {
    const parts = [authorStr, `*${title}*.`];
    const pubParts = [];
    if (location) pubParts.push(location);
    if (publisher) pubParts.push(publisher);
    if (year) pubParts.push(year);
    if (pubParts.length) parts.push(pubParts.join(': ') + '.');
    return `${prefix} ${parts.filter(Boolean).join(' ')}`;
  }

  if (type === 'website') {
    const parts = [authorStr, `"${title}."`, url ? `[Online]. Available: ${url}` : null];
    if (accessed) parts.push(`[Accessed: ${accessed}].`);
    return `${prefix} ${parts.filter(Boolean).join(' ')}`;
  }

  if (type === 'conference') {
    const parts = [authorStr, `"${title},"`, conference ? `in *${conference}*` : null];
    if (location) parts.push(location + ',');
    if (year) parts.push(year + ',');
    if (pages) parts.push(`pp. ${pages}.`);
    if (doi) parts.push(`doi: ${doi}.`);
    return `${prefix} ${parts.filter(Boolean).join(' ')}`;
  }

  return `${prefix} ${[authorStr, title, year].filter(Boolean).join('. ')}`;
}

/**
 * Format a reference in a given citation style.
 * @param {Object} ref - Reference object
 * @param {'apa'|'mla'|'chicago'|'ieee'} style - Citation style
 * @param {number} [index=1] - Used only for IEEE numbering
 * @returns {string} Formatted citation string
 */
export function formatCitation(ref, style, index = 1) {
  switch (style) {
    case 'apa':     return formatAPA(ref);
    case 'mla':     return formatMLA(ref);
    case 'chicago': return formatChicago(ref);
    case 'ieee':    return formatIEEE(ref, index);
    default:        return formatAPA(ref);
  }
}

/** Supported citation styles */
export const CITATION_STYLES = [
  { id: 'apa',     label: 'APA 7th' },
  { id: 'mla',     label: 'MLA 9th' },
  { id: 'chicago', label: 'Chicago 17th' },
  { id: 'ieee',    label: 'IEEE' },
];

/** Supported reference types */
export const REFERENCE_TYPES = [
  { id: 'journal',    label: 'Journal Article' },
  { id: 'book',       label: 'Book' },
  { id: 'website',    label: 'Website' },
  { id: 'conference', label: 'Conference Paper' },
];

// ── Private helpers ────────────────────────────────────────────────────────────

function _formatAuthorsAPA(authors) {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) return _toAPA(authors[0]);
  if (authors.length <= 20) {
    const last = authors[authors.length - 1];
    return authors.slice(0, -1).map(_toAPA).join(', ') + ', & ' + _toAPA(last);
  }
  return authors.slice(0, 19).map(_toAPA).join(', ') + ', ... ' + _toAPA(authors[authors.length - 1]);
}

function _toAPA(author) {
  if (!author) return '';
  const { lastName, firstName } = _parseName(author);
  if (!firstName) return lastName;
  const initials = firstName.split(/\s+/).map((p) => p[0].toUpperCase() + '.').join(' ');
  return `${lastName}, ${initials}`;
}

function _formatEditorsAPA(editors) {
  return editors.map(_toAPA).join(', & ');
}

function _formatAuthorsMLA(authors) {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) {
    const { lastName, firstName } = _parseName(authors[0]);
    return firstName ? `${lastName}, ${firstName}` : lastName;
  }
  const first = authors[0];
  const { lastName, firstName } = _parseName(first);
  const firstStr = firstName ? `${lastName}, ${firstName}` : lastName;
  if (authors.length === 2) return `${firstStr}, and ${authors[1]}`;
  return `${firstStr}, et al.`;
}

function _formatAuthorsChicago(authors) {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) {
    const { lastName, firstName } = _parseName(authors[0]);
    return firstName ? `${lastName}, ${firstName}` : lastName;
  }
  const first = authors[0];
  const { lastName, firstName } = _parseName(first);
  const firstStr = firstName ? `${lastName}, ${firstName}` : lastName;
  const rest = authors.slice(1).join(', ');
  return `${firstStr}, and ${rest}`;
}

function _formatAuthorsIEEE(authors) {
  if (!authors || authors.length === 0) return '';
  return authors
    .map((a) => {
      const { lastName, firstName } = _parseName(a);
      if (!firstName) return lastName;
      const initials = firstName.split(/\s+/).map((p) => p[0].toUpperCase() + '.').join(' ');
      return `${initials} ${lastName}`;
    })
    .join(', ');
}

/**
 * Parse an author string into lastName and firstName.
 * Accepts "Last, First" or "First Last" formats.
 */
function _parseName(author) {
  if (!author || typeof author !== 'string') return { lastName: String(author || ''), firstName: '' };
  const trimmed = author.trim();
  if (trimmed.includes(',')) {
    const [last, ...rest] = trimmed.split(',');
    return { lastName: last.trim(), firstName: rest.join(',').trim() };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { lastName: parts[0], firstName: '' };
  return { lastName: parts[parts.length - 1], firstName: parts.slice(0, -1).join(' ') };
}
