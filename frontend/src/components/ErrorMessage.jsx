import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Reusable Error Message Component
 * Displays actionable API failure or network issue state with a retry button.
 */
export default function ErrorMessage({
  title = 'Unable to Load Data',
  message = 'We encountered an issue connecting to the server. Please check your network and try again.',
  onRetry = null,
  retryLabel = 'Try Again',
  backLink = null,
  backLabel = 'Go Back',
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`py-14 sm:py-20 text-center bg-white rounded-3xl border border-rose-200/80 p-8 sm:p-12 shadow-sm max-w-lg mx-auto animate-fade-in ${className}`}
    >
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 border border-rose-200 shadow-2xs">
        <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
      </div>

      {/* Headline & Description */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal max-w-sm mx-auto">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md glow-accent transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{retryLabel}</span>
          </button>
        )}

        {backLink && (
          <Link
            to={backLink}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
