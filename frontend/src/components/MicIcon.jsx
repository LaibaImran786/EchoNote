import React from "react";

export default function MicIcon({ active }) {
  const color = active ? "#1B1E2B" : "#E8A33D";
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
      <path
        d="M5 11a7 7 0 0 0 14 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
