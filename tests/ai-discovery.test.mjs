import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import zlib from 'zlib'
import {
  validateAttachment,
  extractTextFromPdfBuffer,
  MAX_FILE_SIZE_BYTES,
} from '../src/lib/ai/document-parser.ts'
import {
  heuristicRequestAnalysis,
  matchProviders,
} from '../src/lib/ai/discovery.ts'

const TEST_PROVIDERS = [
  {
    id: 'b2010000-0000-0000-0000-000000000001',
    fullName: 'Malam Sanusi Danbatta',
    businessName: 'Danbatta Tech & Micro-Soldering Lab',
    headline: 'Master Board & Screen Repair Specialist in Kano City',
    bio: 'Over 10 years of micro-soldering experience specializing in iPhone, Samsung, and Android motherboard repairs in Farm Centre Kano.',
    category: 'Phone & Tablet Repair',
    categorySlug: 'phone-repair',
    skills: ['Micro-Soldering', 'Screen Glass Separation', 'Logic Board IC', 'FaceID Repair', 'Water Damage Recovery'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1500000,
    averageRating: 4.96,
    reviewCount: 94,
    completedJobsCount: 142,
    experienceYears: 10,
    verificationStatus: 'verified',
    avatarUrl: '/images/services/phone_repair_technician.jpg',
    workshopAddress: 'Shop 14, Farm Centre GSM Village, Kano',
    latitude: 11.9754,
    longitude: 8.5385,
    joinedDate: '2025-01-15T08:00:00.000Z',
    badges: ['Guild Certified', 'Identity Verified'],
    reviews: [],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000002',
    fullName: 'Engineer Farouq Bello',
    businessName: 'Arewa Solar & High Voltage Solutions',
    headline: 'Certified Solar Systems & Inverter Installation Engineer',
    bio: 'NEMSA certified solar engineering contractor installing commercial hybrid inverters and residential solar panels in Kano and Kaduna.',
    category: 'Electrical & Solar',
    categorySlug: 'electrical',
    skills: ['Solar Installation', 'Inverter Wiring', 'Battery Storage', 'Circuit Troubleshooting', 'House Conduit Wiring'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 2000000,
    averageRating: 4.98,
    reviewCount: 112,
    completedJobsCount: 178,
    experienceYears: 12,
    verificationStatus: 'verified',
    avatarUrl: '/images/services/electrician.jpg',
    workshopAddress: 'Plot 4B Commercial Layout, Bompai, Kano',
    latitude: 12.0125,
    longitude: 8.5412,
    joinedDate: '2024-11-01T08:00:00.000Z',
    badges: ['NEMSA Certified', 'Master Artisan'],
    reviews: [],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000003',
    fullName: 'Ustaz Jamilu Sani',
    businessName: 'Kano Master Plumbers Guild',
    headline: 'Borehole Submersible Pump & High Pressure Pipe Fitter',
    bio: 'Specialist in PPR pipe heat-fusion, deep borehole pump recovery, leak detection, and water tank systems in Kano.',
    category: 'Plumbing & Pipes',
    categorySlug: 'plumbing',
    skills: ['Pipe Leakage Repair', 'Borehole Submersible Pumps', 'PPR Heat Fusion', 'Bathroom Sanitary Fitting'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1200000,
    averageRating: 4.92,
    reviewCount: 88,
    completedJobsCount: 135,
    experienceYears: 9,
    verificationStatus: 'verified',
    avatarUrl: '/images/services/plumber.jpg',
    workshopAddress: 'Sabon Gari Market, Kano',
    latitude: 12.002,
    longitude: 8.528,
    joinedDate: '2025-02-10T08:00:00.000Z',
    badges: ['Guild Certified'],
    reviews: [],
  },
]

describe('Connecta AI-Powered Service Discovery Suite', () => {
  // 1. File and Attachment Constraints
  describe('Attachment Validation & Document Parsing', () => {
    test('accepts valid images and documents (JPEG, PNG, WebP, PDF, TXT)', () => {
      assert.equal(validateAttachment('circuit.jpg', 'image/jpeg', 1024), 'image/jpeg')
      assert.equal(validateAttachment('drawing.png', 'image/png', 5000), 'image/png')
      assert.equal(validateAttachment('photo.webp', 'image/webp', 2000), 'image/webp')
      assert.equal(validateAttachment('spec.pdf', 'application/pdf', 10000), 'application/pdf')
      assert.equal(validateAttachment('notes.txt', 'text/plain', 500), 'text/plain')
    })

    test('explicitly rejects DOCX and DOC with clear, actionable message', () => {
      assert.throws(
        () => validateAttachment('requirements.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1000),
        /DOCX and DOC formats are not currently supported/
      )
      assert.throws(
        () => validateAttachment('contract.doc', 'application/msword', 1000),
        /DOCX and DOC formats are not currently supported/
      )
    })

    test('rejects unsupported extensions and MIME types', () => {
      assert.throws(
        () => validateAttachment('payload.exe', 'application/x-msdownload', 1000),
        /Unsupported file type/
      )
      assert.throws(
        () => validateAttachment('archive.zip', 'application/zip', 1000),
        /Unsupported file type/
      )
    })

    test('rejects files exceeding 10MB limit', () => {
      const oversized = MAX_FILE_SIZE_BYTES + 1024
      assert.throws(
        () => validateAttachment('large_photo.jpg', 'image/jpeg', oversized),
        /exceeds the 10MB size limit/
      )
    })

    test('safely extracts text tokens from PDF buffer', () => {
      const streamText = 'BT /F1 12 Tf (Connecta Solar Installation Spec) Tj ET'
      const pdfString = `%PDF-1.4\n1 0 obj\n<< /Length ${streamText.length} >>\nstream\n${streamText}\nendstream\nendobj\n%%EOF`
      const buffer = Buffer.from(pdfString, 'binary')

      const extracted = extractTextFromPdfBuffer(buffer)
      assert.match(extracted, /Connecta Solar Installation Spec/)
    })

    test('safely handles FlateDecode compressed PDF streams', () => {
      const rawText = '(Emergency Plumber Leak Repair Kano) Tj'
      const compressed = zlib.deflateSync(Buffer.from(rawText))
      const pdfString = Buffer.concat([
        Buffer.from('%PDF-1.4\n1 0 obj\n<< /Filter /FlateDecode /Length ' + compressed.length + ' >>\nstream\n'),
        compressed,
        Buffer.from('\nendstream\nendobj\n%%EOF'),
      ])

      const extracted = extractTextFromPdfBuffer(pdfString)
      assert.match(extracted, /Emergency Plumber Leak Repair Kano/)
    })

    test('handles empty or corrupted PDF buffers gracefully without crashing', () => {
      const corrupted = Buffer.from('Corrupted non-pdf binary content garbage')
      const extracted = extractTextFromPdfBuffer(corrupted)
      assert.equal(typeof extracted, 'string')
    })
  })

  // 2. Request Understanding & Zero-Hallucination Guarantees
  describe('Structured Request Understanding (Zero-Hallucination)', () => {
    test('extracts category, skills, and city when explicitly stated', () => {
      const requestText = 'I need an electrician to install solar panels in Kano'
      const analysis = heuristicRequestAnalysis(requestText)

      assert.equal(analysis.categorySlug, 'electrical')
      assert.equal(analysis.category, 'Electrical & Solar')
      assert.equal(analysis.location, 'Kano')
      assert.ok(analysis.requiredSkills.length > 0)
    })

    test('does NOT invent location or budget if not provided by user', () => {
      const requestText = 'My laptop will not turn on. I need someone to diagnose and repair it.'
      const analysis = heuristicRequestAnalysis(requestText)

      assert.equal(analysis.location, null, 'Location must not be hallucinated if absent')
      assert.equal(analysis.budget, null, 'Budget must not be hallucinated if absent')
      assert.ok(analysis.categorySlug === 'phone-repair' || analysis.categorySlug === 'electrical')
    })

    test('detects urgency signals correctly', () => {
      const urgentReq = heuristicRequestAnalysis('Urgent emergency! Main water pipe burst in the bathroom.')
      assert.equal(urgentReq.urgency, 'emergency')
      assert.equal(urgentReq.categorySlug, 'plumbing')

      const scheduledReq = heuristicRequestAnalysis('I want to paint my living room next weekend.')
      assert.equal(scheduledReq.urgency, 'scheduled')
      assert.equal(scheduledReq.categorySlug, 'painting')
    })

    test('detects stated budget accurately', () => {
      const budgetReq = heuristicRequestAnalysis('Need AC gas refill with a budget of ₦25,000')
      assert.ok(budgetReq.budget?.includes('25,000'))
      assert.equal(budgetReq.categorySlug, 'ac-cooling')
    })
  })

  // 3. Real Provider Matching & Ranking
  describe('Real Provider Retrieval & Relevance Ranking', () => {
    test('all returned providers exist in Connecta real database', () => {
      const analysis = heuristicRequestAnalysis('I need an electrician to install solar panels in Kano')
      const matches = matchProviders(analysis, {
        cityFilter: 'Kano',
        providersList: TEST_PROVIDERS,
      })

      const realIds = new Set(TEST_PROVIDERS.map((p) => p.id))

      assert.ok(matches.length > 0, 'Should return matching providers')
      for (const prov of matches) {
        assert.ok(realIds.has(prov.id), `Provider ${prov.id} must exist in the real database`)
        assert.ok(prov.matchScore >= 30 && prov.matchScore <= 100, 'Match score within valid range')
        assert.ok(prov.matchReason.length > 0, 'Match reason must be provided')
      }
    })

    test('ranks matching trade specialists higher than unrelated trades', () => {
      const plumbingReq = heuristicRequestAnalysis('Need a plumber to fix leaking PPR pipes and borehole pump in Kano')
      const matches = matchProviders(plumbingReq, {
        cityFilter: 'Kano',
        providersList: TEST_PROVIDERS,
      })

      assert.ok(matches.length > 0)
      const topMatch = matches[0]
      assert.equal(topMatch.categorySlug, 'plumbing', 'Top match must be a plumber')
    })

    test('verified providers receive score bonuses and valid reasons', () => {
      const analysis = heuristicRequestAnalysis('Need solar installation in Kano')
      const matches = matchProviders(analysis, {
        verifiedOnly: true,
        providersList: TEST_PROVIDERS,
      })

      for (const m of matches) {
        assert.equal(m.verificationStatus, 'verified')
        assert.match(m.matchReason, /verified/i)
      }
    })

    test('returns graceful fallback when query is vague without breaking', () => {
      const vagueReq = heuristicRequestAnalysis('I need someone to help me with general fixes')
      const matches = matchProviders(vagueReq, {
        providersList: TEST_PROVIDERS,
      })

      assert.ok(Array.isArray(matches))
      assert.ok(matches.length > 0)
    })
  })
})
