'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Rss,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  CheckCircle2,
  Send,
  Zap,
} from 'lucide-react'
import { DASHBOARD_FEED_ITEMS, DashboardFeedItem } from '@/lib/dashboard/data'

export default function DashboardFeedPage() {
  const [feed, setFeed] = useState<DashboardFeedItem[]>(DASHBOARD_FEED_ITEMS)
  const [newPostText, setNewPostText] = useState('')
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostText.trim()) return

    const newItem: DashboardFeedItem = {
      id: `f-${Date.now()}`,
      actorName: 'Tunde Bakare',
      actorRole: 'Founder at PayFlow',
      actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      postType: 'general',
      title: 'Community Milestone Update',
      body: newPostText,
      emoji: '⚡',
      likesCount: 1,
      timeAgo: 'Just now',
    }

    setFeed([newItem, ...feed])
    setNewPostText('')
  }

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }))
    setFeed((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const isLiked = likedPosts[id]
        return {
          ...item,
          likesCount: isLiked ? item.likesCount - 1 : item.likesCount + 1,
        }
      })
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0C513F] tracking-wider">
          Social Proof &amp; Verified Progress
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
          Connecta Community Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Celebrating milestone payouts, newly formed Collabo Squads, and completed trade deliveries across Africa.
        </p>
      </div>

      {/* Share Update Input Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
              alt="You"
              fill
              className="object-cover"
            />
          </div>
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share a milestone release, trade victory, or squad announcement..."
            className="flex-1 bg-[#F5F7FC] border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0C513F] focus:bg-white font-medium placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handleCreatePost}
            disabled={!newPostText.trim()}
            className="px-4 py-2.5 rounded-2xl bg-[#0C513F] text-white font-extrabold text-xs hover:bg-[#083b2e] disabled:opacity-40 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {feed.map((post) => {
          const isLiked = likedPosts[post.id]
          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3.5"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={post.actorAvatar}
                      alt={post.actorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#0A1020] flex items-center gap-1.5">
                      <span>{post.actorName}</span>
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {post.actorRole} • {post.timeAgo}
                    </div>
                  </div>
                </div>

                <span className="text-xl">{post.emoji}</span>
              </div>

              {/* Title & Body */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-[#0A1020]">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {post.body}
                </p>
              </div>

              {/* Social Interactions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                <button
                  type="button"
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likesCount} Cheers</span>
                </button>

                <div className="flex items-center gap-4 text-slate-400">
                  <button type="button" className="hover:text-slate-700 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comment</span>
                  </button>
                  <button type="button" className="hover:text-slate-700 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
