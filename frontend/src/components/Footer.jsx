import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Multilingual Footer Component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#091513] text-slate-300 overflow-hidden">
      {/* Top Accent Gradient Border */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-400 to-amber-500"></div>

      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-base shadow-md shadow-emerald-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Scheme<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Bridge</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t.footer.tagline}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {t.footer.verifiedBadge}
              </span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {t.footer.platform}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-300 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-300 transition-colors">
                  {t.nav.profile}
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-emerald-300 transition-colors">
                  {t.nav.results}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: National Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {t.footer.portals}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <span>{t.footer.portalNational}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mygov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <span>{t.footer.portalMyGov}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://dbtbharat.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <span>{t.footer.portalDBT}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} SchemeBridge. {t.footer.craftedFor}
          </p>
          <p className="text-center sm:text-right text-slate-400 max-w-lg">
            {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
