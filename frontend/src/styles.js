export const styles = {

  appShell: { minHeight: "100vh", background: "#0b1020", color: "#eef2ff", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },

  navbar: { position: "sticky", top: 0, zIndex: 20, background: "rgba(11,16,32,.86)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,.08)" },

  navbarInner: { maxWidth: 1180, margin: "0 auto", padding: "17px 24px", display: "flex", alignItems: "center", gap: 30 },

  wordmark: { color: "#fff", textDecoration: "none", fontWeight: 800, letterSpacing: "-.03em", fontSize: 19, marginRight: "auto", display: "flex", alignItems: "center", gap: 9 },

  logoMark: { width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 9, background: "linear-gradient(135deg,#8b5cf6,#22d3ee)", color: "#fff", fontWeight: 900 },

  navLinks: { display: "flex", alignItems: "center", gap: 26 },

  navLink: { color: "#8993ad", textDecoration: "none", fontSize: 13, fontWeight: 600, padding: "9px 0", borderBottom: "2px solid transparent" },

  navLinkActive: { color: "#fff", borderBottomColor: "#8b5cf6" },

  navRecordBtn: { color: "#fff", background: "#7c3aed", textDecoration: "none", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 700, boxShadow: "0 8px 24px rgba(124,58,237,.25)" },

  dashboardPage: { maxWidth: 1180, margin: "0 auto", padding: "42px 24px 80px" },

  welcomeRow: { display: "flex", justifyContent: "space-between", gap: 30, alignItems: "flex-end", marginBottom: 30 },

  eyebrow: { color: "#8b9ab8", fontSize: 10, fontWeight: 800, letterSpacing: ".16em", marginBottom: 9 },

  dashboardTitle: { margin: 0, fontSize: 34, lineHeight: 1.12, letterSpacing: "-.045em", maxWidth: 760 },

  dashboardTitleSpan: {},

  dashboardSubtitle: { margin: "11px 0 0", color: "#8d98b2", fontSize: 14, lineHeight: 1.65, maxWidth: 690 },

  todayBadge: { minWidth: 90, border: "1px solid rgba(255,255,255,.09)", background: "#11182b", borderRadius: 14, padding: "12px 15px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "#8d98b2", fontSize: 11 },

  banner: { padding: "12px 15px", borderRadius: 12, marginBottom: 18, background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.2)", color: "#fbbf24", fontSize: 13 },

  errorBanner: { padding: "12px 15px", borderRadius: 12, marginBottom: 18, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", color: "#fca5a5", fontSize: 13 },

  dashboardGrid: { display: "grid", gridTemplateColumns: "minmax(0,1.7fr) minmax(280px,.8fr)", gap: 18, alignItems: "stretch" },

  recordCard: { background: "linear-gradient(145deg,#121a30,#0f1628)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 22, padding: 24, boxShadow: "0 25px 70px rgba(0,0,0,.2)" },

  cardTopLine: { display: "flex", justifyContent: "space-between", color: "#74809b", fontSize: 10, fontWeight: 800, letterSpacing: ".14em" },

  liveDot: { color: "#8b5cf6" },

  recordCenter: { minHeight: 330, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" },

  micRing: { width: 152, height: 152, borderRadius: "50%", display: "grid", placeItems: "center", background: "radial-gradient(circle,rgba(124,58,237,.28),rgba(124,58,237,.04) 64%,transparent 65%)", marginBottom: 18 },

  bigMic: { width: 92, height: 92, borderRadius: "50%", border: "1px solid rgba(255,255,255,.12)", background: "#1b2540", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", transition: "all .2s ease" },

  bigMicActive: { background: "#7c3aed", borderColor: "#a78bfa", boxShadow: "0 0 0 14px rgba(124,58,237,.10), 0 0 50px rgba(124,58,237,.35)", animation: "ringpulse 1.6s ease-out infinite" },

  recordTitle: { margin: 0, fontSize: 22, letterSpacing: "-.02em" },

  recordHint: { maxWidth: 440, margin: "8px 0 0", color: "#7f8aa6", fontSize: 13, lineHeight: 1.6 },

  transcriptBox: { background: "#0a1020", border: "1px solid rgba(139,92,246,.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 15 },

  transcriptLabel: { fontSize: 9, color: "#8b5cf6", fontWeight: 800, letterSpacing: ".13em", marginBottom: 7 },

  recordFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 15, borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 15 },

  secondaryBtn: { border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "#c5ccdc", borderRadius: 9, padding: "9px 12px", fontSize: 12, cursor: "pointer" },

  privacyNote: { color: "#5f6a83", fontSize: 11 },

  manualBox: { display: "flex", flexDirection: "column", gap: 10, marginTop: 14 },

  textarea: { width: "100%", background: "#0a1020", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#eef2ff", padding: 14, resize: "vertical", outline: "none", fontFamily: "inherit" },

  primaryBtn: { border: 0, borderRadius: 10, padding: "11px 15px", background: "#7c3aed", color: "#fff", fontWeight: 700, cursor: "pointer" },

  sideColumn: { display: "flex", flexDirection: "column", gap: 18 },

  insightCard: { background: "#11182b", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 21 },

  howCard: { background: "#11182b", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 21, flex: 1 },

  sideTitle: { color: "#6f7a95", fontSize: 10, fontWeight: 800, letterSpacing: ".13em", marginBottom: 17 },

  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 },

  stat: {},

  statGridDiv: {},

  primaryLink: { display: "block", color: "#c4b5fd", textDecoration: "none", fontSize: 12, fontWeight: 700 },

  step: { display: "grid", gridTemplateColumns: "30px 1fr", gap: 8, marginBottom: 15, color: "#7e89a3", fontSize: 12, lineHeight: 1.45 },

  stepB: {},

  recentSection: { marginTop: 48 },

  sectionHeading: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 },

  sectionTitle: { margin: 0, fontSize: 23, letterSpacing: "-.03em" },

  viewAllLink: { color: "#a78bfa", textDecoration: "none", fontSize: 12, fontWeight: 700 },

  historySection: { display: "flex", flexDirection: "column", gap: 14 },

  emptyCard: { minHeight: 130, border: "1px dashed rgba(255,255,255,.12)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#66718b", fontSize: 13 },

  emptyState: { color: "#77829d", fontSize: 13 },

  page: { maxWidth: 900, margin: "0 auto", padding: "38px 24px 70px" },

  pageHeader: { marginBottom: 26 },

  pageTitle: { margin: 0, fontSize: 30, letterSpacing: "-.04em" },

  pageSubtitle: { color: "#7f8aa6", margin: "8px 0 0", fontSize: 13 },

  searchBar: { width: "100%", background: "#11182b", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#fff", padding: "12px 14px", marginBottom: 14 },

  filterRow: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 },

  filterChip: { border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#8a95ae", borderRadius: 20, padding: "6px 11px", fontSize: 11, cursor: "pointer" },

  filterChipActive: { borderColor: "#8b5cf6", color: "#c4b5fd", background: "rgba(139,92,246,.1)" },

  resultsMeta: { color: "#69758f", fontSize: 11 },

  linkInline: { color: "#a78bfa" },

  card: { background: "#11182b", border: "1px solid rgba(255,255,255,.08)", borderLeft: "3px solid #8b5cf6", borderRadius: 16, padding: "18px 19px" },

  cardHeader: { display: "flex", justifyContent: "space-between", gap: 15, marginBottom: 10 },

  cardDate: { fontSize: 15, fontWeight: 700 },

  cardTime: { fontSize: 11, color: "#69758f", marginTop: 3 },

  moodPill: { fontSize: 11, padding: "5px 9px", borderRadius: 20, fontWeight: 700 },

  cardSummary: { fontSize: 14, lineHeight: 1.6, margin: "0 0 8px", color: "#dce2ef" },

  cardHighlight: { fontSize: 12.5, color: "#919bb0", margin: "0 0 12px", lineHeight: 1.55 },

  tagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },

  tag: { fontSize: 10.5, padding: "4px 8px", borderRadius: 6, background: "rgba(139,92,246,.1)", color: "#b7a4ff" },

  personTag: { fontSize: 10.5, padding: "4px 8px", borderRadius: 6, background: "rgba(34,211,238,.08)", color: "#7dd3fc" },

  section: { marginBottom: 10 },

  sectionLabel: { fontSize: 10, color: "#69758f", marginBottom: 5 },

  list: { margin: 0, paddingLeft: 18 },

  listItem: { fontSize: 12.5, lineHeight: 1.6, color: "#aeb7ca" },

  cardFooter: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.07)" },

  transcriptDetails: { fontSize: 11.5, color: "#69758f", flex: 1 },

  transcriptSummary: { cursor: "pointer" },

  transcriptText: { marginTop: 8, lineHeight: 1.6, color: "#9ca7bc" },

  deleteBtn: { background: "none", border: 0, color: "#f87171", fontSize: 11, cursor: "pointer" },

  editBtn: {
    background: "#7c3aed",
    border: 0,
    color: "#fff",
    borderRadius: 8,
    padding: "7px 11px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer"
  },

  cancelBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,.12)",
    color: "#aeb7ca",
    borderRadius: 8,
    padding: "7px 11px",
    fontSize: 11,
    cursor: "pointer"
  },

};