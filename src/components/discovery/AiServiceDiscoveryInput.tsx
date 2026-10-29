'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Search,
  Paperclip,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  X,
  AlertCircle,
  MapPin,
  ChevronDown,
  Navigation,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react'
import { StructuredRequestAnalysis, MatchedProviderResult } from '@/lib/ai/discovery'
import { Coordinates } from '@/lib/geo'
import { Spinner } from '@/components/brand/ConnectaLoader'

interface AttachedFileItem {
  id: string
  file: File
  previewUrl?: string
  isImage: boolean
  sizeFormatted: string
}

const EXAMPLE_PROMPTS = [
  'I need an electrician to install solar panels and a hybrid inverter in my home.',
  'My laptop will not turn on. I need someone to diagnose and repair the motherboard.',
  'I need a plumber to fix borehole submersible pump and leaking water tank pipes.',
  'I need a designer to create a brand identity and logo for my business.',
  'Need an AC technician to fix compressor and refill gas for 2 split units.',
]

const CITIES = ['All Locations', 'Kano', 'Lagos', 'Abuja', 'Kaduna', 'Port Harcourt']

interface AiServiceDiscoveryInputProps {
  onSearchResults: (
    providers: MatchedProviderResult[],
    analysis: StructuredRequestAnalysis | null
  ) => void
  onReset: () => void
  selectedCity: string
  onChangeCity: (city: string) => void
  userLocation: Coordinates | null
  onRequestLocation: () => void
  isLocating: boolean
  isAiActive: boolean
}

export default function AiServiceDiscoveryInput({
  onSearchResults,
  onReset,
  selectedCity,
  onChangeCity,
  userLocation,
  onRequestLocation,
  isLocating,
  isAiActive,
}: AiServiceDiscoveryInputProps) {
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<AttachedFileItem[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRecognitionRef = useRef<any>(null)

  // Auto-resize textarea as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        160,
        Math.max(48, textareaRef.current.scrollHeight)
      )}px`
    }
  }, [text])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl)
      })
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [attachments])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Handle file addition with validation
  const handleAddFiles = useCallback((files: FileList | File[]) => {
    setErrorMessage(null)
    const fileArray = Array.from(files)
    const newItems: AttachedFileItem[] = []

    for (const file of fileArray) {
      const lower = file.name.toLowerCase()

      // Explicitly reject unsupported formats like DOCX/DOC with friendly message
      if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
        setErrorMessage(
          'DOCX and DOC formats are not currently supported. Please upload a PDF, TXT, or image (JPEG, PNG, WebP).'
        )
        continue
      }

      const isImage = file.type.startsWith('image/')
      const isAllowedDoc =
        file.type === 'application/pdf' ||
        file.type === 'text/plain' ||
        lower.endsWith('.pdf') ||
        lower.endsWith('.txt')

      if (!isImage && !isAllowedDoc) {
        setErrorMessage(
          `"${file.name}" is not a supported file type. Please upload a JPEG, PNG, WebP, PDF, or TXT file.`
        )
        continue
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(
          `"${file.name}" exceeds the 10MB size limit (${formatFileSize(file.size)}).`
        )
        continue
      }

      let previewUrl: string | undefined = undefined
      if (isImage) {
        try {
          previewUrl = URL.createObjectURL(file)
        } catch {
          // ignore preview error
        }
      }

      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        isImage,
        sizeFormatted: formatFileSize(file.size),
      })
    }

    setAttachments((prev) => [...prev, ...newItems].slice(0, 5))
  }, [])

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((a) => a.id !== id)
    })
  }

  // Start voice recording
  const startRecording = async () => {
    setErrorMessage(null)

    // First try Web Speech API if supported for real-time transcription
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-NG' // Nigerian English
        recognition.interimResults = true
        recognition.continuous = false

        recognition.onstart = () => {
          setIsRecording(true)
          setRecordingSeconds(0)
          timerIntervalRef.current = setInterval(() => {
            setRecordingSeconds((prev) => prev + 1)
          }, 1000)
        }

        recognition.onresult = (event: any) => {
          let interim = ''
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interim += event.results[i][0].transcript
          }
          if (interim) {
            setText((prev) => {
              const base = prev.trim()
              return base ? `${base} ${interim}` : interim
            })
          }
        }

        recognition.onerror = (event: any) => {
          console.warn('[SpeechRecognition] error:', event.error)
          if (event.error === 'not-allowed') {
            setErrorMessage(
              'Microphone permission was denied. Please allow microphone access in your browser.'
            )
          }
          stopRecording()
        }

        recognition.onend = () => {
          stopRecording()
        }

        speechRecognitionRef.current = recognition
        recognition.start()
        return
      } catch (err: any) {
        console.warn('[SpeechRecognition] Fallback to MediaRecorder:', err?.message)
      }
    }

    // MediaRecorder Fallback (records audio and sends to Whisper endpoint)
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage(
        'Voice recording is not supported in this browser. Please type your request.'
      )
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          await transcribeAudioBlob(audioBlob)
        }
      }

      mediaRecorder.start(250)
      setIsRecording(true)
      setRecordingSeconds(0)
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    } catch (err: any) {
      console.warn('[Microphone] getUserMedia error:', err?.message)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(
          'Microphone permission was denied. Please enable microphone access in your browser settings.'
        )
      } else {
        setErrorMessage('Unable to access microphone. Please type your request.')
      }
      setIsRecording(false)
    }
  }

  // Stop recording
  const stopRecording = () => {
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch {
        // ignore
      }
    }
    setIsRecording(false)
  }

  // Transcribe recorded audio with server-side Whisper
  const transcribeAudioBlob = async (blob: Blob) => {
    setIsTranscribing(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', blob, 'service-voice-request.webm')

      const res = await fetch('/api/discovery/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.data?.transcript) {
        setText((prev) => {
          const base = prev.trim()
          return base ? `${base} ${data.data.transcript}` : data.data.transcript
        })
      } else {
        setErrorMessage(
          data.error || 'Could not transcribe speech clearly. Please review or type your request.'
        )
      }
    } catch (err: any) {
      console.warn('[Voice Transcribe Error]:', err?.message)
      setErrorMessage('Speech transcription failed. Please type your request.')
    } finally {
      setIsTranscribing(false)
    }
  }

  // Submit discovery search request
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isSearching) return

    const trimmedText = text.trim()
    if (!trimmedText && attachments.length === 0) {
      setErrorMessage(
        'Please describe what you need, record your voice, or attach an image or document.'
      )
      textareaRef.current?.focus()
      return
    }

    setErrorMessage(null)
    setIsSearching(true)

    try {
      const formData = new FormData()
      formData.append('text', trimmedText)
      if (selectedCity && selectedCity !== 'All Locations') {
        formData.append('city', selectedCity)
      }

      for (const item of attachments) {
        formData.append('files', item.file)
      }

      const res = await fetch('/api/discovery/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to match service providers')
      }

      const { analysis, providers } = data.data
      onSearchResults(providers, analysis)
    } catch (err: any) {
      console.error('[AI Discovery Error]:', err)
      // Preserve user input on error so nothing is lost!
      setErrorMessage(
        err.message ||
          'A network error occurred while finding matching professionals. Your request has been preserved. Please try again.'
      )
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleUsePrompt = (prompt: string) => {
    setText(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleResetSearch = () => {
    setText('')
    attachments.forEach((a) => {
      if (a.previewUrl) URL.revokeObjectURL(a.previewUrl)
    })
    setAttachments([])
    setErrorMessage(null)
    onReset()
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Primary Headline & Supporting Copy */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A1020] tracking-tight leading-tight">
          Describe What You Need. Get Matched.
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto">
          Tell us what you need done. Find the right professionals to get it done.
        </p>
      </div>

      {/* Main Request Input Capsule */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files) handleAddFiles(e.dataTransfer.files)
        }}
        className={`bg-white transition-all duration-200 shadow-xl hover:shadow-2xl border-2 rounded-3xl p-3 sm:p-4 relative ${
          dragOver
            ? 'border-[#10B981] bg-emerald-50/40 ring-4 ring-[#10B981]/20'
            : isRecording
            ? 'border-rose-400 ring-4 ring-rose-400/20 shadow-rose-100'
            : 'border-slate-900/10 focus-within:border-[#10B981] focus-within:ring-4 focus-within:ring-[#10B981]/15'
        }`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files)
            e.target.value = ''
          }}
          className="hidden"
          aria-label="Upload service request attachments"
        />

        {/* Text Area & Voice Recording Wave Bar */}
        <div className="relative">
          {isRecording ? (
            <div className="min-h-[56px] flex items-center justify-between px-3 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 animate-pulse">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping" />
                <div>
                  <p className="text-xs sm:text-sm font-bold">
                    Listening to your request... ({recordingSeconds}s)
                  </p>
                  <p className="text-[11px] text-rose-700">
                    Speak clearly in English, Pidgin, or Hausa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <MicOff className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
              placeholder="Describe what you need (e.g. 'I need an electrician to install solar panels in my home' or 'My laptop will not turn on. I need someone to diagnose and repair it')..."
              className="w-full bg-transparent text-xs sm:text-sm md:text-[15px] font-semibold text-[#0A1020] placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
            />
          )}

          {isTranscribing && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 mt-1">
              <Spinner className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transcribing your speech with AI...</span>
            </div>
          )}
        </div>

        {/* Attached Files Preview Bar */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 pb-1 border-t border-slate-100 mt-2">
            {attachments.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs group"
              >
                {item.isImage && item.previewUrl ? (
                  <div className="relative w-6 h-6 rounded-md overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                    <Image
                      src={item.previewUrl}
                      alt={item.file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                )}
                <span className="max-w-[130px] sm:max-w-[180px] truncate">
                  {item.file.name}
                </span>
                <span className="text-[10px] text-slate-400">({item.sizeFormatted})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(item.id)}
                  className="w-5 h-5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove attachment"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mt-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 hover:text-amber-950 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Controls Toolbar: Attachments, Voice, Location, Submit */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100 mt-2.5">
          {/* Left: Multimodal Input Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* File Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSearching}
              className="h-9 px-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Attach photo (JPEG/PNG/WebP) or document (PDF/TXT) up to 10MB"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              <span>Attach File</span>
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isSearching || isTranscribing}
              className={`h-9 px-3 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title="Click to speak your request (English, Hausa, Pidgin)"
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-white" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Voice</span>
                </>
              )}
            </button>

            {/* Location Selector */}
            <div className="relative flex items-center">
              <MapPin className="absolute left-2.5 w-3.5 h-3.5 text-[#10B981] pointer-events-none shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => onChangeCity(e.target.value)}
                disabled={isSearching}
                className="pl-7 pr-6 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 cursor-pointer appearance-none transition-colors"
                aria-label="Filter city"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 w-3 h-3 text-slate-400 pointer-events-none shrink-0" />
            </div>

            {/* Near Me GPS Button */}
            <button
              type="button"
              onClick={onRequestLocation}
              disabled={isLocating || isSearching}
              className={`h-9 px-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                userLocation
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={
                userLocation
                  ? 'GPS active (showing nearest to you)'
                  : 'Detect my location to find nearest artisans'
              }
            >
              <Navigation
                className={`w-3 h-3 ${
                  isLocating
                    ? 'animate-spin text-blue-600'
                    : userLocation
                    ? 'text-blue-600 fill-blue-600'
                    : 'text-slate-500'
                }`}
              />
              <span className="hidden sm:inline">Near Me</span>
            </button>
          </div>

          {/* Right: Primary Submit Action Button */}
          <div className="flex items-center gap-2">
            {(text || attachments.length > 0 || isAiActive) && (
              <button
                type="button"
                onClick={handleResetSearch}
                disabled={isSearching}
                className="h-9 px-3 rounded-full text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSearching || (!text.trim() && attachments.length === 0)}
              className="w-full sm:w-auto h-10 px-5 sm:px-6 rounded-full bg-[#0A1020] hover:bg-[#10B981] disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <Spinner className="w-4 h-4 text-white" />
                  <span>Matching Pros...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#10B981] group-hover:text-white" />
                  <span>Get Matched</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Example Prompts Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-left scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Try asking:
        </span>
        {EXAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleUsePrompt(prompt)}
            className="text-xs font-semibold text-slate-600 hover:text-[#0C513F] bg-white hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 px-3 py-1 rounded-full whitespace-nowrap shadow-2xs transition-all cursor-pointer shrink-0"
          >
            &ldquo;{prompt.length > 46 ? prompt.slice(0, 46) + '...' : prompt}&rdquo;
          </button>
        ))}
      </div>
    </div>
  )
}
