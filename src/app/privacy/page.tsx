import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  Shield,
  Lock,
  Eye,
  FileText,
  UserCheck,
  CreditCard,
  Layers,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Connecta',
  description:
    'Connecta Privacy Policy — what data we collect, how we use it, who we share it with, and the rights and controls you have.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Top Navigation */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-28 h-7 sm:w-44 sm:h-10">
              <Image
                src="/brand/svg/connecta-logo.svg"
                alt="Connecta"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/discover"
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 px-2.5 sm:px-3 py-1.5 transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-2.5 sm:px-3 py-1.5 transition-colors hidden sm:inline"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding?step=role"
              className="text-xs sm:text-sm font-extrabold px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#053F28] hover:bg-[#032a1b] text-white shadow-xs hover:shadow-md transition-all hover:scale-105"
            >
              Register
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
              <span className="text-emerald-700 font-bold">Privacy Policy</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Connecta Legal Trust &amp; NDPR Safeguards</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight leading-tight">
              Privacy Policy
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Your trust is the whole point of Connecta. This policy explains, in plain language, what data we collect, why we collect it, how escrow workflows protect your sensitive records, and the full control you retain over your personal information.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span>Last updated: <strong className="text-slate-800">10 August 2026</strong></span>
              <span>•</span>
              <span>Effective across: Nigeria &amp; Pan-Africa</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">NDPR &amp; PCI-DSS Aligned</span>
            </div>
          </div>
        </section>

        {/* Policy Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
          {/* Introduction Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Platform Scope</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Connecta (&ldquo;Connecta,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates a trusted service and freelance marketplace connecting verified artisans, skilled trade technicians (such as plumbers, electricians, and carpenters), and digital professionals across Nigeria and Africa with clients worldwide.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              This Privacy Policy describes how we collect, use, store, and safeguard your information whenever you access our website (<Link href="https://myconnecta.ng" className="text-emerald-600 font-semibold underline underline-offset-2">myconnecta.ng</Link>), web applications, mobile platforms, API services, and escrow infrastructure (collectively, the &ldquo;Platform&rdquo;).
            </p>
          </div>

          {/* Section 1 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Information We Collect</h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We practice data minimization and collect strictly what is essential to run the marketplace safely and ensure high-integrity escrow execution:
            </p>

            <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Account &amp; Profile Data:</strong> Full legal name, verified email address, phone number, encrypted password hash, chosen role (Client or Specialist), primary trade / skillset, portfolio pictures, hourly / project rates, and city / state availability.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Identity &amp; Guild Verification Data:</strong> Government ID, business registration (CAC where applicable), trade certifications, and biometric selfie verification utilized solely to issue verification badges and prevent malicious impersonation.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Project &amp; Transaction Data:</strong> Service request briefs, proposals, milestone breakdowns, direct client-specialist messaging logs, job site proof photos, completion reviews, and timestamped escrow funding and release ledger records.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Payment &amp; Payout Data:</strong> Wallet balances, bank account details for withdrawal payouts, and transaction reference tokens. Raw credit/debit card numbers are processed directly by CBN-licensed, PCI-DSS Level 1 compliant gateway partners and are never stored on our servers.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">Technical &amp; Telemetry Data:</strong> IP address, device fingerprints, browser version, and encrypted session logs necessary to detect unauthorized login attempts and secure account access.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">How We Use Your Information</h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We process your data only for authorized, transparent operational purposes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {[
                { title: 'Marketplace Matching', desc: 'Matching client service requests with vetted trade specialists and digital experts based on location and skill.' },
                { title: 'Escrow Protection', desc: 'Managing milestone deposits, inspection approvals, dispute holds, and instant bank payouts.' },
                { title: 'Trust & Safety', desc: 'Validating identity, detecting fraudulent proposals, and maintaining verified badge integrity.' },
                { title: 'Real-time Communication', desc: 'Delivering direct messages, milestone progress alerts, quote updates, and OTP verification codes.' },
                { title: 'Dispute Mediation', desc: 'Providing impartial desk reviews of work logs and photo evidence when contract disagreements arise.' },
                { title: 'Regulatory Compliance', desc: 'Complying with statutory accounting, anti-money laundering (AML), and Nigerian Data Protection Act requirements.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">How We Share Information</h2>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 font-bold text-sm">
              We never sell, rent, or monetize your personal data to third-party advertisers.
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We share information strictly where necessary to operate our marketplace:
            </p>

            <ul className="space-y-3 text-sm sm:text-base text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">With Other Platform Users:</strong> Your public specialist profile, customer testimonials, badges, verified skills, and portfolio photos so clients can make informed hiring decisions. Private contact details (such as direct phone numbers) are shared only when an escrow milestone is initiated or as authorized by you.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">With Regulated Service Providers:</strong> Payment settlement switches, SMS/Email OTP delivery channels, and cloud infrastructure vendors who are bound by stringent confidentiality and data processing agreements.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-900">For Legal &amp; Protective Reasons:</strong> When required by enforceable court order, law enforcement request, or to protect the safety, rights, and financial security of our users and platform.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-base">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Rights and Controls</h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Under the Nigeria Data Protection Act (NDPA) and applicable international privacy frameworks, you have extensive rights over your personal data:
            </p>

            <div className="space-y-2.5 text-sm sm:text-base text-slate-700">
              <p>• <strong>Access &amp; Portability:</strong> View and request an exportable archive of your personal records, active contracts, and wallet ledgers.</p>
              <p>• <strong>Rectification:</strong> Update or correct your profile data, phone number, service categories, or banking details instantly in your account settings.</p>
              <p>• <strong>Erasure &amp; Deletion:</strong> Request account closure and permanent deletion of your profile, subject to statutory tax and financial escrow ledger retention rules.</p>
              <p>• <strong>Consent Withdrawal:</strong> Opt out of non-essential marketing emails or notifications at any time.</p>
            </div>

            <div className="pt-2">
              <p className="text-xs sm:text-sm text-slate-600">
                To exercise any of these rights, simply email our Data Protection Desk at{' '}
                <a href="mailto:privacy@myconnecta.ng" className="text-emerald-600 font-bold hover:underline">
                  privacy@myconnecta.ng
                </a>.
              </p>
            </div>
          </section>

          {/* Section 5, 6, 7, 8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">5</span>
                <h3 className="font-black text-slate-900 text-lg">Data Security &amp; Retention</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We safeguard your information with TLS 1.3 encryption in transit, AES-256 encryption at rest, multi-factor authentication, and partitioned database isolation. Data is retained only as long as needed to fulfill our marketplace contract with you or satisfy statutory audit requirements.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">6</span>
                <h3 className="font-black text-slate-900 text-lg">Cookies &amp; Local Storage</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We use strictly essential authentication cookies, CSRF protection tokens, and session storage to maintain your logged-in state and protect your payment operations. We do not use intrusive cross-site ad trackers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">7</span>
                <h3 className="font-black text-slate-900 text-lg">Minors (Age 18+)</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connecta is exclusively intended for individuals aged 18 years and above who possess the legal capacity to enter into binding service contracts. We do not knowingly solicit or collect personal records from minors.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">8</span>
                <h3 className="font-black text-slate-900 text-lg">Policy Updates</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We may periodically revise this policy to mirror technological advancements or regulatory changes. We will notify you of material changes via email or an in-app notice, with the updated revision date clearly posted.
              </p>
            </div>
          </div>

          {/* Section 9: Direct Support & Contact */}
          <section className="bg-gradient-to-br from-[#062419] to-[#0A3D2A] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Section 9 • Contact &amp; Oversight</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Have Privacy or Compliance Questions?</h2>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
                Our dedicated Data Protection and Compliance team is ready to assist you. Contact us directly through any official channel:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <a
                href="mailto:privacy@myconnecta.ng"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors space-y-1 group"
              >
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase">
                  <Mail className="w-4 h-4" />
                  <span>Privacy Desk</span>
                </div>
                <div className="text-sm font-black text-white group-hover:text-emerald-200">
                  privacy@myconnecta.ng
                </div>
                <div className="text-xs text-emerald-200/70">NDPR &amp; data inquiries</div>
              </a>

              <a
                href="mailto:support@myconnecta.ng"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors space-y-1 group"
              >
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase">
                  <HelpCircle className="w-4 h-4" />
                  <span>General Support</span>
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
                  <span>Direct Hotline &amp; WhatsApp</span>
                </div>
                <div className="text-sm font-black text-white group-hover:text-emerald-200">
                  +234 812 345 6789
                </div>
                <div className="text-xs text-emerald-200/70">Instant verified channel</div>
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
              <Link href="/terms" className="hover:text-slate-900 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/onboarding" className="text-emerald-700 hover:text-emerald-800">
                Create Account
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
            <Link href="/privacy" className="text-emerald-700 font-bold hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-800 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
