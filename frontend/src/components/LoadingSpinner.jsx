import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Reusable Loading Spinner Component
 * Fully responsive, theme-aligned with deep emerald-teal accents.
 */
export default function LoadingSpinner({
  message = 'Loading...',
  subtitle = null,
  size = 'md',
  className = '',
}) {
  const sizeMap = {
    sm: {
      spinner: 'w-8 h-8 border-2',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      spinner: 'w-12 h-12 border-3',
      icon: 'w-4 h-4',
      text: 'text-sm sm:text-base',
    },
    lg: {
      spinner: 'w-16 h-16 border-4',
      icon: 'w-5 h-5',
      text: 'text-base sm:text-lg',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`py-16 sm:py-24 text-center bg-white rounded-3xl border border-emerald-100/90 p-8 shadow-xs max-w-xl mx-auto animate-fade-in ${className}`}
    >
      <div className="relative inline-flex items-center justify-center mb-4">
        {/* Outer glowing pulse ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md animate-pulse"></div>

        {/* Dual Ring Spinner */}
        <div
          className={`${currentSize.spinner} border-emerald-100 border-t-emerald-600 border-r-teal-500 rounded-full animate-spin`}
        ></div>

        {/* Center Sparkle Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Sparkles className={`${currentSize.icon} text-emerald-600 animate-pulse`} />
        </div>
      </div>

      {message && (
        <p className={`font-bold text-slate-800 tracking-tight ${currentSize.text}`}>
          {message}
        </p>
      )}

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
