import React from "react";
import { Link, NavLink } from "react-router-dom";
import { styles } from "../styles.js";

export default function Navbar() {
  const linkStyle = ({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) });
  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarInner}>
        <Link to="/" style={styles.wordmark}><span style={styles.logoMark}>E</span> EchoNote</Link>
        <div style={styles.navLinks}>
          <NavLink to="/" style={linkStyle} end>Today</NavLink>
          <NavLink to="/history" style={linkStyle}>Memory archive</NavLink>
        </div>
        <Link to="/" style={styles.navRecordBtn}>+ New memory</Link>
      </div>
    </nav>
  );
}
