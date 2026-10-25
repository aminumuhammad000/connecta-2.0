import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  CreditCard,
  AlertTriangle,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Connecta',
  description:
    'Connecta Terms of Service — the binding agreement between you and Connecta covering accounts, escrow protection, dispute mediation, and acceptable use.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Top Navigation */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-36 h-8 sm:w-44 sm:h-10">
              <Image
                src="/brand/svg/connecta-logo.svg"
                alt="Connecta"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors hidden sm:inline"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white shadow-sm transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-white via-emerald-50/20 to-[#F5F7FC] border-b border-slate-200/60 pt-12 pb-12 sm:pb-16 px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-emerald-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Legal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-700 font-bold">Terms of Service</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-emerald-700" />
              <span>User Agreement &amp; Escrow Charter</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight leading-tight">
              Terms of Service
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              These terms form the legally binding agreement between you and Connecta. They establish fair, predictable guidelines for verified service delivery, milestone escrow protection, and prompt arbitration.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span>Last updated: <strong className="text-slate-800">10 August 2026</strong></span>
              <span>•</span>
              <span>Effective across: Nigeria &amp; Pan-Africa</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">100% Milestone Escrow Safeguard</span>
            </div>
          </div>
        </section>

        {/* Terms Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
          {/* Welcome Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Welcome to Connecta</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              By accessing, browsing, registering an account, posting a service brief, submitting quotes, or participating in transactions on Connecta (<Link href="https://myconnecta.ng" className="text-emerald-600 font-semibold underline underline-offset-2">myconnecta.ng</Link>) or our related mobile and web platforms, you agree to comply with and be bound by these Terms of Service (&ldquo;Terms&rdquo;).
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Please read these terms carefully before engaging on the platform. If you do not accept these Terms in their entirety, you must immediately refrain from accessing or utilizing the Platform.
            </p>
          </div>

          {/* Section 1: Who We Are */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Who We Are</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Connecta operates an intelligent marketplace and escrow protocol connecting clients with vetted tradespeople (plumbers, electricians, HVAC mechanics, carpenters) and digital specialists across Africa.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>Connecta is the platform provider and escrow mediator.</strong> The independent contractor agreement for physical or digital service delivery is entered into directly between the Client and the Specialist. Connecta provides the verification, dispatch, communication, milestone escrow custody, and mediation infrastructure.
            </p>
          </section>

          {/* Section 2: Your Account */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Account &amp; Eligibility</h2>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Age Requirement:</strong> You must be at least 18 years of age and possess full legal capacity to enter into binding commercial contracts in Nigeria or your resident jurisdiction.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Account Accuracy:</strong> You agree to provide true, accurate, and current information during registration, and maintain the security of your authentication credentials. You are strictly responsible for all activities conducted under your login.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Identity Audits:</strong> Certain features, badge endorsements, and high-value project categories require completion of government ID or guild verification before access is granted.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3: Clients & Specialists */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Clients and Specialists</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Clients post service briefs, set milestones, and fund escrow allocations. Specialists submit competitive quotes, provide photographic proof of work, and deliver services according to agreed specifications.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Both parties are individually responsible for ensuring that all job specifications, materials agreements, safety precautions, and tax liabilities comply with applicable laws.
            </p>
          </section>

          {/* Section 4: Payments and Escrow Protocol */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Payments and Escrow Protocol</h2>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold text-sm">
              All transactions on Connecta are governed by our Escrow Safeguard Protocol to eliminate upfront payment fraud and non-payment risks.
            </div>

            <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Upfront Escrow Funding:</strong> Before work commences, the client funds the agreed milestone amount into secure escrow custody. The specialist receives immediate confirmation that funds are locked and guaranteed.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Inspection &amp; Release:</strong> Escrowed funds are disbursed to the specialist&apos;s wallet once the client inspects and approves the delivered work or completed job milestone.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Instant Local Payouts:</strong> Specialists can withdraw released wallet balances directly to supported Nigerian commercial banks and licensed payment rails.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Zero Hidden Surcharges:</strong> Any applicable platform commissions or service fees are transparently displayed down to minor currency units (kobo) before either party confirms an order.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 5: Disputes & Mediation */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                5
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Disputes and Arbitration</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              If an issue emerges regarding workmanship quality, scope fulfillment, or uncompleted milestones, either party can file an official Dispute through their project dashboard.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Upon dispute initiation, funds remain strictly frozen inside the Escrow Vault. Connecta&apos;s impartial Trust &amp; Safety Desk investigates the job brief, chat transcripts, and before-and-after photo evidence to render a binding resolution, which may include partial payout, complete refund, or mutual settlement.
            </p>
          </section>

          {/* Section 6: Acceptable Use */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                6
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Acceptable Use Policy</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              To preserve market trust and protect all participants, you agree never to:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-slate-700">
              <li>• Circumvent the platform or coerce counterparties into taking payments off-platform to bypass escrow safeguards.</li>
              <li>• Misrepresent skills, certifications, trade qualifications, or upload falsified portfolio deliverables.</li>
              <li>• Harass, defraud, extort, or engage in discriminatory behavior toward any user.</li>
              <li>• Distribute malicious software, manipulate review scores, or reverse engineer platform algorithms.</li>
            </ul>
            <p className="text-xs text-rose-600 font-semibold pt-1">
              Violations result in immediate suspension, forfeiture of platform privileges, and possible referral to law enforcement agencies.
            </p>
          </section>

          {/* Sections 7, 8, 9 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">7</span>
                <h3 className="font-black text-slate-900 text-base">Intellectual Property</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You retain ownership of the original content you post. Delivered project assets transfer according to the agreed brief. Connecta trademarks, logos, and software are our exclusive property.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">8</span>
                <h3 className="font-black text-slate-900 text-base">Disclaimers &amp; Liability</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connecta is provided &ldquo;as is&rdquo;. While we aggressively verify tradespeople and safeguard escrow funds, we do not guarantee specific user outcomes. Liability is limited to platform fees paid.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">9</span>
                <h3 className="font-black text-slate-900 text-base">Account Termination</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You may close your account at any time. We reserve the right to suspend or terminate accounts in breach of these terms. Surviving provisions include escrow settlements, indemnities, and fee liabilities.
              </p>
            </div>
          </div>

          {/* Section 10: Official Contact & Legal Inquiries */}
          <section className="bg-gradient-to-br from-[#062419] to-[#0A3D2A] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Section 10 • Modifications &amp; Legal Desk</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Contact &amp; Legal Notices</h2>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
                We may revise these Terms as our services expand. Notices will be posted on this page with updated effective dates. For formal legal notices or operational inquiries:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <a
                href="mailto:hello@myconnecta.ng"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors space-y-1 group"
              >
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase">
                  <Mail className="w-4 h-4" />
                  <span>General &amp; Legal Inquiries</span>
                </div>
                <div className="text-sm font-black text-white group-hover:text-emerald-200">
                  hello@myconnecta.ng
                </div>
                <div className="text-xs text-emerald-200/70">Legal notices &amp; contracts</div>
              </a>

              <a
                href="mailto:support@myconnecta.ng"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors space-y-1 group"
              >
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase">
                  <HelpCircle className="w-4 h-4" />
                  <span>Customer Support Desk</span>
                </div>
                <div className="text-sm font-black text-white group-hover:text-emerald-200">
                  support@myconnecta.ng
                </div>
                <div className="text-xs text-emerald-200/70">Mon – Sat: 8:00 AM – 8:00 PM</div>
              </a>

              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors space-y-1 group"
              >
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp &amp; Phone</span>
                </div>
                <div className="text-sm font-black text-white group-hover:text-emerald-200">
                  +234 812 345 6789
                </div>
                <div className="text-xs text-emerald-200/70">Direct customer desk</div>
              </a>
            </div>

            {/* Social channels strip */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-200/80">
              <span className="font-semibold">Official Social Channels:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://x.com/Connectainc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                  title="Twitter / X (@Connectainc)"
                >
                  𝕏 @Connectainc
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61587476974482"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                  title="Facebook"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                  title="Instagram"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                  title="TikTok"
                >
                  TikTok
                </a>
              </div>
            </div>
          </section>

          {/* Quick links footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-sm font-semibold text-slate-600 border-t border-slate-200">
            <Link href="/" className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800">
              ← Return to Connecta Home
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/onboarding" className="text-emerald-700 hover:text-emerald-800">
                Join Connecta
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Connecta Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-800 hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="text-emerald-700 font-bold hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
