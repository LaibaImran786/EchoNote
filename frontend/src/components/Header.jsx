import React from "react";
import { styles } from "../styles.js";

export default function Header({ eyebrow, title, subtitle }) {
  return (
    <div style={styles.pageHeader}>
      {eyebrow && <div style={styles.eyebrow}>{eyebrow}</div>}
      <h1 style={styles.pageTitle}>{title}</h1>
      {subtitle && <p style={styles.pageSubtitle}>{subtitle}</p>}
    </div>
  );
}
