import { describe, it, expect } from 'vitest';
import {
  parseAuthor,
  formatCitation,
  formatInTextCitation,
  formatBibliography,
  shortLabel,
  REFERENCE_TYPES,
  CITATION_STYLES,
} from './citations';

// ── Sample references ─────────────────────────────────────────────────────────

const articleRef = {
  id: '1',
  type: 'article',
  title: 'Attention Is All You Need',
  authors: ['Vaswani, Ashish', 'Shazeer, Noam', 'Parmar, Niki'],
  year: '2017',
  journal: 'Advances in Neural Information Processing Systems',
  volume: '30',
  issue: '',
  pages: '5998–6008',
  doi: '10.48550/arXiv.1706.03762',
  createdAt: '',
  updatedAt: '',
};

const bookRef = {
  id: '2',
  type: 'book',
  title: 'The Elements of Statistical Learning',
  authors: ['Hastie, Trevor', 'Tibshirani, Robert', 'Friedman, Jerome'],
  year: '2009',
  publisher: 'Springer',
  location: 'New York',
  edition: '2nd',
  createdAt: '',
  updatedAt: '',
};

const thesisRef = {
  id: '3',
  type: 'thesis',
  title: 'Deep Residual Learning for Image Recognition',
  authors: ['He, Kaiming'],
  year: '2016',
  institution: 'Microsoft Research',
  degree: 'PhD dissertation',
  createdAt: '',
  updatedAt: '',
};

const websiteRef = {
  id: '4',
  type: 'website',
  title: 'React Documentation',
  authors: ['React Team'],
  year: '2024',
  url: 'https://react.dev',
  websiteName: 'React',
  accessDate: '2024-03-01',
  createdAt: '',
  updatedAt: '',
};

const conferenceRef = {
  id: '5',
  type: 'conference',
  title: 'ImageNet Classification with Deep Convolutional Neural Networks',
  authors: ['Krizhevsky, Alex', 'Sutskever, Ilya', 'Hinton, Geoffrey E.'],
  year: '2012',
  conference: 'Advances in Neural Information Processing Systems (NeurIPS)',
  pages: '1097–1105',
  createdAt: '',
  updatedAt: '',
};

// ── parseAuthor ───────────────────────────────────────────────────────────────

describe('parseAuthor', () => {
  it('parses "LastName, FirstName" format', () => {
    const { last, first, initials } = parseAuthor('Smith, John');
    expect(last).toBe('Smith');
    expect(first).toBe('John');
    expect(initials).toBe('J.');
  });

  it('parses "FirstName LastName" format', () => {
    const { last, first } = parseAuthor('John Smith');
    expect(last).toBe('Smith');
    expect(first).toBe('John');
  });

  it('handles "LastName, First Middle" with initials', () => {
    const { initials } = parseAuthor('Vaswani, Ashish Kumar');
    expect(initials).toBe('A. K.');
  });

  it('returns empty strings for empty input', () => {
    const { last, first, initials } = parseAuthor('');
    expect(last).toBe('');
    expect(first).toBe('');
    expect(initials).toBe('');
  });

  it('handles single-word name', () => {
    const { last } = parseAuthor('Shakespeare');
    expect(last).toBe('Shakespeare');
  });
});

// ── APA formatting ────────────────────────────────────────────────────────────

describe('formatCitation APA', () => {
  it('formats a journal article', () => {
    const result = formatCitation(articleRef, 'apa');
    expect(result).toContain('Vaswani');
    expect(result).toContain('2017');
    expect(result).toContain('Attention Is All You Need');
    expect(result).toContain('Advances in Neural Information Processing Systems');
    expect(result).toContain('doi.org');
  });

  it('includes & for two-author APA', () => {
    const twoAuthor = { ...articleRef, authors: ['Smith, John', 'Doe, Jane'] };
    const result = formatCitation(twoAuthor, 'apa');
    expect(result).toContain('&');
  });

  it('formats a book', () => {
    const result = formatCitation(bookRef, 'apa');
    expect(result).toContain('Hastie');
    expect(result).toContain('2009');
    expect(result).toContain('Springer');
    expect(result).toContain('2nd ed.');
  });

  it('formats a thesis', () => {
    const result = formatCitation(thesisRef, 'apa');
    expect(result).toContain('He');
    expect(result).toContain('PhD dissertation');
    expect(result).toContain('Microsoft Research');
  });

  it('formats a website', () => {
    const result = formatCitation(websiteRef, 'apa');
    expect(result).toContain('React Documentation');
    expect(result).toContain('react.dev');
  });

  it('formats a conference paper', () => {
    const result = formatCitation(conferenceRef, 'apa');
    expect(result).toContain('Krizhevsky');
    expect(result).toContain('NeurIPS');
    expect(result).toContain('2012');
  });

  it('uses "n.d." when year is missing', () => {
    const noYear = { ...articleRef, year: '' };
    const result = formatCitation(noYear, 'apa');
    expect(result).toContain('n.d.');
  });

  it('falls back to "Unknown Author" when authors array is empty', () => {
    const noAuth = { ...articleRef, authors: [] };
    const result = formatCitation(noAuth, 'apa');
    expect(result).toContain('Unknown Author');
  });
});

// ── MLA formatting ────────────────────────────────────────────────────────────

describe('formatCitation MLA', () => {
  it('formats a journal article', () => {
    const result = formatCitation(articleRef, 'mla');
    expect(result).toContain('Vaswani');
    expect(result).toContain('"Attention Is All You Need."');
  });

  it('uses et al for 3+ authors', () => {
    const result = formatCitation(articleRef, 'mla');
    expect(result).toContain('et al');
  });

  it('formats a book', () => {
    const result = formatCitation(bookRef, 'mla');
    expect(result).toContain('Springer');
    expect(result).toContain('2nd ed.');
  });
});

// ── Chicago formatting ────────────────────────────────────────────────────────

describe('formatCitation Chicago', () => {
  it('formats a journal article', () => {
    const result = formatCitation(articleRef, 'chicago');
    expect(result).toContain('Vaswani');
    expect(result).toContain('2017');
    expect(result).toContain('"Attention Is All You Need."');
  });

  it('formats a book with location and publisher', () => {
    const result = formatCitation(bookRef, 'chicago');
    expect(result).toContain('New York');
    expect(result).toContain('Springer');
  });

  it('formats a thesis', () => {
    const result = formatCitation(thesisRef, 'chicago');
    expect(result).toContain('PhD dissertation');
  });
});

// ── IEEE formatting ───────────────────────────────────────────────────────────

describe('formatCitation IEEE', () => {
  it('formats a journal article with [1] prefix', () => {
    const result = formatCitation(articleRef, 'ieee', 1);
    expect(result).toMatch(/^\[1\]/);
    expect(result).toContain('Vaswani');
    expect(result).toContain('"Attention Is All You Need,"');
  });

  it('uses custom index', () => {
    const result = formatCitation(articleRef, 'ieee', 5);
    expect(result).toMatch(/^\[5\]/);
  });

  it('uses et al for 4+ authors', () => {
    const manyAuthors = {
      ...articleRef,
      authors: ['Smith, A', 'Jones, B', 'Lee, C', 'Brown, D'],
    };
    const result = formatCitation(manyAuthors, 'ieee', 1);
    expect(result).toContain('et al');
  });

  it('formats a conference paper', () => {
    const result = formatCitation(conferenceRef, 'ieee', 2);
    expect(result).toMatch(/^\[2\]/);
    expect(result).toContain('in *');
  });
});

// ── formatInTextCitation ──────────────────────────────────────────────────────

describe('formatInTextCitation', () => {
  it('returns (Author, Year) for APA without page', () => {
    const result = formatInTextCitation(articleRef, '', 'apa', 1);
    expect(result).toBe('(Vaswani et al., 2017)');
  });

  it('returns (Author, Year, p. N) for APA with page', () => {
    const result = formatInTextCitation(articleRef, '42', 'apa', 1);
    expect(result).toBe('(Vaswani et al., 2017, p. 42)');
  });

  it('returns (Author Year) for MLA without page', () => {
    const result = formatInTextCitation(articleRef, '', 'mla', 1);
    expect(result).toBe('(Vaswani et al. 2017)');
  });

  it('returns (Author Page) for MLA with page', () => {
    const result = formatInTextCitation(articleRef, '99', 'mla', 1);
    expect(result).toBe('(Vaswani et al. 99)');
  });

  it('returns [N] for IEEE', () => {
    expect(formatInTextCitation(articleRef, '', 'ieee', 3)).toBe('[3]');
    expect(formatInTextCitation(articleRef, '5', 'ieee', 7)).toBe('[7]');
  });

  it('handles single author without et al.', () => {
    const result = formatInTextCitation(thesisRef, '', 'apa', 1);
    expect(result).toBe('(He, 2016)');
    expect(result).not.toContain('et al');
  });

  it('handles missing year with n.d.', () => {
    const noYear = { ...thesisRef, year: '' };
    const result = formatInTextCitation(noYear, '', 'apa', 1);
    expect(result).toBe('(He, n.d.)');
  });
});

// ── formatBibliography ────────────────────────────────────────────────────────

describe('formatBibliography', () => {
  it('joins multiple citations with double newline', () => {
    const result = formatBibliography([articleRef, bookRef], 'apa');
    expect(result).toContain('Vaswani');
    expect(result).toContain('Hastie');
    expect(result.split('\n\n').length).toBe(2);
  });

  it('returns empty string for empty array', () => {
    expect(formatBibliography([], 'apa')).toBe('');
  });
});

// ── shortLabel ────────────────────────────────────────────────────────────────

describe('shortLabel', () => {
  it('returns "Last (Year)" for single author', () => {
    expect(shortLabel(thesisRef)).toBe('He (2016)');
  });

  it('returns "Last et al. (Year)" for multiple authors', () => {
    expect(shortLabel(articleRef)).toBe('Vaswani et al. (2017)');
  });

  it('uses Unknown when authors is empty', () => {
    expect(shortLabel({ ...articleRef, authors: [] })).toBe('Unknown (2017)');
  });

  it('uses n.d. when year is missing', () => {
    expect(shortLabel({ ...thesisRef, year: '' })).toBe('He (n.d.)');
  });
});

// ── Constants ─────────────────────────────────────────────────────────────────

describe('REFERENCE_TYPES and CITATION_STYLES', () => {
  it('exports 6 reference types', () => {
    expect(REFERENCE_TYPES).toHaveLength(6);
    const ids = REFERENCE_TYPES.map((t) => t.id);
    expect(ids).toContain('article');
    expect(ids).toContain('book');
    expect(ids).toContain('thesis');
    expect(ids).toContain('website');
  });

  it('exports 4 citation styles', () => {
    expect(CITATION_STYLES).toHaveLength(4);
    const ids = CITATION_STYLES.map((s) => s.id);
    expect(ids).toContain('apa');
    expect(ids).toContain('mla');
    expect(ids).toContain('chicago');
    expect(ids).toContain('ieee');
  });
});
