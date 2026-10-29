'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Search,
  Paperclip,
  Mic,
  MicOff,
  FileText,
  X,
  AlertCircle,
  MapPin,
  ChevronDown,
  Navigation,
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
    <div className="w-full max-w-3xl mx-auto">
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
        className={`bg-surface rounded-2xl border p-3 sm:p-4 text-left shadow-[0_12px_32px_-16px_rgba(17,24,39,0.18)] transition-[border-color,box-shadow] duration-200 ${
          dragOver
            ? 'border-success ring-4 ring-success/15'
            : isRecording
            ? 'border-danger ring-4 ring-danger/10'
            : 'border-line-strong focus-within:border-azure focus-within:ring-4 focus-within:ring-azure/10'
        }`}
      >
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
          aria-label="Upload photos or documents"
        />

        {isRecording ? (
          <div className="min-h-[56px] flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
              <div>
                <p className="text-sm font-medium text-ink">
                  Listening <span className="text-muted tabular-nums">{recordingSeconds}s</span>
                </p>
                <p className="text-xs text-muted">English, Pidgin or Hausa</p>
              </div>
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="h-8 px-3 rounded-lg bg-ink text-white text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <MicOff className="w-3.5 h-3.5" />
              Done
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 px-1">
            <Search className="w-5 h-5 text-subtle mt-[11px] shrink-0" />
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
              placeholder="What needs fixing?"
              aria-label="Describe what you need"
              className="w-full bg-transparent text-[15px] text-ink placeholder:text-subtle focus:outline-none resize-none leading-relaxed py-2.5"
            />
          </div>
        )}

        {isTranscribing && (
          <div className="mt-1 mx-1 flex items-center gap-2 text-[13px] text-muted">
            <Spinner className="w-4 h-4" colored />
            Turning your voice into text…
          </div>
        )}

        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2.5 border-t border-line">
            {attachments.map((item) => (
              <div key={item.id} className="cn-pop flex items-center gap-1.5 h-8 pl-1 pr-1.5 rounded-lg bg-sunken text-xs text-ink-2">
                {item.isImage && item.previewUrl ? (
                  <div className="relative w-6 h-6 rounded-md overflow-hidden">
                    <Image src={item.previewUrl} alt={item.file.name} fill className="object-cover" />
                  </div>
                ) : (
                  <FileText className="w-4 h-4 text-muted ml-1" />
                )}
                <span className="max-w-[140px] truncate">{item.file.name}</span>
                <span className="text-subtle">{item.sizeFormatted}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                  className="text-subtle hover:text-danger cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errorMessage && (
          <div className="cn-pop mt-2 flex items-start gap-2 rounded-xl bg-warn-50 text-warn-ink px-3 py-2.5 text-[13px]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1">{errorMessage}</span>
            <button type="button" onClick={() => setErrorMessage(null)} aria-label="Dismiss" className="opacity-60 hover:opacity-100 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="mt-2.5 pt-2.5 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSearching}
              title="Add a photo or document (up to 10MB)"
              className="h-9 px-2.5 rounded-lg text-[13px] text-ink-2 hover:bg-sunken hover:text-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Paperclip className="w-4 h-4 text-muted" />
              <span className="hidden sm:inline">Photo</span>
            </button>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isSearching || isTranscribing}
              title="Speak your request"
              className={`h-9 px-2.5 rounded-lg text-[13px] inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ${
                isRecording ? 'bg-danger-50 text-danger-ink' : 'text-ink-2 hover:bg-sunken hover:text-ink'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-muted" />}
              <span className="hidden sm:inline">{isRecording ? 'Stop' : 'Voice'}</span>
            </button>
            <span className="w-px h-5 bg-line mx-1" />
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-subtle absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => onChangeCity(e.target.value)}
                disabled={isSearching}
                aria-label="City"
                className="appearance-none h-9 pl-7 pr-7 rounded-lg text-[13px] text-ink-2 hover:bg-sunken bg-transparent focus:outline-none focus:ring-2 focus:ring-azure/20 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All Locations' ? 'All cities' : c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-subtle absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={onRequestLocation}
              disabled={isLocating || isSearching}
              title={userLocation ? 'Showing the nearest professionals first' : 'Find professionals near me'}
              className={`h-9 px-2.5 rounded-lg text-[13px] inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                userLocation ? 'bg-success-50 text-success-ink' : 'text-ink-2 hover:bg-sunken hover:text-ink'
              }`}
            >
              {isLocating ? <Spinner className="w-4 h-4" colored /> : <Navigation className="w-3.5 h-3.5" />}
              {userLocation ? 'Near you' : 'Near me'}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {(text || attachments.length > 0 || isAiActive) && (
              <button
                type="button"
                onClick={handleResetSearch}
                disabled={isSearching}
                className="h-9 px-3 rounded-lg text-[13px] text-muted hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSearching || (!text.trim() && attachments.length === 0)}
              className="flex-1 sm:flex-none h-10 px-5 rounded-[10px] bg-azure hover:bg-azure-600 disabled:bg-sunken disabled:text-subtle text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Finding matches
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Find my match
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <span className="text-xs text-subtle shrink-0">Try</span>
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleUsePrompt(prompt)}
            className="h-8 px-3 rounded-full border border-line bg-surface text-xs text-ink-2 hover:border-warn hover:bg-warn-50 hover:text-warn-ink whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            {prompt.length > 42 ? `${prompt.slice(0, 42)}…` : prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
