import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getCommunityPosts,
  addCommunityPost,
  ServerCommunityPost,
} from '@/lib/server/db'

export async function GET() {
  try {
    const posts = getCommunityPosts()
    return successResponse(posts)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch community feed', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const { content, tags } = body

    if (!content || !content.trim()) {
      return errorResponse('Post content cannot be empty', 422)
    }

    const newPost: ServerCommunityPost = {
      id: `POST-${Date.now().toString().slice(-6)}`,
      authorId: user.id,
      authorName: user.fullName,
      authorRole: user.activeRole === 'provider' ? 'specialist' : 'client',
      authorTitle: user.headline || (user.activeRole === 'provider' ? 'Specialist Pro' : 'Client'),
      authorAvatar: user.avatarUrl || undefined,
      city: user.city,
      content: content.trim(),
      likesCount: 0,
      commentsCount: 0,
      tags: tags && tags.length > 0 ? tags : ['ConnectaCommunity', user.city],
      createdAt: new Date().toISOString(),
    }

    addCommunityPost(newPost)

    return successResponse(newPost, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to publish post', 500)
  }
}
