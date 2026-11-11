import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSchemeById } from '../services/api';
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Shield,
  FileCheck2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Multilingual SchemeDetail Component (src/pages/SchemeDetail.jsx)
 * Clean two-column desktop layout, single column mobile, consistent typography and colors.
 */
export default function SchemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});

  const fetchScheme = useCallback(() => {
    setLoading(true);
    setError(null);

    getSchemeById(id)
      .then((data) => {
        setScheme(data);
        setLoading(false);
        if (data?.documents) {
          const initialChecked = {};
          data.documents.forEach((doc) => {
            initialChecked[doc] = false;
          });
          setCheckedDocs(initialChecked);
        }
      })
      .catch((err) => {
        console.error('Failed to load scheme:', err);
        setError(t.schemeDetail?.errorMsg || 'Unable to load scheme details.');
        setLoading(false);
      });
  }, [id, t.schemeDetail?.errorMsg]);

  useEffect(() => {
    fetchScheme();
  }, [fetchScheme]);

  // Toggle individual document checkbox
  const toggleDoc = (doc) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  const totalDocs = scheme?.documents?.length || 0;
  const readyDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const progressPercent = totalDocs > 0 ? Math.round((readyDocsCount / totalDocs) * 100) : 0;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/results');
    }
  };

  // 1. Loading State with reusable LoadingSpinner
  if (loading) {
    return (
      <div className="py-20 px-4 max-w-4xl mx-auto">
        <LoadingSpinner
          message={t.schemeDetail?.loadingTitle || 'Loading scheme details...'}
          subtitle={t.schemeDetail?.loadingSubtitle || 'Retrieving official documents checklist and portal links'}
          size="lg"
        />
      </div>
    );
  }

  // 2. Error State with reusable ErrorMessage
  if (error) {
    return (
      <div className="py-16 px-4 max-w-4xl mx-auto">
        <ErrorMessage
          title={t.common?.errorTitle || 'Unable to Load Scheme'}
          message={error}
          onRetry={fetchScheme}
          retryLabel={t.common?.retry || 'Try Again'}
          backLink="/results"
          backLabel={t.schemeDetail?.backBtn || 'Back to Results'}
        />
      </div>
    );
  }

  // 3. Not Found State
  if (!scheme) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto text-center animate-fade-in">
        <div className="bg-white rounded-3xl border border-amber-200/90 p-8 sm:p-10 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.schemeDetail?.notFoundTitle}</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
            {t.schemeDetail?.notFoundDesc}
          </p>
          <div className="mt-6">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.schemeDetail?.backToSchemes || 'Back to Schemes'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Top Bar with Back Button & Scheme ID */}
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold transition border border-emerald-100 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.schemeDetail?.backBtn}</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full truncate">
          {t.schemeDetail?.idLabel}: {scheme.id}
        </span>
      </div>

      {/* TWO-COLUMN LAYOUT ON DESKTOP / STACKED ON MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Overview, Benefits, Why Eligible (7 Cols)   */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7">
          {/* Main Title Card */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-9 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 mb-4 max-w-full">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{t.schemeDetail?.nodalAuthority}: {scheme.source}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {scheme.name}
            </h1>

            {/* Key Benefits Card */}
            <div className="mt-6 sm:mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{t.schemeDetail?.benefitHeading}</span>
                </div>
                <p className="text-sm sm:text-base md:text-lg font-bold text-white leading-relaxed">
                  {scheme.benefit}
                </p>
              </div>
            </div>

            {/* Why You Are Eligible */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.schemeDetail?.whyEligibleHeading}</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f8faf9] border border-emerald-100/80">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {scheme.why_eligible}
                </p>
              </div>
            </div>

            {/* Application Guidance Note */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                {t.schemeDetail?.guidanceNotice}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Sticky Side Card with Checklist & CTA (5)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 w-full">
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm">
            {/* Checklist Header */}
            <div className="flex items-center justify-between gap-2 border-b border-emerald-50 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{t.schemeDetail?.docChecklistHeading}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.schemeDetail?.docChecklistSubtitle}
                </p>
              </div>

              {/* Progress Count Chip */}
              <span className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
                {readyDocsCount}/{totalDocs} {t.schemeDetail?.readyCount}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Checklist Items with custom checkboxes & strike-through */}
            <div className="mt-6 space-y-2.5">
              {scheme.documents?.map((doc, index) => {
                const isChecked = Boolean(checkedDocs[doc]);
                return (
                  <div
                    key={index}
                    onClick={() => toggleDoc(doc)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                        : 'bg-[#f8faf9] border-slate-200 hover:border-emerald-200 hover:bg-white'
                    }`}
                  >
                    {/* Custom Styled Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {/* Text with strike-through when ticked */}
                    <div className="flex-1 text-xs sm:text-sm font-medium">
                      <span
                        className={
                          isChecked
                            ? 'line-through text-slate-400 font-normal transition-all'
                            : 'text-slate-800 transition-all'
                        }
                      >
                        {doc}
                      </span>
                    </div>

                    {isChecked && (
                      <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md shrink-0">
                        {t.schemeDetail?.readyCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* All documents ready alert */}
            {readyDocsCount === totalDocs && totalDocs > 0 && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                {t.schemeDetail?.allReadyAlert}
              </div>
            )}

            {/* Glowing Primary CTA Apply Button */}
            <div className="mt-7 pt-5 border-t border-slate-100">
              <a
                href={scheme.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm sm:text-base shadow-lg glow-accent transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.schemeDetail?.applyBtn}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="mt-3 text-center text-[11px] text-slate-400 leading-tight">
                {t.schemeDetail?.applyHint} {scheme.source}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
