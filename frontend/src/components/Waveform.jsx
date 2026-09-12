import React from "react";
import { styles } from "../styles.js";

export default function Waveform({ active }) {
  const bars = 24;
  return (
    <div style={styles.waveform}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.waveBar,
            animationPlayState: active ? "running" : "paused",
            animationDelay: `${(i % 8) * 0.09}s`,
            opacity: active ? 1 : 0.25,
          }}
        />
      ))}
    </div>
  );
}
