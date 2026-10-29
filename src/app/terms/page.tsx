import Link from 'next/link'
import type { Metadata } from 'next'
import { LegalPage, type LegalContact, type LegalSection } from '@/components/site/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Connecta Terms of Service — the binding agreement between you and Connecta covering accounts, escrow protection, dispute mediation, and acceptable use.',
}

const SECTIONS: LegalSection[] = [
  {
    id: 'welcome',
    title: 'Welcome to Connecta',
    numbered: false,
    blocks: [
      {
        kind: 'p',
        content: (
          <>
            By accessing, browsing, registering an account, posting a service brief, submitting quotes, or participating in transactions on
            Connecta (
            <Link href="https://myconnecta.ng" className="text-azure-600 underline underline-offset-2">
              myconnecta.ng
            </Link>
            ) or our related mobile and web platforms, you agree to comply with and be bound by these Terms of Service (&ldquo;Terms&rdquo;).
          </>
        ),
      },
      {
        kind: 'p',
        content:
          'Please read these terms carefully before engaging on the platform. If you do not accept these Terms in their entirety, you must immediately refrain from accessing or utilizing the Platform.',
      },
    ],
  },
  {
    id: 'who-we-are',
    title: 'Who We Are',
    blocks: [
      {
        kind: 'p',
        content:
          'Connecta operates an intelligent marketplace and escrow protocol connecting clients with vetted tradespeople (plumbers, electricians, HVAC mechanics, carpenters) and digital specialists across Africa.',
      },
      {
        kind: 'p',
        content: (
          <>
            <strong className="font-medium text-ink">Connecta is the platform provider and escrow mediator.</strong> The independent contractor
            agreement for physical or digital service delivery is entered into directly between the Client and the Specialist. Connecta provides the
            verification, dispatch, communication, milestone escrow custody, and mediation infrastructure.
          </>
        ),
      },
    ],
  },
  {
    id: 'account',
    title: 'Your Account & Eligibility',
    blocks: [
      {
        kind: 'list',
        items: [
          {
            label: 'Age Requirement',
            content:
              'You must be at least 18 years of age and possess full legal capacity to enter into binding commercial contracts in Nigeria or your resident jurisdiction.',
          },
          {
            label: 'Account Accuracy',
            content:
              'You agree to provide true, accurate, and current information during registration, and maintain the security of your authentication credentials. You are strictly responsible for all activities conducted under your login.',
          },
          {
            label: 'Identity Audits',
            content:
              'Certain features, badge endorsements, and high-value project categories require completion of government ID or guild verification before access is granted.',
          },
        ],
      },
    ],
  },
  {
    id: 'clients-specialists',
    title: 'Clients and Specialists',
    blocks: [
      {
        kind: 'p',
        content:
          'Clients post service briefs, set milestones, and fund escrow allocations. Specialists submit competitive quotes, provide photographic proof of work, and deliver services according to agreed specifications.',
      },
      {
        kind: 'p',
        content:
          'Both parties are individually responsible for ensuring that all job specifications, materials agreements, safety precautions, and tax liabilities comply with applicable laws.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments and Escrow Protocol',
    blocks: [
      {
        kind: 'callout',
        tone: 'success',
        content: 'All transactions on Connecta are governed by our Escrow Safeguard Protocol to eliminate upfront payment fraud and non-payment risks.',
      },
      {
        kind: 'list',
        items: [
          {
            label: 'Upfront Escrow Funding',
            content:
              'Before work commences, the client funds the agreed milestone amount into secure escrow custody. The specialist receives immediate confirmation that funds are locked and guaranteed.',
          },
          {
            label: 'Inspection & Release',
            content:
              "Escrowed funds are disbursed to the specialist's wallet once the client inspects and approves the delivered work or completed job milestone.",
          },
          {
            label: 'Instant Local Payouts',
            content: 'Specialists can withdraw released wallet balances directly to supported Nigerian commercial banks and licensed payment rails.',
          },
          {
            label: 'Zero Hidden Surcharges',
            content:
              'Any applicable platform commissions or service fees are transparently displayed down to minor currency units (kobo) before either party confirms an order.',
          },
        ],
      },
    ],
  },
  {
    id: 'disputes',
    title: 'Disputes and Arbitration',
    blocks: [
      {
        kind: 'p',
        content:
          'If an issue emerges regarding workmanship quality, scope fulfillment, or uncompleted milestones, either party can file an official Dispute through their project dashboard.',
      },
      {
        kind: 'p',
        content:
          "Upon dispute initiation, funds remain strictly frozen inside the Escrow Vault. Connecta's impartial Trust & Safety Desk investigates the job brief, chat transcripts, and before-and-after photo evidence to render a binding resolution, which may include partial payout, complete refund, or mutual settlement.",
      },
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    blocks: [
      { kind: 'p', content: 'To preserve market trust and protect all participants, you agree never to:' },
      {
        kind: 'list',
        items: [
          { content: 'Circumvent the platform or coerce counterparties into taking payments off-platform to bypass escrow safeguards.' },
          { content: 'Misrepresent skills, certifications, trade qualifications, or upload falsified portfolio deliverables.' },
          { content: 'Harass, defraud, extort, or engage in discriminatory behavior toward any user.' },
          { content: 'Distribute malicious software, manipulate review scores, or reverse engineer platform algorithms.' },
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        content: 'Violations result in immediate suspension, forfeiture of platform privileges, and possible referral to law enforcement agencies.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    blocks: [
      {
        kind: 'p',
        content:
          'You retain ownership of the original content you post. Delivered project assets transfer according to the agreed brief. Connecta trademarks, logos, and software are our exclusive property.',
      },
    ],
  },
  {
    id: 'liability',
    title: 'Disclaimers & Liability',
    blocks: [
      {
        kind: 'p',
        content:
          'Connecta is provided “as is”. While we aggressively verify tradespeople and safeguard escrow funds, we do not guarantee specific user outcomes. Liability is limited to platform fees paid.',
      },
    ],
  },
  {
    id: 'termination',
    title: 'Account Termination',
    blocks: [
      {
        kind: 'p',
        content:
          'You may close your account at any time. We reserve the right to suspend or terminate accounts in breach of these terms. Surviving provisions include escrow settlements, indemnities, and fee liabilities.',
      },
    ],
  },
  {
    id: 'modifications',
    title: 'Modifications & Legal Notices',
    blocks: [
      {
        kind: 'p',
        content:
          'We may revise these Terms as our services expand. Notices will be posted on this page with updated effective dates. For formal legal notices or operational inquiries, use the contacts below.',
      },
    ],
  },
]

const CONTACTS: LegalContact[] = [
  { icon: 'mail', label: 'General & legal inquiries', value: 'hello@myconnecta.ng', href: 'mailto:hello@myconnecta.ng', note: 'Legal notices & contracts' },
  { icon: 'help', label: 'Customer support', value: 'support@myconnecta.ng', href: 'mailto:support@myconnecta.ng', note: 'Mon – Sat, 8am – 8pm' },
  { icon: 'whatsapp', label: 'WhatsApp & phone', value: '+234 812 345 6789', href: 'https://wa.me/2348123456789', note: 'Direct customer desk' },
]

export default function TermsOfServicePage() {
  return (
    <LegalPage
      current="terms"
      title="Terms of Service"
      intro="These terms form the legally binding agreement between you and Connecta. They establish fair, predictable guidelines for verified service delivery, milestone escrow protection, and prompt arbitration."
      updated="10 August 2026"
      sections={SECTIONS}
      contactTitle="Contact & legal notices"
      contactIntro="Questions about these terms? Reach the right team directly."
      contacts={CONTACTS}
    />
  )
}
