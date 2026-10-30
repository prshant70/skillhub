import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { TermsOfServicePage } from './terms'

describe('TermsOfServicePage', () => {
  it('renders the english document', () => {
    const html = renderToStaticMarkup(<TermsOfServicePage />)

    expect(html).toContain('Terms of Service')
    expect(html).toContain('<li>')
  })
})
