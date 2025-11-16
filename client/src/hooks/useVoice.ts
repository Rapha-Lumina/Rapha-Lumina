import { useState, useEffect, useCallback, useRef } from "react";

// Speech Recognition types (browser API)
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionType {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition (only in browser environment)
    if (typeof window === 'undefined') {
      return;
    }

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition() as SpeechRecognitionType;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        const transcript = results[results.length - 1][0].transcript;
        setTranscript(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  };
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Setup browser TTS as fallback
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        
        const femaleVoice = availableVoices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('google uk english female') ||
          voice.name.toLowerCase().includes('microsoft zira')
        );

        const englishVoice = femaleVoice || availableVoices.find(voice => 
          voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('male')
        );

        setSelectedVoice(englishVoice || availableVoices[0] || null);
      };

      loadVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speakWithBrowserTTS = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      console.error('Browser TTS not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Browser TTS error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  const stop = useCallback(() => {
    // ALWAYS stop both providers to ensure clean state
    
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }

    // Stop browser TTS (always cancel, even if not currently speaking)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    if (!text) return;

    // Stop any ongoing speech from either provider
    stop();

    try {
      // Try ElevenLabs API first
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      // Check if response is audio or error BEFORE creating Audio element
      const contentType = response.headers.get('Content-Type');
      
      if (!response.ok || !contentType?.includes('audio')) {
        // ElevenLabs unavailable - fall back to browser TTS
        console.warn('ElevenLabs TTS unavailable, using browser TTS fallback');
        speakWithBrowserTTS(text, onEnd);
        return;
      }

      // Only create Audio element if we have valid audio data
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onstart = () => {
        setIsSpeaking(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioUrlRef.current = null;
        audioRef.current = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (error) => {
        console.error('Audio playback error, falling back to browser TTS:', error);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioUrlRef.current = null;
        audioRef.current = null;
        
        // Fallback to browser TTS
        speakWithBrowserTTS(text, onEnd);
      };

      setIsSpeaking(true);
      await audio.play();
    } catch (error) {
      console.error('ElevenLabs TTS error, falling back to browser TTS:', error);
      setIsSpeaking(false);
      
      // Clean up on error
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
        currentAudioUrlRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current = null;
      }

      // Fallback to browser TTS
      speakWithBrowserTTS(text, onEnd);
    }
  }, [speakWithBrowserTTS, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
    };
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  };
}
