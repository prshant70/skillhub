/** @vitest-environment jsdom */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import en from '@/i18n/locales/en.json'

const api = vi.hoisted(() => ({ getVisibility: vi.fn(), changeVisibility: vi.fn() }))
vi.mock('@/api/client', () => ({ skillLifecycleApi: api }))
vi.mock('@/shared/lib/toast', () => ({ toast: { success: vi.fn() } }))
vi.mock('@/shared/ui/select', () => ({
  Select: ({ value, onValueChange, children, disabled }: { value: string; onValueChange: (value: string) => void; children: ReactNode; disabled?: boolean }) =>
    <select value={value} onChange={(event) => onValueChange(event.target.value)} disabled={disabled}>{children}</select>,
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: ({ value, children }: { value: string; children: ReactNode }) => <option value={value}>{children}</option>,
}))
import { SkillVisibilityDialog } from './skill-visibility-dialog'

async function mount(visibility = 'PUBLIC') {
  const i18n = createInstance()
  await i18n.init({
    lng: 'en',
    fallbackLng: false,
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<I18nextProvider i18n={i18n}><QueryClientProvider client={client}><SkillVisibilityDialog namespace="team" slug="foo" visibility={visibility} /></QueryClientProvider></I18nextProvider>)
  fireEvent.click(screen.getByRole('button', { name: String(i18n.t('skillVisibility.title')) }))
}

describe('SkillVisibilityDialog', () => {
  afterEach(() => { cleanup(); vi.clearAllMocks() })

  it('shows usable dialog action labels without translation fallback', async () => {
    const [cancel, save] = ['Cancel', 'Save']
    api.getVisibility.mockResolvedValue({ visibility: 'PUBLIC' })
    await mount('PUBLIC')
    expect(screen.getByRole('button', { name: cancel })).toBeTruthy()
    expect(screen.getByRole('button', { name: save })).toBeTruthy()
    expect(screen.queryByText(/^(common|dialog|profile)\.(cancel|save)$/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: cancel }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(api.changeVisibility).not.toHaveBeenCalled()
  })

  it('changes only visibility without uploading a new package', async () => {
    api.getVisibility.mockResolvedValue({ visibility: 'PUBLIC' })
    api.changeVisibility.mockResolvedValue({ visibility: 'PRIVATE' })
    await mount()
    await waitFor(() => expect(api.getVisibility).toHaveBeenCalledWith('team', 'foo'))
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PRIVATE' } })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' }).hasAttribute('disabled')).toBe(false))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(api.changeVisibility).toHaveBeenCalledWith('team', 'foo', 'PRIVATE'))
  })

  it('explains that wider access requires review', async () => {
    api.getVisibility.mockResolvedValue({ visibility: 'PRIVATE' })
    await mount('PRIVATE')
    await waitFor(() => expect(api.getVisibility).toHaveBeenCalled())
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PUBLIC' } })
    expect(screen.getByText(en.skillVisibility.expanding)).toBeTruthy()
    expect(screen.getByRole('button', { name: en.skillVisibility.submit })).toBeTruthy()
  })

  it('reloads a pending request and prevents duplicate submission', async () => {
    api.getVisibility.mockResolvedValue({ visibility: 'PRIVATE', requestedVisibility: 'PUBLIC', reviewTaskId: 42 })
    await mount('PRIVATE')
    await screen.findByRole('status')
    expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: 'Save' }).hasAttribute('disabled')).toBe(true)
    expect(api.changeVisibility).not.toHaveBeenCalled()
  })

  it('does not enable saving when current state cannot be read', async () => {
    api.getVisibility.mockRejectedValue(new Error('unavailable'))
    await mount()
    await screen.findByRole('alert')
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PRIVATE' } })
    expect(screen.getByRole('button', { name: 'Save' }).hasAttribute('disabled')).toBe(true)
  })
})
