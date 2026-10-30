import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { getActiveUser, getInAppNotifications, markNotificationRead } from '@/lib/server/db'

export async function GET() {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const notifications = getInAppNotifications(user.id)
    const unreadCount = notifications.filter((n) => !n.readBy || !n.readBy.includes(user.id)).length

    return successResponse({
      notifications,
      unreadCount,
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch notifications', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const { notificationId } = body

    if (notificationId) {
      markNotificationRead(notificationId, user.id)
    }

    return successResponse({ success: true, message: 'Notification marked as read' })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to update notification', 500)
  }
}
