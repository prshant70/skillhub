import { describe, expect, it, vi } from 'vitest'

// The i18n config module performs side-effect-only initialization.
// We mock i18next to verify that init is called with expected config.

const initMock = vi.fn().mockReturnThis()
const useMock = vi.fn().mockReturnThis()

vi.mock('i18next', () => ({
  default: {
    use: useMock,
    init: initMock,
  },
}))

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}))

vi.mock('./locales/en.json', () => ({
  default: { greeting: 'Hello' },
}))

// Import triggers the side-effect initialization
await import('./config')

describe('i18n config', () => {
  it('registers react-i18next without a language detector', () => {
    expect(useMock).toHaveBeenCalledTimes(1)
  })

  it('pins the language to english', () => {
    expect(initMock).toHaveBeenCalledTimes(1)
    const initOptions = initMock.mock.calls[0][0]
    expect(initOptions.lng).toBe('en')
    expect(initOptions.fallbackLng).toBe('en')
  })

  it('ships english as the only bundled resource', () => {
    const initOptions = initMock.mock.calls[0][0]
    expect(Object.keys(initOptions.resources)).toEqual(['en'])
  })

  it('disables HTML escaping for React interpolation', () => {
    const initOptions = initMock.mock.calls[0][0]
    expect(initOptions.interpolation.escapeValue).toBe(false)
  })
})
