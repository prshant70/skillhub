import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n/config'
import { formatRelativeTime } from './format-relative-time'

const now = new Date('2026-06-15T12:00:00Z')
const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString()

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })
  afterEach(() => vi.useRealTimers())

  it.each([
    [0, 'just now'], [0.5, 'just now'], [1, '1m'], [59, '59m'],
    [60, '1h'], [1439, '23h'], [1440, '1d'], [29 * 1440, '29d'],
  ])('formats %s minutes ago', (minutes, expected) => {
    expect(formatRelativeTime(ago(minutes), 'en')).toBe(expected)
  })

  it('falls back to a plain date for anything older than a month', () => {
    const date = ago(30 * 1440)
    expect(formatRelativeTime(date, 'en')).toBe(new Date(date).toLocaleDateString('en'))
  })

  it.each([0, 5, 60, 1440, 30 * 1440])('wraps the formatted time in the notification suffix (%s minutes)', (minutes) => {
    const time = formatRelativeTime(ago(minutes), 'en')
    expect(i18n.getFixedT('en')('notification.timeAgo', { time })).toBe(`${time} ago`)
  })
})
