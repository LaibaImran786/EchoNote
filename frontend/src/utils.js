export const MOOD_COLORS = {
  calm: "#7A9E7E",
  focused: "#6C8FBF",
  anxious: "#C97B63",
  happy: "#D6A94A",
  tired: "#8B7FA8",
  frustrated: "#C25B4E",
  hopeful: "#7FB0A0",
  neutral: "#9BA0B4",
};

export function moodColor(mood) {
  if (!mood) return MOOD_COLORS.neutral;
  const key = mood.toLowerCase().trim();
  if (MOOD_COLORS[key]) return MOOD_COLORS[key];
  for (const k of Object.keys(MOOD_COLORS)) {
    if (key.includes(k)) return MOOD_COLORS[k];
  }
  return MOOD_COLORS.neutral;
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
