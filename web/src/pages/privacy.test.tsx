import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PrivacyPolicyPage } from './privacy'

describe('PrivacyPolicyPage', () => {
  it('renders the english document', () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />)

    expect(html).toContain('Privacy Policy')
    expect(html).toContain('<li>')
  })
})
