import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getMatchedSchemes, getAllSchemes } from '../services/api';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Edit3,
  Search,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Multilingual Results Page Component (src/pages/Results.jsx)
 * Clean, consistent fonts, colours, spacing and mobile responsiveness.
 */
export default function Results() {
  const location = useLocation();
  const { t } = useLanguage();

  // Retrieve citizen profile from navigation state or localStorage fallback
  const [profile, setProfile] = useState(() => {
    if (location.state?.profile) {
      return location.state.profile;
    }
    try {
      const saved = localStorage.getItem('citizen_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // --- NEW: Track if the user wants to browse ALL schemes ---
  const [isBrowseMode, setIsBrowseMode] = useState(() => {
    // If the link explicitly says browse all, or if there is no profile at all
    if (location.state?.browseAll) return true;
    
    let hasProfile = false;
    if (location.state?.profile) hasProfile = true;
    else if (localStorage.getItem('citizen_profile')) hasProfile = true;
    
    return !hasProfile;
  });

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reusable fetch function for initial load and retry
  const fetchSchemes = useCallback(() => {
    setLoading(true);
    setError(null);

    // --- FIX: Choose the correct API function based on the mode! ---
    const fetchPromise = isBrowseMode ? getAllSchemes() : getMatchedSchemes(profile);

    fetchPromise
      .then((data) => {
        setSchemes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching schemes:', err);
        setError(t.results.errorMsg || 'Unable to connect to the server.');
        setLoading(false);
      });
  }, [profile, isBrowseMode, t.results.errorMsg]);

  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
      {/* ------------------------------------------------------------- */}
      {/* 1. CITIZEN PROFILE SUMMARY BANNER                             */}
      {/* ------------------------------------------------------------- */}
      
      {/* Only show the banner if we are looking at My Matches and have a profile */}
      {!isBrowseMode && (
        <section className="bg-white rounded-3xl border border-emerald-100 p-5 sm:p-8 shadow-sm mb-8 sm:mb-10 relative overflow-hidden">
          {/* Soft background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-50 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.results.summaryTag}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {t.results.heading}
                </h1>
              </div>

              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold transition border border-slate-200 hover:border-emerald-200 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t.results.editProfile}</span>
              </Link>
            </div>

            {profile ? (
              /* Chips display of profile attributes */
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
                <div className="bg-[#f8faf9] p-3 rounded-2xl border border-emerald-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.results.age}</span>
                  <span className="text-sm font-bold text-slate-800">{profile.age || '—'} yrs</span>
                </div>

                <div className="bg-[#f8faf9] p-3 rounded-2xl border border-emerald-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.results.gender}</span>
                  <span className="text-sm font-bold text-slate-800">{profile.gender || '—'}</span>
                </div>

                <div className="bg-[#f8faf9] p-3 rounded-2xl border border-emerald-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.results.state}</span>
                  <span className="text-sm font-bold text-slate-800 truncate block" title={profile.state}>
                    {profile.state || t.results.allIndia}
                  </span>
                </div>

                <div className="bg-[#f8faf9] p-3 rounded-2xl border border-emerald-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.results.category}</span>
                  <span className="text-sm font-bold text-slate-800">{profile.category || 'General'}</span>
                </div>

                <div className="bg-[#f8faf9] p-3 rounded-2xl border border-emerald-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.results.occupation}</span>
                  <span className="text-sm font-bold text-slate-800 truncate block" title={profile.occupation}>
                    {profile.occupation || '—'}
                  </span>
                </div>

                <div className="bg-[#f8faf9] p-3 rounded-2xl border border-emerald-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.results.annualIncome}</span>
                  <span className="text-sm font-bold text-emerald-700 truncate block">
                    ₹{profile.annualIncome ? Number(profile.annualIncome).toLocaleString('en-IN') : '0'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="leading-relaxed">
                  {t.results.generalWarning}
                </span>
                <Link
                  to="/profile"
                  className="font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
                >
                  {t.results.fillProfileLink} &rarr;
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. SCHEME CARDS GRID & STATES                                 */}
      {/* ------------------------------------------------------------- */}
      <div>
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {isBrowseMode ? "All Available Schemes" : t.results.schemesFoundTitle} ({schemes.length})
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isBrowseMode ? "Browsing the complete directory of government schemes" : t.results.schemesSubtitle}
              </p>
            </div>

            {/* --- NEW: TOGGLE BUTTON FOR USER CONTROL --- */}
            {profile && (
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
                <button
                  onClick={() => setIsBrowseMode(false)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${!isBrowseMode ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  My Matches
                </button>
                <button
                  onClick={() => setIsBrowseMode(true)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${isBrowseMode ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  All Schemes
                </button>
              </div>
            )}
          </div>
        )}

        {/* LOADING SPINNER STATE */}
        {loading && (
          <LoadingSpinner
            message={t.results.loadingTitle}
            subtitle={t.results.loadingSubtitle}
            size="md"
          />
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <ErrorMessage
            title={t.common?.errorTitle || 'Unable to Load Schemes'}
            message={error}
            onRetry={fetchSchemes}
            retryLabel={t.results.retryBtn || 'Retry Connection'}
            backLink="/profile"
            backLabel={t.results.editProfile}
          />
        )}

        {/* NO SCHEMES FOUND STATE */}
        {!loading && !error && schemes.length === 0 && (
          <div className="py-16 sm:py-20 text-center bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl mx-auto mb-4 border border-emerald-200">
              <Search className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{t.results.noSchemesTitle}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              {t.results.noSchemesDesc}
            </p>
            <div className="mt-6">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md glow-accent transition"
              >
                <span>{t.results.updateProfileBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* SCHEME CARDS GRID */}
        {!loading && !error && schemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="group relative overflow-hidden rounded-3xl bg-white border border-emerald-100 shadow-sm hover-lift flex flex-col justify-between p-6 sm:p-7 before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-emerald-600 before:via-teal-500 before:to-amber-400"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full truncate max-w-[65%]">
                      {scheme.source}
                    </span>

                    {/* Green "Eligible" Badge - Only show when NOT browsing all */}
                    {!isBrowseMode && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t.results.eligibleBadge}</span>
                      </span>
                    )}
                  </div>

                  {/* Scheme Name */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {scheme.name}
                  </h3>

                  {/* Benefit Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-100">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider block">
                      {t.results.benefitTitle}
                    </span>
                    <p className="mt-1 text-xs font-semibold text-slate-800 leading-relaxed">
                      {scheme.benefit}
                    </p>
                  </div>

                  {/* Short "Why you're eligible" line */}
                  <div className="mt-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                      {t.results.whyEligibleTitle}
                    </span>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                      {scheme.why_eligible}
                    </p>
                  </div>
                </div>

                {/* View Details Button linking to /scheme/:id */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={`/scheme/${scheme.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-emerald-600 cursor-pointer"
                  >
                    <span>{t.results.viewDetailsBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}