import React from 'react';

/**
 * Medora Logo
 * Design: A stylised letter "M" composed of two rising arcs (suggesting a heartbeat / vitality),
 * with a small cross accent — clean, teal on navy, flat design.
 */
export function MedoraLogo({ size = 40, showText = true, darkBg = false }) {
  const textColor = darkBg ? '#ffffff' : '#0d2137';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Icon mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <rect width="48" height="48" rx="12" fill="#0f9b8e" />

        {/* Stylised cross / plus (medical) */}
        <rect x="21" y="10" width="6" height="18" rx="3" fill="white" opacity="0.25" />
        <rect x="13" y="18" width="22" height="6" rx="3" fill="white" opacity="0.25" />

        {/* Heartbeat line — clean M-shape */}
        <polyline
          points="8,28 14,28 17,20 20,34 24,16 28,30 31,24 34,24 40,24"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: size * 0.5,
            color: textColor,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          Med<span style={{ color: '#0f9b8e' }}>ora</span>
        </span>
      )}
    </div>
  );
}

export default MedoraLogo;
