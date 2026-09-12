import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSpeechRecognition } from "../useSpeechRecognition.js";
import { useEntries } from "../EntriesContext.jsx";
import DailyCard from "../components/DailyCard.jsx";
import MicIcon from "../components/MicIcon.jsx";
import { styles } from "../styles.js";

export default function Home() {
  const { entries, loadingHistory, backendWarning, createJournalEntry, deleteJournalEntry } = useEntries();
  const [status, setStatus] = useState("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [manualText, setManualText] = useState("");
  const [useManual, setUseManual] = useState(false);
  const { supported, listening, interim, speechError, start, stop } = useSpeechRecognition();

  React.useEffect(() => {
    if (!supported) setUseManual(true);
  }, [supported]);

  const handleFinalize = async (rawTranscript) => {
    const transcript = rawTranscript.trim();
    if (!transcript) {
      setStatus("idle");
      return;
    }
    setStatus("processing");
    setErrorMsg("");
    try {
      await createJournalEntry(transcript);
      setLiveTranscript("");
      setManualText("");
      setStatus("idle");
    } catch (e) {
      setErrorMsg(`Couldn't create your memory: ${e.message}`);
      setStatus("error");
      setLiveTranscript(transcript);
    }
  };

  const handleMicTap = () => {
    if (!supported || status === "processing") return;
    if (listening) {
      stop();
      return;
    }
    setStatus("listening");
    setErrorMsg("");
    setLiveTranscript("");
    const started = start((finalText) => {
      setLiveTranscript(finalText);
      handleFinalize(finalText);
    });

    if (!started) {
      setStatus("error");
      setErrorMsg("Could not start the microphone. Check browser microphone permission.");
    }
  };

  const displayTranscript = `${liveTranscript} ${interim}`.trim();
  const recent = entries.slice(0, 3);
  const todayCount = entries.filter((entry) => new Date(entry.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div style={styles.dashboardPage}>
      <div className="welcome-row" style={styles.welcomeRow}>
        <div>
          <div style={styles.eyebrow}>PERSONAL MEMORY SPACE</div>
          <h1 style={styles.dashboardTitle}>Good evening. <span>What's on your mind?</span></h1>
          <p style={styles.dashboardSubtitle}>Speak naturally. EchoNote turns your thoughts into searchable memories, tasks and insights.</p>
        </div>
        <div style={styles.todayBadge}><strong>{todayCount}</strong><span>today</span></div>
      </div>

      {backendWarning && <div style={styles.banner}>⚠ {backendWarning}</div>}
      {speechError && <div style={styles.errorBanner}>🎙 {speechError}</div>}
      {errorMsg && <div style={styles.errorBanner}>⚠ {errorMsg}</div>}

      <div className="dashboard-grid" style={styles.dashboardGrid}>
        <section style={styles.recordCard}>
          <div style={styles.cardTopLine}><span>NEW MEMORY</span><span style={styles.liveDot}>{listening ? "● LIVE" : "READY"}</span></div>
          <div style={styles.recordCenter}>
            <div style={styles.micRing}>
              <button
                className="echonote-mic"
                onClick={handleMicTap}
                disabled={status === "processing" || useManual}
                style={{ ...styles.bigMic, ...(listening ? styles.bigMicActive : {}) }}
                aria-label={listening ? "Stop recording" : "Start recording"}
              ><MicIcon active={listening} /></button>
            </div>
            <h2 style={styles.recordTitle}>{status === "processing" ? "Organizing your thoughts…" : listening ? "I'm listening" : "Start a voice note"}</h2>
            <p style={styles.recordHint}>{status === "processing" ? "Gemini is finding the important pieces." : listening ? "Speak freely. Tap the button when you're finished." : "No script needed. Just talk like you're talking to yourself."}</p>
          </div>

          {(displayTranscript || listening) && !useManual && (
            <div style={styles.transcriptBox}>
              <div style={styles.transcriptLabel}>LIVE TRANSCRIPT</div>
              <p>{displayTranscript || "Listening…"}</p>
            </div>
          )}

          <div style={styles.recordFooter}>
            <button onClick={() => setUseManual((v) => !v)} style={styles.secondaryBtn}>{useManual ? "Use microphone" : "Type instead"}</button>
            <span style={styles.privacyNote}>Your memories stay in your local database.</span>
          </div>

          {useManual && (
            <div style={styles.manualBox}>
              <textarea value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="Write what you would normally say out loud…" style={styles.textarea} rows={5} />
              <button onClick={() => handleFinalize(manualText)} disabled={!manualText.trim() || status === "processing"} style={styles.primaryBtn}>{status === "processing" ? "Organizing…" : "Create memory →"}</button>
            </div>
          )}
        </section>

        <aside style={styles.sideColumn}>
          <div style={styles.insightCard}>
            <div style={styles.sideTitle}>YOUR MEMORY SPACE</div>
            <div style={styles.statGrid}>
              <div><strong>{entries.length}</strong><span>memories</span></div>
              <div><strong>{new Set(entries.flatMap((e) => e.tags || [])).size}</strong><span>topics</span></div>
            </div>
            <Link to="/history" style={styles.primaryLink}>Open memory archive →</Link>
          </div>
          <div style={styles.howCard}>
            <div style={styles.sideTitle}>HOW IT WORKS</div>
            <div style={styles.step}><b>01</b><span>Talk naturally for 30–90 seconds.</span></div>
            <div style={styles.step}><b>02</b><span>Gemini extracts mood, people, tasks and topics.</span></div>
            <div style={styles.step}><b>03</b><span>Your daily memory becomes searchable.</span></div>
          </div>
        </aside>
      </div>

      <section style={styles.recentSection}>
        <div style={styles.sectionHeading}><div><div style={styles.eyebrow}>YOUR JOURNAL</div><h2 style={styles.sectionTitle}>Recent memories</h2></div><Link to="/history" style={styles.viewAllLink}>View archive →</Link></div>
        {loadingHistory && <p style={styles.emptyState}>Loading your memories…</p>}
        {!loadingHistory && recent.length === 0 && <div style={styles.emptyCard}><span>✦</span><p>Your first memory will appear here after you record something.</p></div>}
        <div style={styles.historySection}>{recent.map((entry) => <DailyCard key={entry.id} entry={entry} onDelete={deleteJournalEntry} />)}</div>
      </section>
    </div>
  );
}
