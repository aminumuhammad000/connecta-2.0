'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Paperclip,
  Mic,
  Image as ImageIcon,
  X,
  AlertCircle,
  MapPin,
  ChevronDown,
  Navigation,
  ArrowRight,
  ArrowUp,
  Plus,
  ShieldCheck,
  Wrench,
  Zap,
  Wind,
  Hammer,
  Car,
  Paintbrush,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Phone,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import { Coordinates, calculateDistanceKm, formatDistance, NIGERIAN_CITY_COORDINATES } from '@/lib/geo'
import { formatMinorToNaira } from '@/lib/dashboard/data'
import DashboardLayout from '@/app/dashboard/layout'
import { ConnectaLoader, ConnectaMark } from '@/components/brand/ConnectaLoader'
import { IllustrationAssistant } from '@/components/brand/illustrations'
import { Avatar, Button, Stars } from '@/components/dashboard/ui'

interface AttachedFileItem {
  id: string
  file: File
  name: string
  mimeType: string
  previewUrl?: string
  base64?: string
  isImage: boolean
  sizeFormatted: string
}

interface ProviderCardData {
  id: string
  fullName: string
  businessName: string
  headline: string
  category: string
  categorySlug: string
  city: string
  state: string
  hourlyRateMinor: number
  averageRating: number
  reviewCount: number
  completedJobsCount: number
  verificationStatus: 'verified' | 'unverified'
  avatarUrl?: string | null
  distanceKm?: number
  distanceFormatted?: string
  phone?: string
  whatsapp?: string
  matchScore: number
  matchReason?: string
  matchedSkills?: string[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachments?: Array<{
    name: string
    previewUrl?: string
    isImage: boolean
  }>
  analysis?: {
    category?: string
    urgency?: string
    location?: string
    budget?: string
    normalizedSummary?: string
  }
  providers?: ProviderCardData[]
  followUpSuggestions?: string[]
}

const CITIES = ['Kano', 'Lagos', 'Abuja', 'Kaduna', 'Port Harcourt', 'All Locations']

const PROMPT_SUGGESTIONS = [
  {
    icon: Wrench,
    title: 'Borehole Submersible Pump Breakdown',
    query: 'My borehole submersible pump stopped pumping water to the overhead tank in Kano. I need an emergency plumber.',
    category: 'Plumbing',
  },
  {
    icon: Zap,
    title: 'Solar & Inverter Inspection',
    query: 'I need a certified electrical technician to inspect my 5kVA hybrid solar inverter and test battery voltage in Kano.',
    category: 'Electrical',
  },
  {
    icon: Wind,
    title: 'AC Leaking & Not Cooling',
    query: 'My split unit air conditioner is blowing warm air and leaking water inside the room. Need gas refill and service in Kano.',
    category: 'AC & Cooling',
  },
  {
    icon: Car,
    title: 'Car Diagnostics & Engine Scan',
    query: 'My car has a check engine light on and makes a grinding sound when braking. Need a mobile auto mechanic in Kano.',
    category: 'Mechanic',
  },
]

const TRADE_SHORTCUTS = [
  { icon: Zap, label: 'Electrical', query: 'Find certified electricians and solar installers in Kano' },
  { icon: Wrench, label: 'Plumbing', query: 'Find verified emergency plumbers in Kano' },
  { icon: Wind, label: 'AC & cooling', query: 'Find AC and refrigeration repair technicians in Kano' },
  { icon: Car, label: 'Mechanic', query: 'Find mobile auto mechanics and car diagnostics in Kano' },
  { icon: Hammer, label: 'Carpentry', query: 'Find professional carpenters and roofers in Kano' },
  { icon: Paintbrush, label: 'Painting', query: 'Find wall screeders and house painters in Kano' },
]

export default function AiSearchChatPage() {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputPrompt, setInputPrompt] = useState('')
  const [selectedCity, setSelectedCity] = useState('Kano')
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Attachments State
  const [attachedFiles, setAttachedFiles] = useState<AttachedFileItem[]>([])

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  // Search History from localStorage
  const [searchHistory, setSearchHistory] = useState<Array<{ id: string; query: string; date: string }>>([])

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRecognitionRef = useRef<any>(null)

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('connecta_ai_history')
      if (saved) {
        setSearchHistory(JSON.parse(saved).slice(0, 8))
      }
    } catch {
      // ignore
    }
  }, [])

  // Save history to localStorage
  const saveToHistory = (queryText: string) => {
    if (!queryText.trim()) return
    try {
      const newEntry = {
        id: Date.now().toString(),
        query: queryText.slice(0, 48),
        date: new Date().toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
      }
      setSearchHistory((prev) => {
        const updated = [newEntry, ...prev.filter((item) => item.query !== newEntry.query)].slice(0, 10)
        localStorage.setItem('connecta_ai_history', JSON.stringify(updated))
        return updated
      })
    } catch {
      // ignore
    }
  }

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSearching])

  // Request browser geolocation
  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserCoords(coords)
        setIsLocating(false)

        let closestCity = 'Kano'
        let minDistance = Infinity
        for (const [cityName, cityCoords] of Object.entries(NIGERIAN_CITY_COORDINATES)) {
          const dist = calculateDistanceKm(coords.lat, coords.lng, cityCoords.lat, cityCoords.lng)
          if (dist < minDistance) {
            minDistance = dist
            closestCity = cityName
          }
        }
        setSelectedCity(closestCity)
      },
      (err) => {
        console.warn('Geolocation error:', err.message)
        setIsLocating(false)
        setErrorMessage('Could not retrieve your GPS location. You can select your city manually above.')
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }, [])

  // Handle files attached
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} is larger than 8MB limit.`)
        return
      }

      const isImage = file.type.startsWith('image/')
      const reader = new FileReader()

      reader.onload = () => {
        const base64 = reader.result as string
        const item: AttachedFileItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          isImage,
          previewUrl: isImage ? base64 : undefined,
          base64,
          sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        }
        setAttachedFiles((prev) => [...prev, item])
      }

      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remove attached file
  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  // Voice recording toggle
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type your message.')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-NG'

      recognition.onstart = () => {
        setIsRecording(true)
        setRecordingSeconds(0)
        timerIntervalRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1)
        }, 1000)
      }

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        stopRecording()
      }

      recognition.onend = () => {
        stopRecording()
      }

      recognition.start()
      speechRecognitionRef.current = recognition
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err)
      setErrorMessage('Microphone access denied or unavailable.')
      stopRecording()
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop()
      } catch {
        // ignore
      }
      speechRecognitionRef.current = null
    }
  }

  // Copy message text
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Submit chat message
  const handleSubmitMessage = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputPrompt
    if (!textToSend.trim() && attachedFiles.length === 0) return

    setErrorMessage(null)

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      attachments: attachedFiles.map((f) => ({
        name: f.name,
        previewUrl: f.previewUrl,
        isImage: f.isImage,
      })),
    }

    const filesToSend = [...attachedFiles]
    setInputPrompt('')
    setAttachedFiles([])
    saveToHistory(textToSend.trim() || 'Multimodal diagnostic search')

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsSearching(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments?.map((a) => {
              const matched = filesToSend.find((f) => f.name === a.name)
              return {
                name: a.name,
                mimeType: matched?.mimeType || 'image/jpeg',
                base64: matched?.base64 || '',
              }
            }),
          })),
          city: selectedCity,
          userLocation: userCoords,
        }),
      })

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}))
        throw new Error(errorJson.error || 'Failed to analyze service request')
      }

      const json = await res.json()
      const reply = json.data?.reply

      if (reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: reply.content,
          timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
          analysis: reply.analysis,
          providers: reply.providers || [],
          followUpSuggestions: reply.followUpSuggestions || [],
        }
        setMessages((prev) => [...prev, assistantMsg])
      }
    } catch (err: any) {
      console.error('AI chat error:', err)
      setErrorMessage(err.message || 'Connection error. Please try again.')

      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `I had trouble connecting to the network. You can browse all verified artisans directly in our directory or post a service request.`,
        timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
        followUpSuggestions: ['Browse plumbers', 'Browse electricians', 'Post service request'],
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle enter key submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitMessage()
    }
  }

  // Start fresh chat
  const handleNewChat = () => {
    setMessages([])
    setInputPrompt('')
    setAttachedFiles([])
    setErrorMessage(null)
  }

  return (
    <DashboardLayout>
      <div className="flex h-full w-full bg-canvas text-ink overflow-hidden relative">
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col w-[264px] bg-surface border-r border-line shrink-0 ${
            isSidebarOpen ? 'translate-x-0 cn-slide-in lg:animate-none' : '-translate-x-full lg:hidden'
          }`}
        >
          <div className="h-14 px-4 flex items-center justify-between border-b border-line">
            <span className="text-sm font-medium text-ink">Conversations</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full h-9 flex items-center gap-2 px-3 rounded-[10px] bg-ink text-white text-[13px] font-medium hover:bg-ink-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New conversation
            </button>
          </div>

          <div className="px-3 pt-2">
            <div className="px-1 pb-2 text-xs text-subtle">Browse by trade</div>
            <div className="grid grid-cols-2 gap-1.5">
              {TRADE_SHORTCUTS.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.label}
                    onClick={() => handleSubmitMessage(t.query)}
                    className="flex items-center gap-2 h-9 px-2.5 rounded-[10px] border border-line text-[13px] text-ink-2 hover:border-line-strong hover:text-ink hover:bg-canvas text-left transition-colors cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-subtle shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pt-5 pb-3">
            <div className="px-1 pb-2 text-xs text-subtle">Recent</div>
            {searchHistory.length > 0 ? (
              <ul className="space-y-0.5">
                {searchHistory.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSubmitMessage(item.query)}
                      className="w-full flex items-center justify-between gap-2 h-9 px-2.5 rounded-[10px] text-ink-2 hover:text-ink hover:bg-sunken text-[13px] text-left transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <MessageSquare className="w-3.5 h-3.5 text-subtle shrink-0" />
                        <span className="truncate">{item.query}</span>
                      </span>
                      <span className="text-[11px] text-subtle shrink-0">{item.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-1 py-4 text-[13px] text-subtle">Your past questions will appear here.</p>
            )}
          </div>
        </aside>

        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-ink/30 backdrop-blur-[2px] z-30 lg:hidden cn-fade" />
        )}

        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          <header className="h-14 px-4 sm:px-6 border-b border-line bg-surface/90 backdrop-blur-md flex items-center justify-between gap-3 z-20 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-8 h-8 rounded-lg text-muted hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Open conversations"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}
              <span className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center">
                <ConnectaMark size={14} />
              </span>
              <span className="text-sm font-medium text-ink truncate">Connecta assistant</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-subtle absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  aria-label="City"
                  className="appearance-none h-8 pl-7 pr-7 rounded-lg bg-sunken hover:bg-[#EDF0F4] text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-azure/20 cursor-pointer transition-colors"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-subtle absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={handleRequestLocation}
                disabled={isLocating}
                className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[13px] transition-colors cursor-pointer ${
                  userCoords ? 'bg-success-50 text-success-ink' : 'text-ink-2 hover:bg-sunken'
                }`}
                title="Use my location"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-pulse' : ''}`} />
                <span className="hidden md:inline">{userCoords ? 'Located' : 'Near me'}</span>
              </button>

              {messages.length > 0 && (
                <button
                  onClick={handleNewChat}
                  className="w-8 h-8 rounded-lg text-muted hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors cursor-pointer"
                  title="Start over"
                  aria-label="Start a new conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
            {messages.length === 0 ? (
              <div className="max-w-2xl mx-auto min-h-full flex flex-col items-center justify-center text-center pb-40">
                <div className="cn-rise">
                  <IllustrationAssistant className="w-44 h-33" />
                </div>
                <h1 className="mt-4 text-[26px] sm:text-[30px] font-medium tracking-[-0.02em] text-ink cn-rise" style={{ ['--d' as string]: '80ms' }}>
                  What needs fixing?
                </h1>
                <p className="mt-2 text-sm text-muted max-w-md leading-relaxed cn-rise" style={{ ['--d' as string]: '140ms' }}>
                  Describe the problem or add a photo. We will explain what is likely wrong and match you with verified professionals in{' '}
                  <span className="text-ink">{selectedCity}</span>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left mt-8">
                  {PROMPT_SUGGESTIONS.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.title}
                        onClick={() => handleSubmitMessage(item.query)}
                        className="group p-4 rounded-2xl bg-surface border border-line text-left cn-lift cn-rise cursor-pointer"
                        style={{ ['--d' as string]: `${200 + idx * 60}ms` }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-sunken text-ink-2 group-hover:bg-warn group-hover:text-ink flex items-center justify-center transition-colors">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-xs text-muted">{item.category}</span>
                        </div>
                        <div className="text-sm text-ink mt-3">{item.title}</div>
                        <div className="text-[13px] text-muted mt-1 line-clamp-1">{item.query}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6 pb-40">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user'
                  return (
                    <div key={msg.id} className={`flex items-start gap-3 cn-rise ${isUser ? 'flex-row-reverse' : ''}`}>
                      {isUser ? (
                        <span className="w-7 h-7 rounded-full bg-sunken text-ink-2 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center shrink-0">
                          <ConnectaMark size={14} />
                        </span>
                      )}

                      <div
                        className={`max-w-[88%] sm:max-w-[80%] space-y-3 ${
                          isUser
                            ? 'bg-ink text-white rounded-2xl rounded-tr-md px-4 py-3'
                            : 'bg-surface text-ink rounded-2xl rounded-tl-md border border-line px-5 py-4'
                        }`}
                      >
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {msg.attachments.map((att, i) => (
                              <div key={i} className="relative rounded-lg overflow-hidden">
                                {att.previewUrl ? (
                                  <button
                                    type="button"
                                    onClick={() => setActiveImageModal(att.previewUrl || null)}
                                    className="relative w-32 h-24 block group cursor-zoom-in"
                                  >
                                    <Image src={att.previewUrl} alt={att.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                  </button>
                                ) : (
                                  <div className="px-3 py-2 bg-white/10 text-xs flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 opacity-70" />
                                    <span>{att.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.content && <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>}

                        {!isUser && msg.analysis && msg.providers && msg.providers.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {msg.analysis.category && (
                              <span className="h-6 px-2 inline-flex items-center rounded-md bg-azure-50 text-azure-600 text-xs">{msg.analysis.category}</span>
                            )}
                            {msg.analysis.urgency && (
                              <span className="h-6 px-2 inline-flex items-center rounded-md bg-warn-50 text-warn-ink text-xs capitalize">
                                {msg.analysis.urgency}
                              </span>
                            )}
                            {msg.analysis.location && (
                              <span className="h-6 px-2 inline-flex items-center gap-1 rounded-md bg-sunken text-ink-2 text-xs">
                                <MapPin className="w-3 h-3" />
                                {msg.analysis.location}
                              </span>
                            )}
                          </div>
                        )}

                        {!isUser && msg.providers && msg.providers.length > 0 && (
                          <div className="pt-1 space-y-2.5">
                            <div className="flex items-center justify-between text-[13px]">
                              <span className="font-medium text-ink">Best matches near you</span>
                              <span className="text-muted">{msg.providers.length} available</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.providers.map((pro, pIdx) => (
                                <div
                                  key={pro.id}
                                  className="rounded-xl border border-line p-3.5 bg-canvas/50 hover:bg-surface hover:border-line-strong transition-colors cn-rise"
                                  style={{ ['--d' as string]: `${pIdx * 60}ms` }}
                                >
                                  <div className="flex items-center gap-2.5">
                                    {pro.avatarUrl ? (
                                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                                        <Image src={pro.avatarUrl} alt={pro.fullName} fill className="object-cover" />
                                      </div>
                                    ) : (
                                      <Avatar name={pro.fullName} size={36} />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[13px] font-medium text-ink truncate">{pro.fullName}</div>
                                      <div className="text-xs text-muted truncate">{pro.businessName}</div>
                                    </div>
                                    <Stars rating={pro.averageRating} />
                                  </div>
                                  <div className="text-xs text-muted mt-2.5">
                                    {pro.completedJobsCount} jobs done
                                    {pro.distanceFormatted && ` · ${pro.distanceFormatted} away`}
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-2">
                                    <span className="text-[13px] text-ink tabular-nums">{formatMinorToNaira(pro.hourlyRateMinor)}/hr</span>
                                    <div className="flex items-center gap-1">
                                      {pro.whatsapp && (
                                        <a
                                          href={`https://wa.me/${pro.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                            `Hello ${pro.fullName}, I saw your verified profile on Connecta for a ${pro.category} task in ${pro.city}. Are you available?`
                                          )}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="w-7 h-7 rounded-lg text-muted hover:text-success-ink hover:bg-success-50 flex items-center justify-center transition-colors"
                                          title="WhatsApp"
                                          aria-label={`WhatsApp ${pro.fullName}`}
                                        >
                                          <Phone className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      <Link
                                        href={`/providers/${pro.id}`}
                                        className="h-7 px-2.5 inline-flex items-center rounded-lg text-xs text-ink-2 hover:bg-sunken transition-colors"
                                      >
                                        Profile
                                      </Link>
                                      <Link
                                        href={`/requests/new?providerId=${pro.id}&category=${pro.categorySlug}&q=${encodeURIComponent(
                                          msg.analysis?.normalizedSummary || pro.category
                                        )}`}
                                        className="h-7 px-2.5 inline-flex items-center gap-1 rounded-lg bg-azure hover:bg-azure-600 text-white text-xs font-medium transition-colors"
                                      >
                                        Request
                                        <ArrowRight className="w-3 h-3" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!isUser && msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {msg.followUpSuggestions.map((sug, i) => (
                              <button
                                key={i}
                                onClick={() => handleSubmitMessage(sug)}
                                className="h-7 px-3 rounded-full border border-line text-xs text-ink-2 hover:border-warn hover:bg-warn-50 hover:text-warn-ink transition-colors cursor-pointer"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        )}

                        {!isUser && (
                          <div className="flex items-center justify-between pt-3 border-t border-line text-xs text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-success" />
                              Payment protected
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="inline-flex items-center gap-1 h-6 px-1.5 rounded-md hover:bg-sunken hover:text-ink transition-colors cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-success" />
                                  <span className="text-success-ink">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {isSearching && (
                  <div className="flex items-start gap-3 cn-rise">
                    <span className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center shrink-0">
                      <ConnectaMark size={14} />
                    </span>
                    <div className="bg-surface border border-line rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2.5">
                      <ConnectaLoader size={18} showTrack={false} />
                      <span className="text-[13px] text-muted">Looking into it…</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-10 bg-gradient-to-t from-canvas via-canvas/95 to-transparent pointer-events-none z-10">
            <div className="max-w-3xl mx-auto pointer-events-auto space-y-2">
              {errorMessage && (
                <div className="cn-pop flex items-center justify-between gap-2 rounded-xl bg-danger-50 text-danger-ink px-3.5 py-2.5 text-[13px]">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </span>
                  <button onClick={() => setErrorMessage(null)} className="opacity-60 hover:opacity-100 cursor-pointer" aria-label="Dismiss">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="bg-surface rounded-2xl border border-line-strong shadow-[0_8px_24px_-12px_rgba(17,24,39,0.15)] p-2 transition-[border-color,box-shadow] duration-200 focus-within:border-warn focus-within:ring-4 focus-within:ring-warn/15">
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 pb-2.5 mb-1 border-b border-line">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="cn-pop flex items-center gap-1.5 h-8 pl-1 pr-1.5 rounded-lg bg-sunken text-xs text-ink-2">
                        {file.isImage && file.previewUrl ? (
                          <div className="relative w-6 h-6 rounded-md overflow-hidden">
                            <Image src={file.previewUrl} alt={file.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted ml-1" />
                        )}
                        <span className="max-w-[120px] truncate">{file.name}</span>
                        <button onClick={() => handleRemoveFile(file.id)} className="text-subtle hover:text-danger cursor-pointer" aria-label={`Remove ${file.name}`}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {isRecording ? (
                  <div className="flex items-center justify-between gap-3 px-2.5 py-1.5">
                    <div className="flex items-center gap-2.5 text-sm text-ink">
                      <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                      Listening
                      <span className="text-muted tabular-nums">{recordingSeconds}s</span>
                    </div>
                    <Button size="sm" variant="warm" onClick={stopRecording}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-end gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-9 h-9 rounded-xl text-muted hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Add a photo or document"
                      aria-label="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <textarea
                      ref={textareaRef}
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder={`Describe what needs fixing in ${selectedCity}…`}
                      className="flex-1 max-h-36 bg-transparent text-ink placeholder:text-subtle text-sm py-2 px-1 focus:outline-none resize-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-9 h-9 rounded-xl text-muted hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Speak instead"
                      aria-label="Record voice"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitMessage()}
                      disabled={isSearching || (!inputPrompt.trim() && attachedFiles.length === 0)}
                      className="w-9 h-9 rounded-xl bg-warn hover:bg-warn-600 disabled:bg-sunken disabled:text-subtle text-ink flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
                      aria-label="Send"
                    >
                      {isSearching ? <ConnectaLoader size={16} showTrack={false} mono /> : <ArrowUp className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-center text-xs text-subtle">Your money is only released after you approve the work.</p>
            </div>
          </div>
        </main>

        {activeImageModal && (
          <div className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4 cn-fade" onClick={() => setActiveImageModal(null)}>
            <div className="relative max-w-4xl max-h-[85vh] w-full h-full cn-pop">
              <Image src={activeImageModal} alt="Preview" fill className="object-contain" />
              <button
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 text-white hover:bg-white/30 flex items-center justify-center cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
