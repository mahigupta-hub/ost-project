import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * 404 Page Component (src/pages/NotFound.jsx)
 * Fully responsive, multilingual, matching the deep emerald-teal brand theme.
 */
export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center animate-fade-in relative overflow-hidden">
      {/* Decorative ambient blurred circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-lg mx-auto bg-white rounded-3xl border border-emerald-100/90 p-8 sm:p-12 shadow-sm">
        {/* Error Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-6">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>{t.notFound?.tag || '404 Error'}</span>
        </div>

        {/* Big Bold 404 Number */}
        <div className="text-7xl sm:text-8xl font-black tracking-tight leading-none bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
          404
        </div>

        {/* Headline & Description */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
          {t.notFound?.title || 'Page Not Found'}
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
          {t.notFound?.description ||
            "The page you are looking for doesn't exist, has been moved, or the link may be broken."}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md glow-accent transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{t.notFound?.backHome || 'Back to Home'}</span>
          </Link>

          <Link
            to="/results"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-emerald-900 font-bold text-sm border border-emerald-200/80 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>{t.notFound?.browseSchemes || 'Browse Schemes'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
