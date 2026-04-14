import React from 'react';

/**
 * SAPI Logo Component - Reusable across all pages
 * @param {number} size - Size of the logo in pixels (default: 96)
 */

export function SAPIGlobe({ size = 140 }) {
  const sizeClass = size === 56 ? 'w-14 h-14' : size === 64 ? 'w-16 h-16' : size === 80 ? 'w-20 h-20' : size === 96 ? 'w-24 h-24' : size === 110 ? 'w-28 h-28' : size === 120 ? 'w-30 h-30' : size === 128 ? 'w-32 h-32' : size === 140 ? 'w-36 h-36' : size === 170 ? 'w-40 h-40' : size === 180 ? 'w-44 h-44' : size === 224 ? 'w-56 h-56' : `w-[${size}px] h-[${size}px]`;
  return (
    <img
      src="/SAPI_Logo_B4_Social_1080.png"
      alt="SAPI Logo"
      width={size}
      height={size}
      className={`object-contain ${sizeClass}`}
      style={{ display: "block" }}
    />
  );
}

export default SAPIGlobe;
