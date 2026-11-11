import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Target,
  BookOpenCheck,
  ListChecks,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileEdit,
  Compass,
  FileCheck,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Multilingual Landing Page Component (src/pages/Landing.jsx)
 */
export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#f8faf9] text-slate-800 animate-fade-in overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (Full-width gradient & soft blurred shapes)   */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-100/60 via-teal-50/40 to-[#f8faf9] py-20 sm:py-28 lg:py-32 border-b border-emerald-100/60">
        {/* Soft decorative blurred shapes in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-10 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl"></div>
          <div className="absolute top-20 right-0 w-[28rem] h-[28rem] rounded-full bg-teal-400/20 blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-amber-300/15 blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm font-bold tracking-wide mb-8 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 -ml-4"></span>
            <span>{t.landing.trustPill}</span>
          </div>

          {/* Big Bold Hero Headline with Gradient-Coloured Keyword */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.14]">
            {t.landing.heroHeadlineBefore}{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-transparent underline decoration-amber-400/60 decoration-wavy decoration-2">
              {t.landing.heroHeadlineHighlight}
            </span>{' '}
            {t.landing.heroHeadlineAfter}
          </h1>

          {/* Subheadline */}
          <p className="mt-7 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.landing.heroSubheadline}
          </p>

          {/* Glowing Primary CTA & Secondary Action Button */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/profile"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base shadow-lg glow-accent transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>{t.landing.heroCtaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/results"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/90 hover:bg-white text-emerald-900 font-bold text-base border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>{t.landing.heroCtaSecondary}</span>
            </Link>
          </div>

          {/* Metric Highlights Pill Row */}
          <div className="mt-16 pt-8 border-t border-emerald-200/50 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xs border border-white/80 shadow-2xs">
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                {t.landing.metrics.m1Value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                {t.landing.metrics.m1Label}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xs border border-white/80 shadow-2xs">
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                {t.landing.metrics.m2Value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                {t.landing.metrics.m2Label}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white/60 backdrop-blur-xs border border-white/80 shadow-2xs">
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                {t.landing.metrics.m3Value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                {t.landing.metrics.m3Label}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. HOW IT WORKS (3 Numbered Cards Connected by a Line)        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-[#f8faf9] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1.5 rounded-full border border-emerald-200">
              {t.landing.howItWorks.tag}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.landing.howItWorks.title}
            </h2>
            <p className="mt-3 text-base text-slate-600">
              {t.landing.howItWorks.subtitle}
            </p>
          </div>

          {/* Cards with Connecting Line on Desktop */}
          <div className="mt-16 relative">
            <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 border-t-2 border-dashed border-emerald-200 -translate-y-8 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-2xl border border-emerald-100/90 shadow-sm hover-lift flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-600/30 mb-6">
                  <FileEdit className="w-7 h-7 text-white stroke-[2.2]" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-3">
                  {t.landing.howItWorks.step1Number}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.landing.howItWorks.step1Title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.landing.howItWorks.step1Desc}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-2xl border border-emerald-100/90 shadow-sm hover-lift flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-600/30 mb-6">
                  <Compass className="w-7 h-7 text-white stroke-[2.2]" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-3">
                  {t.landing.howItWorks.step2Number}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.landing.howItWorks.step2Title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.landing.howItWorks.step2Desc}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-2xl border border-emerald-100/90 shadow-sm hover-lift flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-600/30 mb-6">
                  <FileCheck className="w-7 h-7 text-white stroke-[2.2]" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-3">
                  {t.landing.howItWorks.step3Number}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.landing.howItWorks.step3Title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.landing.howItWorks.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURES SECTION (4 Cards with Lucide Icons & Hover Lift)  */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-white border-y border-emerald-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              {t.landing.features.tag}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.landing.features.title}
            </h2>
            <p className="mt-3 text-base text-slate-600">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#f8faf9] p-7 rounded-2xl border border-emerald-100/80 shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-emerald-600/20">
                  <Target className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.landing.features.f1Title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {t.landing.features.f1Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.landing.features.f1Badge}</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f8faf9] p-7 rounded-2xl border border-emerald-100/80 shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-emerald-600/20">
                  <BookOpenCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.landing.features.f2Title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {t.landing.features.f2Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.landing.features.f2Badge}</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f8faf9] p-7 rounded-2xl border border-emerald-100/80 shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-emerald-600/20">
                  <ListChecks className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.landing.features.f3Title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {t.landing.features.f3Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.landing.features.f3Badge}</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#f8faf9] p-7 rounded-2xl border border-emerald-100/80 shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-emerald-600/20">
                  <ExternalLink className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.landing.features.f4Title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {t.landing.features.f4Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.landing.features.f4Badge}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. CALL TO ACTION BANNER                                      */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-bold border border-emerald-700/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.landing.cta.tag}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t.landing.cta.title}
          </h2>
          <p className="text-emerald-100/80 text-base sm:text-lg max-w-xl mx-auto font-normal">
            {t.landing.cta.desc}
          </p>

          <div className="pt-4">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base shadow-xl glow-accent transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>{t.landing.cta.button}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
