import { describe, it, expect } from 'vitest'
import {
  formatAPA,
  formatMLA,
  formatChicago,
  formatIEEE,
  formatCitation,
  CITATION_STYLES,
  REFERENCE_TYPES,
} from '../utils/citations'

// ── Sample fixtures ────────────────────────────────────────────────────────────

const journalRef = {
  type: 'journal',
  authors: ['Smith, John', 'Doe, Jane'],
  title: 'A Study of AI',
  year: '2023',
  journal: 'Nature',
  volume: '12',
  issue: '3',
  pages: '100-120',
  doi: '10.1000/xyz123',
}

const bookRef = {
  type: 'book',
  authors: ['Brown, Alice'],
  title: 'Introduction to React',
  year: '2022',
  publisher: 'Tech Press',
  location: 'New York',
}

const websiteRef = {
  type: 'website',
  authors: ['Lee, Bob'],
  title: 'Understanding Neural Networks',
  year: '2024',
  url: 'https://example.com/article',
  publisher: 'Example Blog',
  accessed: 'March 1, 2024',
}

const conferenceRef = {
  type: 'conference',
  authors: ['White, Carol'],
  title: 'Deep Learning at Scale',
  year: '2023',
  conference: 'International Conference on Machine Learning',
  pages: '500-510',
  doi: '10.1000/conf456',
}

const singleAuthorRef = {
  type: 'journal',
  authors: ['Garcia, Maria'],
  title: 'Quantum Algorithms',
  year: '2021',
  journal: 'Science',
}

const noAuthorRef = {
  type: 'website',
  authors: [],
  title: 'No Author Article',
  year: '2020',
  url: 'https://noauthor.com',
}

// ── formatAPA ─────────────────────────────────────────────────────────────────

describe('formatAPA', () => {
  it('returns empty string for null/undefined input', () => {
    expect(formatAPA(null)).toBe('')
    expect(formatAPA(undefined)).toBe('')
  })

  it('formats a journal article correctly', () => {
    const result = formatAPA(journalRef)
    expect(result).toContain('Smith, J.')
    expect(result).toContain('Doe, J.')
    expect(result).toContain('(2023)')
    expect(result).toContain('A Study of AI')
    expect(result).toContain('Nature')
    expect(result).toContain('12')
    expect(result).toContain('(3)')
    expect(result).toContain('100-120')
    expect(result).toContain('https://doi.org/10.1000/xyz123')
  })

  it('uses & between last two authors in APA', () => {
    const result = formatAPA(journalRef)
    expect(result).toContain('&')
  })

  it('formats a book correctly', () => {
    const result = formatAPA(bookRef)
    expect(result).toContain('Brown, A.')
    expect(result).toContain('(2022)')
    expect(result).toContain('Introduction to React')
    expect(result).toContain('Tech Press')
    expect(result).toContain('New York')
  })

  it('formats a website correctly', () => {
    const result = formatAPA(websiteRef)
    expect(result).toContain('Lee, B.')
    expect(result).toContain('(2024)')
    expect(result).toContain('Understanding Neural Networks')
    expect(result).toContain('https://example.com/article')
  })

  it('formats a conference paper correctly', () => {
    const result = formatAPA(conferenceRef)
    expect(result).toContain('White, C.')
    expect(result).toContain('(2023)')
    expect(result).toContain('Deep Learning at Scale')
    expect(result).toContain('International Conference on Machine Learning')
  })

  it('handles single author without & separator', () => {
    const result = formatAPA(singleAuthorRef)
    expect(result).not.toContain('&')
    expect(result).toContain('Garcia, M.')
  })

  it('handles empty authors array', () => {
    const result = formatAPA(noAuthorRef)
    expect(result).toContain('No Author Article')
    expect(typeof result).toBe('string')
  })

  it('uses (n.d.) when year is missing', () => {
    const ref = { type: 'journal', authors: ['Smith, John'], title: 'Test' }
    const result = formatAPA(ref)
    expect(result).toContain('(n.d.)')
  })
})

// ── formatMLA ─────────────────────────────────────────────────────────────────

describe('formatMLA', () => {
  it('returns empty string for null/undefined input', () => {
    expect(formatMLA(null)).toBe('')
    expect(formatMLA(undefined)).toBe('')
  })

  it('formats a journal article correctly', () => {
    const result = formatMLA(journalRef)
    expect(result).toContain('"A Study of AI."')
    expect(result).toContain('Nature')
    expect(result).toContain('vol. 12')
    expect(result).toContain('no. 3')
    expect(result).toContain('pp. 100-120')
  })

  it('uses "et al." for 3+ authors in MLA', () => {
    const multiRef = {
      ...journalRef,
      authors: ['Smith, John', 'Doe, Jane', 'Lee, Bob'],
    }
    const result = formatMLA(multiRef)
    expect(result).toContain('et al.')
  })

  it('formats a book correctly', () => {
    const result = formatMLA(bookRef)
    expect(result).toContain('Introduction to React')
    expect(result).toContain('Tech Press')
    expect(result).toContain('2022')
  })

  it('formats a website with access date', () => {
    const result = formatMLA(websiteRef)
    expect(result).toContain('Understanding Neural Networks')
    expect(result).toContain('https://example.com/article')
    expect(result).toContain('Accessed March 1, 2024')
  })
})

// ── formatChicago ─────────────────────────────────────────────────────────────

describe('formatChicago', () => {
  it('returns empty string for null/undefined input', () => {
    expect(formatChicago(null)).toBe('')
    expect(formatChicago(undefined)).toBe('')
  })

  it('formats a journal article correctly', () => {
    const result = formatChicago(journalRef)
    expect(result).toContain('"A Study of AI."')
    expect(result).toContain('Nature')
    expect(result).toContain('(2023)')
    expect(result).toContain('100-120')
  })

  it('formats a book correctly', () => {
    const result = formatChicago(bookRef)
    expect(result).toContain('Introduction to React')
    expect(result).toContain('Tech Press')
    expect(result).toContain('New York')
    expect(result).toContain('2022')
  })

  it('formats a conference paper correctly', () => {
    const result = formatChicago(conferenceRef)
    expect(result).toContain('Deep Learning at Scale')
    expect(result).toContain('International Conference on Machine Learning')
  })
})

// ── formatIEEE ────────────────────────────────────────────────────────────────

describe('formatIEEE', () => {
  it('returns empty string for null/undefined input', () => {
    expect(formatIEEE(null)).toBe('')
    expect(formatIEEE(undefined)).toBe('')
  })

  it('includes reference number prefix', () => {
    const result = formatIEEE(journalRef, 3)
    expect(result.startsWith('[3]')).toBe(true)
  })

  it('defaults to index 1', () => {
    const result = formatIEEE(journalRef)
    expect(result.startsWith('[1]')).toBe(true)
  })

  it('formats author initials before last name', () => {
    const result = formatIEEE(singleAuthorRef)
    expect(result).toContain('M. Garcia')
  })

  it('formats a journal article correctly', () => {
    const result = formatIEEE(journalRef, 1)
    expect(result).toContain('"A Study of AI,"')
    expect(result).toContain('vol. 12')
    expect(result).toContain('no. 3')
    expect(result).toContain('pp. 100-120')
    expect(result).toContain('doi: 10.1000/xyz123')
  })

  it('formats a website with online available marker', () => {
    const result = formatIEEE(websiteRef, 2)
    expect(result).toContain('[Online]. Available: https://example.com/article')
    expect(result).toContain('[Accessed: March 1, 2024]')
  })
})

// ── formatCitation dispatcher ─────────────────────────────────────────────────

describe('formatCitation', () => {
  it('routes to formatAPA by default', () => {
    const apa = formatCitation(journalRef, 'apa')
    const direct = formatAPA(journalRef)
    expect(apa).toBe(direct)
  })

  it('routes to formatMLA', () => {
    const mla = formatCitation(journalRef, 'mla')
    const direct = formatMLA(journalRef)
    expect(mla).toBe(direct)
  })

  it('routes to formatChicago', () => {
    const chicago = formatCitation(journalRef, 'chicago')
    const direct = formatChicago(journalRef)
    expect(chicago).toBe(direct)
  })

  it('routes to formatIEEE with index', () => {
    const ieee = formatCitation(journalRef, 'ieee', 5)
    const direct = formatIEEE(journalRef, 5)
    expect(ieee).toBe(direct)
  })

  it('falls back to APA for unknown style', () => {
    const unknown = formatCitation(journalRef, 'harvard')
    const apa = formatAPA(journalRef)
    expect(unknown).toBe(apa)
  })
})

// ── CITATION_STYLES & REFERENCE_TYPES constants ────────────────────────────────

describe('CITATION_STYLES', () => {
  it('exports 4 citation styles', () => {
    expect(CITATION_STYLES).toHaveLength(4)
  })

  it('includes apa, mla, chicago, ieee ids', () => {
    const ids = CITATION_STYLES.map((s) => s.id)
    expect(ids).toContain('apa')
    expect(ids).toContain('mla')
    expect(ids).toContain('chicago')
    expect(ids).toContain('ieee')
  })

  it('each style has id and label', () => {
    CITATION_STYLES.forEach((s) => {
      expect(typeof s.id).toBe('string')
      expect(typeof s.label).toBe('string')
    })
  })
})

describe('REFERENCE_TYPES', () => {
  it('exports 4 reference types', () => {
    expect(REFERENCE_TYPES).toHaveLength(4)
  })

  it('includes journal, book, website, conference ids', () => {
    const ids = REFERENCE_TYPES.map((t) => t.id)
    expect(ids).toContain('journal')
    expect(ids).toContain('book')
    expect(ids).toContain('website')
    expect(ids).toContain('conference')
  })
})
