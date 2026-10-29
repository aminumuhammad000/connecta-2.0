'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  Search,
  Paperclip,
  Mic,
  Image as ImageIcon,
  X,
  Loader2,
  AlertCircle,
  MapPin,
  ChevronDown,
  Navigation,
  ArrowRight,
  Send,
  Plus,
  ShieldCheck,
  Star,
  CheckCircle2,
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
      <div className="flex h-full w-full bg-[#F9FAFB] text-zinc-900 font-sans overflow-hidden relative">
        {/* Left Minimalist Inquiries Panel */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-zinc-200/80 transition-all duration-200 ease-in-out shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Panel Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0C513F]" />
            <span className="font-semibold text-xs text-zinc-900">Trades &amp; Inquiries</span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            title="Close panel"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Search Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-zinc-800 text-xs font-medium transition-all"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#0C513F]" />
              <span>New Conversation</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono bg-white border border-zinc-200 px-1.5 py-0.5 rounded">⌘K</span>
          </button>
        </div>

        {/* Quick Categories Navigation */}
        <div className="px-3 py-2 space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 px-2 py-1">
            Browse by Trade
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px] font-medium">
            <button
              onClick={() => handleSubmitMessage('Find certified electricians and solar installers in Kano')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-zinc-600 hover:text-zinc-900 text-left transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">Electrical</span>
            </button>
            <button
              onClick={() => handleSubmitMessage('Find verified emergency plumbers in Kano')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-zinc-600 hover:text-zinc-900 text-left transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">Plumbing</span>
            </button>
            <button
              onClick={() => handleSubmitMessage('Find AC and refrigeration repair technicians in Kano')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-zinc-600 hover:text-zinc-900 text-left transition-colors"
            >
              <Wind className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">AC &amp; Cold</span>
            </button>
            <button
              onClick={() => handleSubmitMessage('Find mobile auto mechanics and car diagnostics in Kano')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-zinc-600 hover:text-zinc-900 text-left transition-colors"
            >
              <Car className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">Mechanic</span>
            </button>
            <button
              onClick={() => handleSubmitMessage('Find professional carpenters and roofers in Kano')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-zinc-600 hover:text-zinc-900 text-left transition-colors"
            >
              <Hammer className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">Carpentry</span>
            </button>
            <button
              onClick={() => handleSubmitMessage('Find wall screeders and house painters in Kano')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-zinc-600 hover:text-zinc-900 text-left transition-colors"
            >
              <Paintbrush className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">Painting</span>
            </button>
          </div>
        </div>

        {/* Recent Search Inquiries */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 px-2 py-1">
            Recent Inquiries
          </div>
          {searchHistory.length > 0 ? (
            <div className="space-y-0.5">
              {searchHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSubmitMessage(item.query)}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-xs text-left transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate font-normal">{item.query}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">{item.date}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-6 text-center text-zinc-400 text-xs font-normal">
              No recent searches yet.
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-2xs z-40 lg:hidden cursor-pointer"
        />
      )}

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-full bg-[#F9FAFB] relative overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 px-4 sm:px-6 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 z-30 shrink-0">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Open sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-900">
                Connecta Assistant
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                Local Technical Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Minimal City Selector (No Emojis) */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#0C513F] cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Locate Me Button */}
            <button
              onClick={handleRequestLocation}
              disabled={isLocating}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                userCoords
                  ? 'bg-emerald-50 text-[#0C513F] border border-emerald-200'
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200'
              }`}
              title="Use current location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">
                {userCoords ? 'GPS Active' : 'Near Me'}
              </span>
            </button>

            {/* Clear Button */}
            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                title="Start fresh conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {messages.length === 0 ? (
            /* Minimalist Empty State */
            <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center text-center py-10 space-y-6 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#0C513F] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  How can Connecta help you today?
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
                  Describe what needs repair, upload a photo of the defect, or get cost estimates. We match vetted artisans in <strong className="font-semibold text-zinc-900">{selectedCity}</strong> backed by guaranteed payment protection.
                </p>
              </div>

              {/* Minimal Suggestion Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left pt-2">
                {PROMPT_SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSubmitMessage(item.query)}
                      className="p-3.5 rounded-xl bg-white hover:bg-zinc-50/80 border border-zinc-200/80 hover:border-zinc-300 transition-all text-left space-y-1.5 group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          {item.category}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#0C513F] transition-colors" />
                      </div>
                      <div className="font-semibold text-xs text-zinc-900 group-hover:text-[#0C513F] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 line-clamp-1 font-normal">
                        {item.query}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Active Messages List */
            <div className="max-w-3xl mx-auto space-y-5 pb-32">
              {messages.map((msg) => {
                const isUser = msg.role === 'user'

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? 'flex-row-reverse justify-start' : 'justify-start'
                    } animate-in fade-in duration-200`}
                  >
                    {/* Minimal Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                        isUser
                          ? 'bg-zinc-900 text-white'
                          : 'bg-[#0C513F] text-white'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 space-y-3 ${
                        isUser
                          ? 'bg-zinc-900 text-white rounded-tr-sm'
                          : 'bg-white text-zinc-800 rounded-tl-sm border border-zinc-200/80 shadow-2xs'
                      }`}
                    >
                      {/* Attached Images in User Bubble */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="relative rounded-lg overflow-hidden border border-zinc-700">
                              {att.previewUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveImageModal(att.previewUrl || null)}
                                  className="relative w-32 h-24 block group cursor-zoom-in"
                                >
                                  <Image
                                    src={att.previewUrl}
                                    alt={att.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                </button>
                              ) : (
                                <div className="p-2.5 bg-zinc-800 text-xs text-zinc-200 flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4 text-zinc-400" />
                                  <span>{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Main Message Text */}
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                        {msg.content}
                      </div>

                      {/* Assistant Actions Bar */}
                      {!isUser && (
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[10px] text-zinc-400">
                          <span className="flex items-center gap-1 font-medium text-[#0C513F]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            100% Payment Protected
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-700 transition-colors py-0.5 px-1.5 rounded hover:bg-zinc-100"
                            title="Copy reply text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#0C513F]" />
                                <span className="text-[#0C513F] font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* AI Structured Analysis Badges */}
                      {!isUser && msg.analysis && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {msg.analysis.category && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                              {msg.analysis.category}
                            </span>
                          )}
                          {msg.analysis.urgency && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                              Priority: {msg.analysis.urgency}
                            </span>
                          )}
                          {msg.analysis.location && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-zinc-400" />
                              {msg.analysis.location}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Recommended Nearest Providers Cards */}
                      {!isUser && msg.providers && msg.providers.length > 0 && (
                        <div className="pt-2 space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                            <span>Top Matched Artisans Near You</span>
                            <span className="text-zinc-400 font-normal">
                              {msg.providers.length} available
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {msg.providers.map((pro) => (
                              <div
                                key={pro.id}
                                className="bg-zinc-50/60 hover:bg-white rounded-xl p-3 border border-zinc-200/80 hover:border-zinc-300 transition-all space-y-2.5"
                              >
                                <div className="flex items-start justify-between gap-2.5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-200 overflow-hidden relative shrink-0">
                                      {pro.avatarUrl ? (
                                        <Image
                                          src={pro.avatarUrl}
                                          alt={pro.fullName}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0C513F] bg-emerald-50">
                                          {pro.fullName.slice(0, 2).toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-semibold text-xs text-zinc-900 truncate">
                                        {pro.fullName}
                                      </h4>
                                      <p className="text-[10px] text-zinc-500 truncate">
                                        {pro.businessName}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="shrink-0 text-[10px] font-semibold text-zinc-700 bg-white border border-zinc-200 px-1.5 py-0.5 rounded">
                                    {pro.averageRating.toFixed(1)}/5
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-normal">
                                  <span>{pro.completedJobsCount} jobs completed</span>
                                  {pro.distanceFormatted && (
                                    <>
                                      <span>•</span>
                                      <span>~{pro.distanceFormatted} away</span>
                                    </>
                                  )}
                                </div>

                                <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between gap-2">
                                  <div>
                                    <div className="text-[10px] font-semibold text-zinc-900">
                                      {formatMinorToNaira(pro.hourlyRateMinor)}/hr
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {pro.whatsapp && (
                                      <a
                                        href={`https://wa.me/${pro.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                          `Hello ${pro.fullName}, I saw your verified profile on Connecta for a ${pro.category} task in ${pro.city}. Are you available?`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                                        title="WhatsApp"
                                      >
                                        <Phone className="w-3 h-3" />
                                      </a>
                                    )}
                                    <Link
                                      href={`/providers/${pro.id}`}
                                      className="px-2 py-1 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-medium transition-colors"
                                    >
                                      Profile
                                    </Link>
                                    <Link
                                      href={`/requests/new?providerId=${pro.id}&category=${pro.categorySlug}&q=${encodeURIComponent(
                                        msg.analysis?.normalizedSummary || pro.category
                                      )}`}
                                      className="px-2.5 py-1 rounded-lg bg-[#0C513F] hover:bg-[#083b2e] text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                                    >
                                      <span>Request</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Suggestions Chips */}
                      {!isUser && msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {msg.followUpSuggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSubmitMessage(sug)}
                              className="text-[11px] font-normal px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors text-left cursor-pointer"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Searching Indicator */}
              {isSearching && (
                <div className="flex items-start gap-3 justify-start animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-lg bg-[#0C513F] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-zinc-200/80 rounded-2xl rounded-tl-sm p-3.5 text-xs text-zinc-500 flex items-center gap-2 shadow-2xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0C513F]" />
                    <span>Searching verified artisans and diagnosing in {selectedCity}...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Minimal Bottom Floating Prompt Capsule */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/95 to-transparent pointer-events-none z-40">
          <div className="max-w-3xl mx-auto pointer-events-auto space-y-2">
            {/* Error Message Toast */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:text-zinc-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Input Box */}
            <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm p-2 transition-all focus-within:border-[#0C513F] focus-within:ring-2 focus-within:ring-[#0C513F]/10">
              {/* Attachment Preview Chips */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 pb-2 border-b border-zinc-100">
                  {attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-100 text-xs text-zinc-700"
                    >
                      {file.isImage && file.previewUrl ? (
                        <div className="relative w-5 h-5 rounded overflow-hidden">
                          <Image src={file.previewUrl} alt={file.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
                      )}
                      <span className="max-w-[120px] truncate text-[11px]">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-0.5 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Recording Active Overlay */}
              {isRecording ? (
                <div className="p-2.5 flex items-center justify-between gap-3 bg-zinc-50 rounded-xl text-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-medium">Recording voice note...</span>
                    <span className="font-mono text-xs text-zinc-500">{recordingSeconds}s</span>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="px-3 py-1 rounded-lg bg-[#0C513F] text-white hover:bg-[#083b2e] text-xs font-medium"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Standard Text Input */
                <div className="flex items-end gap-1.5">
                  {/* File Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
                    title="Attach photo or document"
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

                  {/* Auto-expanding Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder={`Describe your service need in ${selectedCity}...`}
                    className="flex-1 max-h-36 bg-transparent text-zinc-900 placeholder:text-zinc-400 text-xs sm:text-sm py-1.5 px-1 focus:outline-none resize-none leading-relaxed font-normal"
                  />

                  {/* Mic Button */}
                  <button
                    type="button"
                    onClick={startRecording}
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
                    title="Record voice note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSubmitMessage()}
                    disabled={isSearching || (!inputPrompt.trim() && attachedFiles.length === 0)}
                    className="w-8 h-8 rounded-lg bg-[#0C513F] hover:bg-[#083b2e] disabled:opacity-30 disabled:hover:bg-[#0C513F] text-white flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    title="Send"
                  >
                    {isSearching ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="text-center text-[10px] text-zinc-400 font-normal">
              Protected by Connecta Milestone Vault. Funds are released only after inspection.
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal Lightbox */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-2xs"
          onClick={() => setActiveImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full">
            <Image
              src={activeImageModal}
              alt="Preview"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
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
