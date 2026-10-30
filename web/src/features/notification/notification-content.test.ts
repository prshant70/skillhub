import { describe, expect, it } from 'vitest'
import { resolveNotificationDisplay } from './notification-content'

describe('resolveNotificationDisplay', () => {

  it('renders review submitted content in English', () => {
    const display = resolveNotificationDisplay({
      category: 'REVIEW',
      eventType: 'REVIEW_SUBMITTED',
      title: 'New review submitted for: Calendar',
      bodyJson: JSON.stringify({ skillName: 'Calendar', version: '1.0.0' }),
      status: 'UNREAD',
      createdAt: '2026-03-20T00:00:00Z',
      id: 1,
    }, 'en')

    expect(display.title).toBe('Review submitted')
    expect(display.description).toContain('Calendar')
    expect(display.description).toContain('1.0.0')
  })

  it.each([
    ['REVIEW_SUBMITTED', "Review submitted"],
    ['REVIEW_APPROVED', "Review approved"],
    ['REVIEW_REJECTED', "Review rejected"],
    ['PROMOTION_SUBMITTED', "Promotion submitted"],
    ['PROMOTION_APPROVED', "Promotion approved"],
    ['PROMOTION_REJECTED', "Promotion rejected"],
    ['REPORT_SUBMITTED', "Report submitted"],
    ['REPORT_RESOLVED', "Report resolved"],
    ['SKILL_PUBLISHED', "Skill published"],
    ['SUBSCRIPTION_NEW_VERSION', "Subscribed skill updated"],
    ['SUBSCRIPTION_VERSION_YANKED', "Subscribed skill version yanked"],
  ])('renders %s with the english title', (eventType, title) => {
    const display = resolveNotificationDisplay({
      id: 1, category: 'REVIEW', eventType, title: 'Server title', status: 'UNREAD',
      createdAt: '2026-03-20T00:00:00Z',
      bodyJson: JSON.stringify({ skillName: 'Calendar', version: '1.0.0' }),
    }, 'en')
    expect(display.title).toBe(title)
    expect(display.description).toContain('Calendar')
    if (!eventType.startsWith('REPORT_')) expect(display.description).toContain('(1.0.0)')
  })

  it.each([undefined, 'invalid JSON', '{}', 'null'])('keeps a localized title with an absent or malformed body (%s)', (bodyJson) => {
    expect(resolveNotificationDisplay({
      id: 1, category: 'REVIEW', eventType: 'REVIEW_APPROVED', title: 'Server title',
      status: 'UNREAD', createdAt: '2026-03-20T00:00:00Z', bodyJson,
    }, 'en')).toEqual({ title: "Review approved", description: '' })
  })

  it('omits version parentheses when a notification has no version', () => {
    const display = resolveNotificationDisplay({
      id: 1, category: 'REVIEW', eventType: 'REVIEW_APPROVED', title: 'Server title',
      status: 'UNREAD', createdAt: '2026-03-20T00:00:00Z',
      bodyJson: JSON.stringify({ skillName: 'Calendar' }),
    }, 'en')
    expect(display.description).toBe("Calendar was approved.")
  })

  it('falls back to the backend title when the event type is unsupported', () => {
    const display = resolveNotificationDisplay({
      category: 'PUBLISH',
      eventType: 'CUSTOM_EVENT',
      title: 'Backend supplied title',
      status: 'UNREAD',
      createdAt: '2026-03-20T00:00:00Z',
      id: 2,
    }, 'en')

    expect(display.title).toBe('Backend supplied title')
    expect(display.description).toBe('')
  })
})
