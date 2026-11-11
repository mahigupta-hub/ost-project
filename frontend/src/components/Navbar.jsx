import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Menu, X, Shield, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Redesigned Navbar with Language Switcher Dropdown (English / हिंदी)
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs shadow-emerald-600/30'
        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
    }`;

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100/70 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Brand Logo & Title with Gradient */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Scheme<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Bridge</span>
              </span>
              <span className="text-[10px] text-emerald-800 font-bold tracking-wider mt-0.5 items-center gap-1 hidden sm:flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {t.nav.brandSub}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/50">
            <NavLink to="/" end className={getNavLinkClass}>
              {t.nav.home}
            </NavLink>
            <NavLink to="/profile" className={getNavLinkClass}>
              {t.nav.profile}
            </NavLink>
            <NavLink to="/results" className={getNavLinkClass}>
              {t.nav.results}
            </NavLink>
          </nav>

          {/* Desktop Actions: Language Switcher & Check Eligibility CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100/80 hover:bg-emerald-50 border border-slate-200/60 text-slate-700 text-xs font-bold transition cursor-pointer"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl border border-emerald-100 shadow-lg py-1.5 z-50 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage('en')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      language === 'en'
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage('hi')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      language === 'hi'
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>हिंदी</span>
                    {language === 'hi' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Check Eligibility Button */}
            <Link
              to="/profile"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-md glow-accent transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>{t.nav.checkEligibility}</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Mobile Language Switch Button */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 border border-slate-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'हिंदी' : 'Eng'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-hidden transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-sm font-bold ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`
            }
          >
            {t.nav.home}
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-sm font-bold ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`
            }
          >
            {t.nav.profile}
          </NavLink>
          <NavLink
            to="/results"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-sm font-bold ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`
            }
          >
            {t.nav.results}
          </NavLink>

          {/* Mobile Language Selector Row */}
          <div className="pt-2 pb-1 border-t border-slate-100 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
            <span>{t.nav.language}:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md glow-accent flex items-center justify-center gap-2"
            >
              <span>{t.nav.checkEligibility}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
