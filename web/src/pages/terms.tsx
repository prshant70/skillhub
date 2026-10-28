import { LegalDocument } from '@/shared/components/legal-document'

const termsDocuments = {
  en: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    summary: 'These terms apply to your access to and use of SkillHub for browsing, publishing, reviewing, downloading, account management, and related API services. By using the service, you agree to these terms.',
    lastUpdated: 'Last updated: March 14, 2026',
    note: 'If your organization runs a private SkillHub deployment, it may impose additional internal rules, information security requirements, or acceptable use policies on top of these baseline terms.',
    sections: [
      {
        title: '1. Acceptance and Scope',
        paragraphs: [
          'By accessing, registering for, or using SkillHub, you agree to these Terms of Service, the related Privacy Policy, and any operating rules for the current instance.',
          'If you use SkillHub on behalf of a team, company, or other organization, you represent that you have authority to accept these terms on its behalf.',
        ],
      },
      {
        title: '2. Accounts and Access Security',
        paragraphs: [],
        bullets: [
          'You must provide accurate and current account information and protect your credentials, OAuth sessions, and API tokens.',
          'You are responsible for activity performed through your account, including publishing, reviewing, downloading, token generation, and namespace administration.',
          'If you become aware of unauthorized access, credential leakage, or another security incident, you must promptly notify the instance administrator or operator.',
        ],
      },
      {
        title: '3. Skills, Namespaces, and User Content',
        paragraphs: [
          'You retain rights in content you upload or submit, but you grant SkillHub a non-exclusive, worldwide, sublicensable license to host, store, copy, process, display, and distribute that content as needed to operate the service.',
          'You are responsible for the skill packages, README files, descriptions, screenshots, review comments, and other materials you submit, and you represent that you have the right to provide them.',
        ],
        bullets: [
          'Do not upload malware, unlawful material, infringing material, deceptive material, or content intended to mislead users.',
          'Do not impersonate others, take namespaces without authorization, or attempt to bypass review, moderation, or access control mechanisms.',
          'When downloading or redistributing a skill, you must also comply with that skill’s own license terms, third-party dependency licenses, and applicable law.',
        ],
      },
      {
        title: '4. Review, Governance, and Enforcement',
        paragraphs: [
          'SkillHub may review content and may approve, reject, hide, remove, yank versions, restrict access, or suspend accounts to protect service security, compliance, and quality.',
          'Where abuse, infringement, security risk, unlawful conduct, or other violations are suspected, the platform or instance administrator may preserve logs and take appropriate action.',
        ],
      },
      {
        title: '5. Downloads, APIs, and Acceptable Use',
        paragraphs: [],
        bullets: [
          'You may not interfere with service stability or bypass authentication, rate limits, security controls, or authorization boundaries.',
          'You may not scrape, stress test, scan, or automate against SkillHub in a destructive manner, or use the service to distribute viruses, trojans, or other malicious payloads.',
          'Skills downloaded through SkillHub are provided by their publishers and are used subject to their own licenses and risk notices. You are responsible for evaluating compatibility, security, and compliance.',
        ],
      },
      {
        title: '6. Open Source Components, Intellectual Property, and Branding',
        paragraphs: [
          'SkillHub may include open-source components governed by Apache License 2.0 or other third-party licenses, and those components remain subject to their respective license terms.',
          'Unless explicitly stated otherwise, SkillHub trademarks, brand assets, interface design, and site content remain the property of their respective owners and are not transferred by your use of the service.',
        ],
      },
      {
        title: '7. Availability and Disclaimers',
        paragraphs: [
          'We may modify, update, limit, or discontinue parts of the service at any time, including search, downloads, review workflows, login methods, and API capabilities, and we do not guarantee continuous availability.',
          'To the maximum extent permitted by law, SkillHub is provided on an "as is" and "as available" basis without express or implied warranties, including warranties of merchantability, fitness for a particular purpose, non-infringement, uninterrupted availability, or accuracy.',
        ],
      },
      {
        title: '8. Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by law, SkillHub and its operators will not be liable for indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or goodwill.',
          'If claims arise from your use of the service, your content, or your violation of these terms, you agree to bear responsibility as permitted by law and to cooperate in resolving the matter.',
        ],
      },
      {
        title: '9. Termination, Changes, and Contact',
        paragraphs: [
          'You may stop using SkillHub at any time. We may suspend or terminate access if you violate these terms, create security risk, or if required by law.',
          'We may update these terms from time to time. Your continued use after an update means you accept the revised version. If you need to contact us, use the documentation, community, or administrator channel provided by the current instance.',
        ],
      },
    ],
  },
} as const

export function TermsOfServicePage() {
  return <LegalDocument {...termsDocuments.en} />
}
