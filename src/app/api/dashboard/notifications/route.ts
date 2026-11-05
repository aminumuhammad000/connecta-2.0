import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getNotifications,
  getInAppNotifications,
  markNotificationRead,
  deleteNotification,
  clearNotifications,
} from '@/lib/server/db'

export async function GET() {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const notifications = getNotifications(user.id)
    const unreadCount = notifications.filter((n) => !n.read).length

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

export async function PATCH(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json().catch(() => ({}))
    const { id, all } = body

    if (all) {
      markNotificationRead(user.id)
    } else if (id) {
      markNotificationRead(user.id, id)
    }

    return successResponse({ success: true })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to update notification', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json().catch(() => ({}))
    const { id, all, onlyRead } = body

    if (all) {
      clearNotifications(user.id, onlyRead ?? true)
    } else if (id) {
      deleteNotification(user.id, id)
    }

    return successResponse({ success: true })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to delete notification', 500)
  }
}
