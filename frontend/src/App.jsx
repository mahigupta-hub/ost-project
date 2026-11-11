import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Results from './pages/Results';
import SchemeDetail from './pages/SchemeDetail';
import NotFound from './pages/NotFound';
import { LanguageProvider } from './i18n/LanguageContext';

/**
 * Main App Component
 * Integrates global LanguageProvider, Navbar & Footer with React Router routes.
 * Includes catch-all route (*) for 404 Page Not Found.
 */
export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#f8faf9] text-slate-800">
          {/* Persistent Green & White Navigation Bar */}
          <Navbar />

          {/* Dynamic Route Content */}
          <main className="flex-1">
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Landing />} />

              {/* Citizen profile page */}
              <Route path="/profile" element={<Profile />} />

              {/* Scheme eligibility results */}
              <Route path="/results" element={<Results />} />

              {/* Individual scheme detail view */}
              <Route path="/scheme/:id" element={<SchemeDetail />} />

              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Persistent Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
