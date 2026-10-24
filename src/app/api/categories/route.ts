import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'

// Fallback seed categories if database is in disconnected/setup mode
const DEFAULT_CATEGORIES = [
  { id: 'c1010000-0000-0000-0000-000000000001', name: 'Plumbing & Pipefitting', slug: 'plumbing', description: 'Leaks, boreholes, bathroom & kitchen fittings', iconKey: 'Wrench', sortOrder: 1 },
  { id: 'c1010000-0000-0000-0000-000000000002', name: 'Electrical & Wiring', slug: 'electrical', description: 'Wiring, inverters, solar installation, breaker fixes', iconKey: 'Zap', sortOrder: 2 },
  { id: 'c1010000-0000-0000-0000-000000000003', name: 'Phone & Tablet Repair', slug: 'phone-repair', description: 'Screens, batteries, charging ports & boards', iconKey: 'Smartphone', sortOrder: 3 },
  { id: 'c1010000-0000-0000-0000-000000000004', name: 'Computer & Laptop Repair', slug: 'computer-repair', description: 'Hardware upgrades, OS reinstallation & screens', iconKey: 'Laptop', sortOrder: 4 },
  { id: 'c1010000-0000-0000-0000-000000000005', name: 'Carpentry & Woodwork', slug: 'carpentry', description: 'Custom furniture, door fittings & roof repair', iconKey: 'Hammer', sortOrder: 5 },
  { id: 'c1010000-0000-0000-0000-000000000006', name: 'Auto Mechanics & Repair', slug: 'auto-mechanic', description: 'Engine diagnostics, brakes, suspension & servicing', iconKey: 'Car', sortOrder: 6 },
  { id: 'c1010000-0000-0000-0000-000000000007', name: 'Painting & Wall Finishing', slug: 'painting', description: 'Interior/exterior painting & POP plastering', iconKey: 'Paintbrush', sortOrder: 7 },
  { id: 'c1010000-0000-0000-0000-000000000008', name: 'Air Conditioning & Cooling', slug: 'ac-cooling', description: 'AC gas refill, compressor maintenance & installation', iconKey: 'Wind', sortOrder: 8 },
]

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return successResponse(DEFAULT_CATEGORIES)
    }

    return successResponse(data)
  } catch {
    return successResponse(DEFAULT_CATEGORIES)
  }
}
