import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } }
    )

    expect(result.current).toBe('first')

    // Change value
    rerender({ value: 'second', delay: 300 })
    expect(result.current).toBe('first') // Still old value

    // Advance time
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current).toBe('second')
  })

  it('should cancel previous debounce on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'third' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'fourth' })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('fourth')
  })

  it('should work with different data types', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 123 } }
    )

    expect(result.current).toBe(123)

    rerender({ value: 456 })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(456)
  })

  it('should handle custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('test')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('updated')
  })
})
