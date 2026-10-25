import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api/response'
import { getAllPublicProviders } from '@/lib/server/providers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const categorySlug = searchParams.get('category') || searchParams.get('categoryId') || undefined
  const city = searchParams.get('city') || undefined
  const search = searchParams.get('q') || searchParams.get('search') || undefined
  const minRating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined
  const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
  const sortBy = searchParams.get('sort') as 'rating' | 'reviews' | 'rate_asc' | 'rate_desc' | 'jobs' | undefined

  try {
    const providers = getAllPublicProviders({
      categorySlug,
      city,
      search,
      minRating,
      verifiedOnly,
      sortBy,
    })

    return successResponse({
      providers,
      total: providers.length,
    })
  } catch (err: any) {
    return successResponse({
      providers: [],
      total: 0,
      error: err.message,
    })
  }
}
