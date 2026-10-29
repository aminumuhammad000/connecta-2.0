export interface ServiceCategory {
  id: string
  name: string
  short: string
  slug: string
}

// Mirrors DEFAULT_CATEGORIES in /api/categories; ids are what /api/requests validates against.
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'c1010000-0000-0000-0000-000000000001', name: 'Plumbing & Pipefitting', short: 'Plumbing', slug: 'plumbing' },
  { id: 'c1010000-0000-0000-0000-000000000002', name: 'Electrical & Wiring', short: 'Electrical', slug: 'electrical' },
  { id: 'c1010000-0000-0000-0000-000000000008', name: 'Air Conditioning & Cooling', short: 'AC & cooling', slug: 'ac-cooling' },
  { id: 'c1010000-0000-0000-0000-000000000006', name: 'Auto Mechanics & Repair', short: 'Auto mechanic', slug: 'auto-mechanic' },
  { id: 'c1010000-0000-0000-0000-000000000005', name: 'Carpentry & Woodwork', short: 'Carpentry', slug: 'carpentry' },
  { id: 'c1010000-0000-0000-0000-000000000007', name: 'Painting & Wall Finishing', short: 'Painting', slug: 'painting' },
  { id: 'c1010000-0000-0000-0000-000000000003', name: 'Phone & Tablet Repair', short: 'Phone repair', slug: 'phone-repair' },
  { id: 'c1010000-0000-0000-0000-000000000004', name: 'Computer & Laptop Repair', short: 'Computer repair', slug: 'computer-repair' },
]

const SLUG_ALIASES: Record<string, string> = {
  'generator-repair': 'electrical',
  construction: 'carpentry',
}

const KEYWORDS: Array<[RegExp, string]> = [
  [/plumb|pipe|leak|borehole|tank|drain/, 'plumbing'],
  [/electric|solar|inverter|wiring|wire|generator/, 'electrical'],
  [/\bac\b|air ?con|cooling|fridge|refrigerat/, 'ac-cooling'],
  [/auto|mechanic|car\b|brake|engine/, 'auto-mechanic'],
  [/carpent|wood|furniture|roof|door/, 'carpentry'],
  [/paint|screed|pop|plaster/, 'painting'],
  [/phone|screen|tablet|iphone|samsung/, 'phone-repair'],
  [/computer|laptop|pc\b/, 'computer-repair'],
]

export function findCategory(value?: string | null): ServiceCategory | undefined {
  if (!value) return undefined
  const v = value.trim().toLowerCase()
  const slug = SLUG_ALIASES[v] || v
  return SERVICE_CATEGORIES.find(
    (c) => c.slug === slug || c.id === v || c.name.toLowerCase() === v || v.includes(c.short.toLowerCase())
  )
}

export function guessCategory(text?: string | null): ServiceCategory | undefined {
  if (!text) return undefined
  const t = text.toLowerCase()
  const hit = KEYWORDS.find(([re]) => re.test(t))
  return hit ? findCategory(hit[1]) : undefined
}
