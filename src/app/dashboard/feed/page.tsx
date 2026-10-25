'use client'

import React, { useState, useEffect } from 'react'
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
  Loader2,
} from 'lucide-react'

interface ServerFeedPost {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  authorTitle: string
  authorAvatar?: string
  city: string
  content: string
  likesCount: number
  commentsCount: number
  tags: string[]
  createdAt: string
}

export default function DashboardFeedPage() {
  const [feed, setFeed] = useState<ServerFeedPost[]>([])
  const [newPostText, setNewPostText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/dashboard/feed')
      if (res.ok) {
        const body = await res.json()
        setFeed(body.data || [])
      }
    } catch (err) {
      console.error('Failed to load feed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostText.trim()) return

    setIsPosting(true)
    try {
      const res = await fetch('/api/dashboard/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostText.trim() }),
      })

      if (res.ok) {
        setNewPostText('')
        await fetchFeed()
      }
    } catch (err) {
      console.error('Post creation error:', err)
    } finally {
      setIsPosting(false)
    }
  }

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }))
    setFeed((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const isLiked = likedPosts[id]
        return {
          ...item,
          likesCount: isLiked ? Math.max(0, item.likesCount - 1) : item.likesCount + 1,
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
          Celebrating milestone payouts, newly formed Collabo Squads, and completed trade deliveries across Nigeria.
        </p>
      </div>

      {/* Share Update Input Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <form onSubmit={handleCreatePost} className="flex items-center gap-3">
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share a milestone release, trade victory, or squad announcement..."
            className="flex-1 bg-[#F5F7FC] border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0C513F] focus:bg-white font-medium placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!newPostText.trim() || isPosting}
            className="px-4 py-2.5 rounded-2xl bg-[#0C513F] text-white font-extrabold text-xs hover:bg-[#083b2e] disabled:opacity-40 transition-all cursor-pointer shrink-0"
          >
            {isPosting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>

      {/* Feed Stream */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-[#0C513F] animate-spin" />
          <span className="text-xs font-bold text-slate-400">Loading live community updates...</span>
        </div>
      ) : feed.length > 0 ? (
        <div className="space-y-4">
          {feed.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0A1020] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {post.authorName ? post.authorName.slice(0, 2).toUpperCase() : 'CU'}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-[#0A1020]">
                      {post.authorName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {post.authorTitle} • {post.city}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {post.content}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <button
                  type="button"
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    likedPosts[post.id] ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts[post.id] ? 'fill-current' : ''}`} />
                  <span>{post.likesCount || 0}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] text-emerald-700 font-bold">Connecta Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-sm">
          <Rss className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-black text-[#0A1020]">No Community Posts Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Be the first to share a trade breakthrough, project completion, or collaboration update!
          </p>
        </div>
      )}
    </div>
  )
}
