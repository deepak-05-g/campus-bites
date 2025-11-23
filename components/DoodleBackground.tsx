import React from 'react';

const DoodleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern id="doodle-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* Squiggle */}
          <path d="M10 10 Q 20 20, 30 10 T 50 10" stroke="#2d3748" strokeWidth="2" fill="none" />
          {/* Circle */}
          <circle cx="70" cy="70" r="5" stroke="#2d3748" strokeWidth="2" fill="none" />
          {/* Triangle */}
          <path d="M20 80 L 30 90 L 10 90 Z" stroke="#2d3748" strokeWidth="2" fill="none" />
          {/* Cross */}
          <path d="M80 20 L 90 30 M 90 20 L 80 30" stroke="#2d3748" strokeWidth="2" />
          {/* Dot */}
          <circle cx="50" cy="50" r="2" fill="#2d3748" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#doodle-pattern)" />
      </svg>
    </div>
  );
};

export default DoodleBackground;
