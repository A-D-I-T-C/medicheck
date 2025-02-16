'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { VoiceIcon } from './icons';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

function PureVoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Ignore 'aborted' errors as they're triggered when we manually stop
      if (event.error === 'aborted') {
        return;
      }
      
      console.error('Speech recognition error:', event.error);
      toast.error('Failed to recognize speech. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const toggleListening = (e: React.MouseEvent) => {
    // Prevent form submission
    e.preventDefault();
    e.stopPropagation();

    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        toast.error('Failed to start speech recognition');
        setIsListening(false);
      }
    }
  };

  return (
    <Button
      type="button" // Explicitly set button type to prevent form submission
      className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
      onClick={toggleListening}
      disabled={disabled}
      variant="ghost"
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      data-state={isListening ? 'recording' : 'idle'}
    >
      <VoiceIcon
        size={14}
        className={isListening ? 'text-red-500 animate-pulse' : ''}
      />
    </Button>
  );
}

export const VoiceInput = memo(PureVoiceInput);
