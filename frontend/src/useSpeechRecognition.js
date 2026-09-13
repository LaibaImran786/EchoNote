import { useCallback, useRef, useState } from "react";

export function useSpeechRecognition() {
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(
        window.SpeechRecognition ||
        window.webkitSpeechRecognition
      )
  );

  const recognitionRef = useRef(null);
  const finalRef = useRef("");
  const onCompleteRef = useRef(null);
  const stoppedRef = useRef(false);
  const restartTimerRef = useRef(null);
  const isRunningRef = useRef(false);

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [speechError, setSpeechError] = useState("");

  const start = useCallback(
    (onComplete) => {
      if (!supported) return false;

      // Clean up any previous recognition
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
      }

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

      // Settings optimized for faster transcription
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      finalRef.current = "";
      onCompleteRef.current = onComplete;
      stoppedRef.current = false;
      isRunningRef.current = false;

      setInterim("");
      setSpeechError("");

      recognition.onstart = () => {
        isRunningRef.current = true;
        setListening(true);
      };

      recognition.onresult = (event) => {
        let interimText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const result = event.results[i];

          if (!result || !result[0]) continue;

          const text = result[0].transcript.trim();

          if (!text) continue;

          if (result.isFinal) {
            const current = finalRef.current.trim();

            if (!current) {
              finalRef.current = text;
              continue;
            }

            const currentLower = current.toLowerCase();
            const textLower = text.toLowerCase();

            // Ignore exact duplicate
            if (currentLower === textLower) {
              continue;
            }

            // Ignore if the new result is already inside
            // the existing transcript
            if (currentLower.includes(textLower)) {
              continue;
            }

            const currentWords = currentLower.split(/\s+/);
            const newWords = textLower.split(/\s+/);

            /*
             * Detect overlapping words.
             *
             * Example:
             * Current: "I am very happy"
             * New:     "very happy today"
             *
             * Result:
             * "I am very happy today"
             */
            let overlap = 0;

            const maxOverlap = Math.min(
              currentWords.length,
              newWords.length,
              8
            );

            for (
              let count = maxOverlap;
              count >= 1;
              count--
            ) {
              const oldEnd = currentWords
                .slice(-count)
                .join(" ");

              const newStart = newWords
                .slice(0, count)
                .join(" ");

              if (oldEnd === newStart) {
                overlap = count;
                break;
              }
            }

            if (overlap > 0) {
              const remaining = newWords
                .slice(overlap)
                .join(" ");

              if (remaining) {
                finalRef.current =
                  `${current} ${remaining}`.trim();
              }
            } else {
              finalRef.current =
                `${current} ${text}`.trim();
            }
          } else {
            // Show interim text immediately
            interimText += `${text} `;
          }
        }

        setInterim(interimText.trim());
      };

      recognition.onerror = (event) => {
        const messages = {
          "not-allowed":
            "Microphone permission was blocked. Allow microphone access and try again.",

          "audio-capture":
            "No microphone was found. Check your microphone settings.",

          "no-speech":
            "No speech was detected. Keep speaking or try again.",

          network:
            "Speech recognition could not reach the browser speech service.",
        };

        setSpeechError(
          messages[event.error] ||
            `Speech recognition error: ${event.error}`
        );

        if (
          event.error === "not-allowed" ||
          event.error === "audio-capture" ||
          event.error === "network"
        ) {
          stoppedRef.current = true;
        }
      };

      recognition.onend = () => {
        isRunningRef.current = false;
        setInterim("");

        /*
         * Chrome sometimes ends continuous recognition
         * automatically. Restart quickly without finalizing
         * the recording.
         */
        if (!stoppedRef.current) {
          restartTimerRef.current = setTimeout(() => {
            restartTimerRef.current = null;

            if (stoppedRef.current) return;

            try {
              recognition.start();
            } catch {
              // Ignore browser transition errors
            }
          }, 50);

          return;
        }

        setListening(false);

        const transcript = finalRef.current.trim();
        const callback = onCompleteRef.current;

        if (transcript && callback) {
          onCompleteRef.current = null;
          callback(transcript);
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
        return true;
      } catch (error) {
        stoppedRef.current = true;
        isRunningRef.current = false;
        setListening(false);

        setSpeechError(
          error.message ||
            "Could not start speech recognition."
        );

        return false;
      }
    },
    [supported]
  );

  const stop = useCallback(() => {
    stoppedRef.current = true;

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    const recognition = recognitionRef.current;

    if (!recognition) {
      setListening(false);
      return;
    }

    try {
      if (isRunningRef.current) {
        recognition.stop();
      } else {
        setListening(false);

        const transcript = finalRef.current.trim();
        const callback = onCompleteRef.current;

        if (transcript && callback) {
          onCompleteRef.current = null;
          callback(transcript);
        }
      }
    } catch {
      setListening(false);

      const transcript = finalRef.current.trim();
      const callback = onCompleteRef.current;

      if (transcript && callback) {
        onCompleteRef.current = null;
        callback(transcript);
      }
    }
  }, []);

  return {
    supported,
    listening,
    interim,
    speechError,
    start,
    stop,
    finalRef,
  };
}