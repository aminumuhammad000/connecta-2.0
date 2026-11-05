'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Shield,
  Briefcase,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Wallet,
  ShieldAlert,
} from 'lucide-react'
import { ConnectaLoader } from '@/components/brand/ConnectaLoader'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Notice,
  PageHeader,
  stagger,
} from '@/components/dashboard/ui'

export interface ClientNotification {
  id: string
  userId: string
  title: string
  desc: string
  category: 'milestone' | 'quote' | 'escrow' | 'payment' | 'security' | 'general'
  tone: 'azure' | 'success' | 'warn' | 'danger'
  read: boolean
  link?: string
  createdAt: string
  time?: string
}

type FilterCategory = 'all' | 'unread' | 'milestones_escrow' | 'quotes_projects' | 'system_security'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<ClientNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/dashboard/notifications')
      if (res.ok) {
        const body = await res.json()
        setNotifications(body.data?.notifications || [])
      }
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAllAsRead = async () => {
    if (notifications.every((n) => n.read)) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/dashboard/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setFeedbackNotice('All notifications marked as read')
        setTimeout(() => setFeedbackNotice(null), 3000)
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const markSingleAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      await fetch('/api/dashboard/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const deleteSingle = async (id: string) => {
    try {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      await fetch(`/api/dashboard/notifications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  const clearReadNotifications = async () => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/dashboard/notifications?onlyRead=true', {
        method: 'DELETE',
      })
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => !n.read))
        setFeedbackNotice('Read notifications cleared')
        setTimeout(() => setFeedbackNotice(null), 3000)
      }
    } catch (err) {
      console.error('Failed to clear read notifications:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === 'unread') return !item.read
      if (activeFilter === 'milestones_escrow') {
        return item.category === 'milestone' || item.category === 'escrow' || item.category === 'payment'
      }
      if (activeFilter === 'quotes_projects') {
        return item.category === 'quote' || item.category === 'general'
      }
      if (activeFilter === 'system_security') {
        return item.category === 'security'
      }
      return true
    })
  }, [notifications, activeFilter])

  const getToneStyle = (tone: ClientNotification['tone']) => {
    switch (tone) {
      case 'success':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          dot: 'bg-emerald-500',
          badge: 'success' as const,
        }
      case 'warn':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          dot: 'bg-amber-500',
          badge: 'warn' as const,
        }
      case 'danger':
        return {
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          dot: 'bg-rose-500',
          badge: 'danger' as const,
        }
      case 'azure':
      default:
        return {
          iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
          dot: 'bg-blue-500',
          badge: 'azure' as const,
        }
    }
  }

  const getCategoryIcon = (category: ClientNotification['category']) => {
    switch (category) {
      case 'milestone':
        return <CheckCircle2 className="w-4 h-4" />
      case 'escrow':
      case 'payment':
        return <Wallet className="w-4 h-4" />
      case 'quote':
        return <Briefcase className="w-4 h-4" />
      case 'security':
        return <Shield className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  const formatRelativeTime = (isoString: string, fallback?: string) => {
    if (fallback) return fallback
    try {
      const diffMs = Date.now() - new Date(isoString).getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours}h ago`
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    } catch {
      return fallback || 'Recently'
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      <PageHeader
        eyebrow="Account Activity"
        title="Notifications"
        description="Live updates on milestone releases, quotes, Connecta Vault deposits, and account activities."
        actions={
          <div className="flex items-center gap-2">
            {notifications.some((n) => n.read) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearReadNotifications}
                disabled={isProcessing}
              >
                Clear read
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={markAllAsRead}
              disabled={isProcessing || unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4 mr-1.5" />
              Mark all as read
            </Button>
          </div>
        }
      />

      {feedbackNotice && (
        <Notice tone="success" onClose={() => setFeedbackNotice(null)}>
          {feedbackNotice}
        </Notice>
      )}

      {/* Tabs and counts */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-ink text-white shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sunken'
            }`}
          >
            All
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-sunken text-muted'
              }`}
            >
              {notifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'unread'
                ? 'bg-ink text-white shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sunken'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-azure text-white font-semibold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('milestones_escrow')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'milestones_escrow'
                ? 'bg-ink text-white shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sunken'
            }`}
          >
            Milestones & Vault
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('quotes_projects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'quotes_projects'
                ? 'bg-ink text-white shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sunken'
            }`}
          >
            Quotes & Proposals
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('system_security')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'system_security'
                ? 'bg-ink text-white shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sunken'
            }`}
          >
            Security
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{unreadCount} unread</span>
          <span>•</span>
          <span>{notifications.length} total</span>
        </div>
      </div>

      {/* Main notifications list */}
      {isLoading ? (
        <Card className="p-12 flex flex-col items-center justify-center gap-3">
          <ConnectaLoader size={28} />
          <p className="text-sm text-muted">Loading your notifications...</p>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            illustration={
              <div className="w-12 h-12 rounded-2xl bg-sunken flex items-center justify-center text-muted">
                <Bell className="w-6 h-6" />
              </div>
            }
            title={activeFilter === 'unread' ? 'You are all caught up' : 'No notifications found'}
            description={
              activeFilter === 'unread'
                ? 'No unread notifications right now. Check back when projects or milestones have activity.'
                : 'There are no notifications matching this category.'
            }
            action={
              activeFilter !== 'all' ? (
                <Button variant="secondary" size="sm" onClick={() => setActiveFilter('all')}>
                  Show all notifications
                </Button>
              ) : (
                <Button variant="secondary" size="sm" href="/dashboard">
                  Back to Overview
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((n, idx) => {
            const styling = getToneStyle(n.tone)
            const relativeTime = formatRelativeTime(n.createdAt, n.time)

            return (
              <Card
                key={n.id}
                style={stagger(idx, 40)}
                className={`transition-all overflow-hidden border ${
                  !n.read
                    ? 'border-azure/30 bg-azure/[0.015] shadow-[0_2px_8px_-2px_rgba(26,115,232,0.08)]'
                    : 'hover:border-line-strong'
                }`}
              >
                <div className="p-4 sm:p-5 flex items-start gap-4">
                  {/* Category icon with tone */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styling.iconBg}`}
                  >
                    {getCategoryIcon(n.category)}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm ${
                          !n.read ? 'font-semibold text-ink' : 'font-medium text-ink-2'
                        }`}
                      >
                        {n.title}
                      </h3>

                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-azure inline-block shrink-0" />
                      )}

                      <span className="text-xs text-muted flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3 text-subtle" />
                        {relativeTime}
                      </span>
                    </div>

                    <p className="text-sm text-muted mt-1 leading-relaxed">{n.desc}</p>

                    {/* Bottom actions */}
                    <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-line/60">
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => {
                            if (!n.read) markSingleAsRead(n.id)
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-azure hover:text-azure-600 transition-colors"
                        >
                          <span>View details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}

                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markSingleAsRead(n.id)}
                          className="text-xs text-muted hover:text-ink font-medium transition-colors cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteSingle(n.id)}
                        className="ml-auto text-subtle hover:text-danger p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete notification"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
