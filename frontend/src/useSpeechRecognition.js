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

      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors.
        }
      }

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

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
        let currentInterim = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const result = event.results[i];
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

            // Exact duplicate
            if (currentLower === textLower) {
              continue;
            }

            // Already contained in the current transcript
            if (currentLower.includes(textLower)) {
              continue;
            }

            // New result starts with the end of the old result
            const words = currentLower.split(/\s+/);
            const newWords = textLower.split(/\s+/);

            let overlap = 0;

            const maxOverlap = Math.min(
              words.length,
              newWords.length
            );

            for (
              let count = maxOverlap;
              count >= 1;
              count--
            ) {
              const oldEnd = words
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
              const remainingWords = newWords
                .slice(overlap)
                .join(" ");

              if (remainingWords) {
                finalRef.current =
                  `${current} ${remainingWords}`.trim();
              }
            } else {
              finalRef.current =
                `${current} ${text}`.trim();
            }
          } else {
            currentInterim += `${text} `;
          }
        }

        setInterim(currentInterim.trim());
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

        if (!stoppedRef.current) {
          restartTimerRef.current = setTimeout(() => {
            restartTimerRef.current = null;

            if (stoppedRef.current) return;

            try {
              recognition.start();
            } catch {
              // Browser may reject a restart during a transition.
            }
          }, 150);

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