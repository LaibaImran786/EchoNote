import { useCallback, useRef, useState } from "react";

export function useSpeechRecognition() {
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  const recognitionRef = useRef(null);
  const finalRef = useRef("");
  const onCompleteRef = useRef(null);
  const stoppedRef = useRef(false);

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [speechError, setSpeechError] = useState("");

  const start = useCallback(
    (onComplete) => {
      if (!supported) return false;

      // Clean up an older recognition instance before starting a new one.
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors.
        }
      }

      const SR =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SR();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      finalRef.current = "";
      onCompleteRef.current = onComplete;
      stoppedRef.current = false;

      setInterim("");
      setSpeechError("");

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event) => {
        let interimText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalRef.current += `${text} `;
          } else {
            interimText += text;
          }
        }

        setInterim(interimText);
      };

      recognition.onerror = (event) => {
        const messages = {
          "not-allowed":
            "Microphone permission was blocked. Allow microphone access and try again.",
          "audio-capture":
            "No microphone was found. Check your microphone settings.",
          "no-speech":
            "I didn't hear speech. Try speaking a little closer to the microphone.",
          network:
            "Speech recognition could not reach the browser speech service.",
        };

        setSpeechError(
          messages[event.error] ||
            `Speech recognition error: ${event.error}`
        );
      };

      recognition.onend = () => {
        setListening(false);
        setInterim("");

        // This is the important part: when the user stops speaking/recording,
        // send the accumulated final transcript to the backend exactly once.
        const transcript = finalRef.current.trim();
        const callback = onCompleteRef.current;

        if (!stoppedRef.current && transcript && callback) {
          stoppedRef.current = true;
          callback(transcript);
        } else if (stoppedRef.current && transcript && callback) {
          // The user explicitly stopped recording; still finalize the text.
          stoppedRef.current = true;
          callback(transcript);
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
        return true;
      } catch (error) {
        setListening(false);
        setSpeechError(
          error.message || "Could not start speech recognition."
        );
        return false;
      }
    },
    [supported]
  );

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    stoppedRef.current = true;

    try {
      recognition.stop();
    } catch {
      // If it already stopped, onend will still clean up.
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
