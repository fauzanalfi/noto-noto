import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  generateId, 
  formatDate, 
  formatFullDate, 
  extractSnippet,
  debounce 
} from './utils'

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
    expect(typeof id1).toBe('string')
    expect(id1.length).toBeGreaterThan(0)
  })
})

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  it('should return "Just now" for recent dates', () => {
    const date = new Date('2024-01-15T11:59:30Z').toISOString()
    expect(formatDate(date)).toBe('Just now')
  })

  it('should return minutes for dates within the hour', () => {
    const date = new Date('2024-01-15T11:30:00Z').toISOString()
    expect(formatDate(date)).toBe('30m ago')
  })

  it('should return hours for dates within the day', () => {
    const date = new Date('2024-01-15T09:00:00Z').toISOString()
    expect(formatDate(date)).toBe('3h ago')
  })

  it('should return days for dates within the week', () => {
    const date = new Date('2024-01-13T12:00:00Z').toISOString()
    expect(formatDate(date)).toBe('2d ago')
  })

  it('should return formatted date for older dates', () => {
    const date = new Date('2024-01-01T12:00:00Z').toISOString()
    const result = formatDate(date)
    expect(result).toContain('Jan')
    expect(result).toContain('1')
  })
})

describe('formatFullDate', () => {
  it('should format full date with time', () => {
    const date = new Date('2024-01-15T14:30:00Z').toISOString()
    const result = formatFullDate(date)
    expect(result).toContain('2024')
    expect(result).toContain('Jan')
  })
})

describe('extractSnippet', () => {
  it('should return empty string for falsy input', () => {
    expect(extractSnippet('')).toBe('')
    expect(extractSnippet(null)).toBe('')
    expect(extractSnippet(undefined)).toBe('')
  })

  it('should remove markdown headers', () => {
    const result = extractSnippet('# Heading\nContent')
    expect(result).toBe('Heading Content')
  })

  it('should remove bold formatting', () => {
    const result = extractSnippet('**bold text**')
    expect(result).toBe('bold text')
  })

  it('should remove italic formatting', () => {
    const result = extractSnippet('*italic text*')
    expect(result).toBe('italic text')
  })

  it('should remove code blocks', () => {
    const result = extractSnippet('Text `code` more')
    expect(result).toBe('Text  more')
  })

  it('should convert links to text', () => {
    const result = extractSnippet('[link text](https://example.com)')
    expect(result).toBe('link text')
  })

  it('should remove images', () => {
    const result = extractSnippet('![alt text](image.png)')
    expect(result).toBe('')
  })

  it('should truncate to max length', () => {
    const longText = 'a'.repeat(200)
    const result = extractSnippet(longText, 50)
    expect(result.length).toBe(50)
  })

  it('should replace newlines with spaces', () => {
    const result = extractSnippet('line1\nline2\nline3')
    expect(result).toBe('line1 line2 line3')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should delay function execution', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should cancel previous calls', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments correctly', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('test', 123)
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledWith('test', 123)
  })
})
