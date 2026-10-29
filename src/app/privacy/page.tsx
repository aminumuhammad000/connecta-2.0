import Link from 'next/link'
import type { Metadata } from 'next'
import { LegalPage, type LegalContact, type LegalSection } from '@/components/site/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Connecta Privacy Policy — what data we collect, how we use it, who we share it with, and the rights and controls you have.',
}

const SECTIONS: LegalSection[] = [
  {
    id: 'scope',
    title: 'Platform Scope',
    numbered: false,
    blocks: [
      {
        kind: 'p',
        content:
          'Connecta (“Connecta,” “we,” “us,” or “our”) operates a trusted service and freelance marketplace connecting verified artisans, skilled trade technicians (such as plumbers, electricians, and carpenters), and digital professionals across Nigeria and Africa with clients worldwide.',
      },
      {
        kind: 'p',
        content: (
          <>
            This Privacy Policy describes how we collect, use, store, and safeguard your information whenever you access our website (
            <Link href="https://myconnecta.ng" className="text-azure-600 underline underline-offset-2">
              myconnecta.ng
            </Link>
            ), web applications, mobile platforms, API services, and escrow infrastructure (collectively, the &ldquo;Platform&rdquo;).
          </>
        ),
      },
    ],
  },
  {
    id: 'collect',
    title: 'Information We Collect',
    blocks: [
      {
        kind: 'p',
        content:
          'We practice data minimization and collect strictly what is essential to run the marketplace safely and ensure high-integrity escrow execution:',
      },
      {
        kind: 'list',
        items: [
          {
            label: 'Account & Profile Data',
            content:
              'Full legal name, verified email address, phone number, encrypted password hash, chosen role (Client or Specialist), primary trade / skillset, portfolio pictures, hourly / project rates, and city / state availability.',
          },
          {
            label: 'Identity & Guild Verification Data',
            content:
              'Government ID, business registration (CAC where applicable), trade certifications, and biometric selfie verification utilized solely to issue verification badges and prevent malicious impersonation.',
          },
          {
            label: 'Project & Transaction Data',
            content:
              'Service request briefs, proposals, milestone breakdowns, direct client-specialist messaging logs, job site proof photos, completion reviews, and timestamped escrow funding and release ledger records.',
          },
          {
            label: 'Payment & Payout Data',
            content:
              'Wallet balances, bank account details for withdrawal payouts, and transaction reference tokens. Raw credit/debit card numbers are processed directly by CBN-licensed, PCI-DSS Level 1 compliant gateway partners and are never stored on our servers.',
          },
          {
            label: 'Technical & Telemetry Data',
            content:
              'IP address, device fingerprints, browser version, and encrypted session logs necessary to detect unauthorized login attempts and secure account access.',
          },
        ],
      },
    ],
  },
  {
    id: 'use',
    title: 'How We Use Your Information',
    blocks: [
      { kind: 'p', content: 'We process your data only for authorized, transparent operational purposes:' },
      {
        kind: 'grid',
        items: [
          { title: 'Marketplace Matching', content: 'Matching client service requests with vetted trade specialists and digital experts based on location and skill.' },
          { title: 'Escrow Protection', content: 'Managing milestone deposits, inspection approvals, dispute holds, and instant bank payouts.' },
          { title: 'Trust & Safety', content: 'Validating identity, detecting fraudulent proposals, and maintaining verified badge integrity.' },
          { title: 'Real-time Communication', content: 'Delivering direct messages, milestone progress alerts, quote updates, and OTP verification codes.' },
          { title: 'Dispute Mediation', content: 'Providing impartial desk reviews of work logs and photo evidence when contract disagreements arise.' },
          {
            title: 'Regulatory Compliance',
            content: 'Complying with statutory accounting, anti-money laundering (AML), and Nigerian Data Protection Act requirements.',
          },
        ],
      },
    ],
  },
  {
    id: 'share',
    title: 'How We Share Information',
    blocks: [
      { kind: 'callout', tone: 'success', content: 'We never sell, rent, or monetize your personal data to third-party advertisers.' },
      { kind: 'p', content: 'We share information strictly where necessary to operate our marketplace:' },
      {
        kind: 'list',
        items: [
          {
            label: 'With Other Platform Users',
            content:
              'Your public specialist profile, customer testimonials, badges, verified skills, and portfolio photos so clients can make informed hiring decisions. Private contact details (such as direct phone numbers) are shared only when an escrow milestone is initiated or as authorized by you.',
          },
          {
            label: 'With Regulated Service Providers',
            content:
              'Payment settlement switches, SMS/Email OTP delivery channels, and cloud infrastructure vendors who are bound by stringent confidentiality and data processing agreements.',
          },
          {
            label: 'For Legal & Protective Reasons',
            content:
              'When required by enforceable court order, law enforcement request, or to protect the safety, rights, and financial security of our users and platform.',
          },
        ],
      },
    ],
  },
  {
    id: 'rights',
    title: 'Your Rights and Controls',
    blocks: [
      {
        kind: 'p',
        content:
          'Under the Nigeria Data Protection Act (NDPA) and applicable international privacy frameworks, you have extensive rights over your personal data:',
      },
      {
        kind: 'list',
        items: [
          { label: 'Access & Portability', content: 'View and request an exportable archive of your personal records, active contracts, and wallet ledgers.' },
          {
            label: 'Rectification',
            content: 'Update or correct your profile data, phone number, service categories, or banking details instantly in your account settings.',
          },
          {
            label: 'Erasure & Deletion',
            content:
              'Request account closure and permanent deletion of your profile, subject to statutory tax and financial escrow ledger retention rules.',
          },
          { label: 'Consent Withdrawal', content: 'Opt out of non-essential marketing emails or notifications at any time.' },
        ],
      },
      {
        kind: 'p',
        content: (
          <>
            To exercise any of these rights, simply email our Data Protection Desk at{' '}
            <a href="mailto:privacy@myconnecta.ng" className="text-azure-600 underline underline-offset-2">
              privacy@myconnecta.ng
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    id: 'security',
    title: 'Data Security & Retention',
    blocks: [
      {
        kind: 'p',
        content:
          'We safeguard your information with TLS 1.3 encryption in transit, AES-256 encryption at rest, multi-factor authentication, and partitioned database isolation. Data is retained only as long as needed to fulfill our marketplace contract with you or satisfy statutory audit requirements.',
      },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Local Storage',
    blocks: [
      {
        kind: 'p',
        content:
          'We use strictly essential authentication cookies, CSRF protection tokens, and session storage to maintain your logged-in state and protect your payment operations. We do not use intrusive cross-site ad trackers.',
      },
    ],
  },
  {
    id: 'minors',
    title: 'Minors (Age 18+)',
    blocks: [
      {
        kind: 'p',
        content:
          'Connecta is exclusively intended for individuals aged 18 years and above who possess the legal capacity to enter into binding service contracts. We do not knowingly solicit or collect personal records from minors.',
      },
    ],
  },
  {
    id: 'updates',
    title: 'Policy Updates',
    blocks: [
      {
        kind: 'p',
        content:
          'We may periodically revise this policy to mirror technological advancements or regulatory changes. We will notify you of material changes via email or an in-app notice, with the updated revision date clearly posted.',
      },
    ],
  },
]

const CONTACTS: LegalContact[] = [
  { icon: 'mail', label: 'Privacy desk', value: 'privacy@myconnecta.ng', href: 'mailto:privacy@myconnecta.ng', note: 'NDPR & data inquiries' },
  { icon: 'help', label: 'General support', value: 'support@myconnecta.ng', href: 'mailto:support@myconnecta.ng', note: 'Mon – Sat, 8am – 8pm' },
  { icon: 'whatsapp', label: 'WhatsApp & phone', value: '+234 812 345 6789', href: 'https://wa.me/2348123456789', note: 'Direct customer desk' },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      current="privacy"
      title="Privacy Policy"
      intro="Your trust is the whole point of Connecta. This policy explains, in plain language, what data we collect, why we collect it, how escrow workflows protect your sensitive records, and the full control you retain over your personal information."
      updated="10 August 2026"
      sections={SECTIONS}
      contactTitle="Privacy or compliance questions?"
      contactIntro="Our Data Protection and Compliance team is ready to help through any official channel."
      contacts={CONTACTS}
    />
  )
}
