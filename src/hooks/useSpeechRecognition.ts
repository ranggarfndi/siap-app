'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { VoiceRecorderState, VoiceRecorderResult } from '@/types'

// Web Speech API type declarations (not in standard TS lib)
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface UseSpeechRecognitionOptions {
  language?: string
  onResult?: (result: VoiceRecorderResult) => void
  onError?: (error: string) => void
  onStateChange?: (state: VoiceRecorderState) => void
}

export function useSpeechRecognition({
  language = 'id-ID',
  onResult,
  onError,
  onStateChange,
}: UseSpeechRecognitionOptions = {}) {
  const [state, setState] = useState<VoiceRecorderState>('idle')
  const [transcript, setTranscript] = useState('')

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const startTimeRef = useRef<number>(0)
  const transcriptRef = useRef<string>('')
  const accumulatedFinalRef = useRef<string>('')
  const isStoppingRef = useRef<boolean>(false)
  const isRecordingRef = useRef<boolean>(false)

  // Keep latest callbacks in refs to prevent stale closures or trigger loops
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError
  const onStateChangeRef = useRef(onStateChange)
  onStateChangeRef.current = onStateChange

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const updateState = useCallback((s: VoiceRecorderState) => {
    setState(s)
    onStateChangeRef.current?.(s)
  }, [])

  const startRecording = useCallback(() => {
    if (!isSupported) {
      onErrorRef.current?.('Browser Anda tidak mendukung fitur pengenalan suara. Gunakan Chrome atau Edge.')
      updateState('error')
      return
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      onErrorRef.current?.('SpeechRecognition API tidak tersedia.')
      updateState('error')
      return
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }

      const recognition = new SpeechRecognitionAPI()
      recognition.lang = language
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognitionRef.current = recognition
      startTimeRef.current = Date.now()
      transcriptRef.current = ''
      accumulatedFinalRef.current = ''
      isStoppingRef.current = false
      isRecordingRef.current = true
      setTranscript('')

      updateState('requesting_permission')

      recognition.onstart = () => {
        isRecordingRef.current = true
        updateState('recording')
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let newFinalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i]
          if (res.isFinal) {
            newFinalTranscript += res[0].transcript + ' '
          } else {
            interimTranscript += res[0].transcript + ' '
          }
        }

        if (newFinalTranscript) {
          accumulatedFinalRef.current = (
            accumulatedFinalRef.current + ' ' + newFinalTranscript
          ).trim()
        }

        const combined = (
          accumulatedFinalRef.current + ' ' + interimTranscript
        ).trim()

        if (combined) {
          transcriptRef.current = combined
          setTranscript(combined)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (isStoppingRef.current) return

        // Ignore harmless "no-speech" network blips while user pauses to breathe
        if (event.error === 'no-speech') {
          return
        }

        if (event.error === 'not-allowed') {
          isRecordingRef.current = false
          onErrorRef.current?.('Akses microphone belum diberikan. Aktifkan izin microphone pada browser Anda.')
          updateState('error')
        } else if (event.error !== 'aborted') {
          console.warn('SpeechRecognition warning:', event.error)
        }
      }

      recognition.onend = () => {
        // If user is still recording and hasn't explicitly stopped, restart seamlessly (avoids silence cutoff)
        if (isRecordingRef.current && !isStoppingRef.current) {
          try {
            recognition.start()
          } catch {
            // Already started or restarting
          }
          return
        }

        // If user explicitly pressed stop
        if (isStoppingRef.current) {
          const finalResult = transcriptRef.current.trim()
          const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
          isStoppingRef.current = false
          isRecordingRef.current = false

          if (finalResult) {
            updateState('completed')
            onResultRef.current?.({ transcript: finalResult, duration })
          } else {
            onErrorRef.current?.('Tidak ada suara hafalan yang terdeteksi. Silakan coba rekam kembali.')
            updateState('error')
          }
        }
      }

      recognition.start()
    } catch (err) {
      console.error('Failed to start speech recognition:', err)
      isRecordingRef.current = false
      onErrorRef.current?.('Gagal memulai microphone. Silakan coba lagi.')
      updateState('error')
    }
  }, [isSupported, language, updateState])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      isStoppingRef.current = true
      isRecordingRef.current = false
      updateState('transcribing')

      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.warn('Error stopping recognition:', e)
      }

      // Safety fallback in case onend takes too long
      setTimeout(() => {
        if (isStoppingRef.current) {
          isStoppingRef.current = false
          isRecordingRef.current = false
          const finalResult = transcriptRef.current.trim()
          const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))

          if (finalResult) {
            updateState('completed')
            onResultRef.current?.({ transcript: finalResult, duration })
          } else {
            onErrorRef.current?.('Tidak ada suara hafalan yang terdeteksi. Silakan coba rekam kembali.')
            updateState('error')
          }
        }
      }, 750)
    }
  }, [updateState])

  const reset = useCallback(() => {
    isStoppingRef.current = false
    isRecordingRef.current = false
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {}
      recognitionRef.current = null
    }
    transcriptRef.current = ''
    accumulatedFinalRef.current = ''
    setTranscript('')
    updateState('idle')
  }, [updateState])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
    }
  }, [])

  return { state, transcript, isSupported, startRecording, stopRecording, reset }
}
