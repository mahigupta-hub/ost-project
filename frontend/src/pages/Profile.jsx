import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * All 28 Indian States & 8 Union Territories
 */
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

/**
 * Social categories recognized across central & state schemes
 */
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

/**
 * Core occupation categories requested
 */
const OCCUPATIONS = [
  'Student',
  'Farmer',
  'Self-employed',
  'Salaried',
  'Unemployed',
  'Other',
];

/**
 * Education levels
 */
const EDUCATION_LEVELS = [
  'No Formal Education',
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Diploma / ITI',
  'Graduate',
  'Post Graduate',
  'Doctorate',
];

/**
 * Gender options
 */
const GENDER_OPTIONS = ['Male', 'Female', 'Transgender', 'Other'];

/**
 * Multilingual Profile Form Component (src/pages/Profile.jsx)
 */
export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Citizen profile form state
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    state: '',
    annualIncome: '',
    category: '',
    occupation: '',
    education: '',
  });

  // Validation error state for each field
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate form fields using current language translations
  const validateForm = (data) => {
    const newErrors = {};

    // 1. Age validation
    if (data.age === '' || data.age === null) {
      newErrors.age = t.profile.errors.ageReq;
    } else {
      const numericAge = Number(data.age);
      if (isNaN(numericAge) || numericAge < 1 || numericAge > 120) {
        newErrors.age = t.profile.errors.ageValid;
      }
    }

    // 2. Gender validation
    if (!data.gender.trim()) {
      newErrors.gender = t.profile.errors.genderReq;
    }

    // 3. State validation
    if (!data.state.trim()) {
      newErrors.state = t.profile.errors.stateReq;
    }

    // 4. Annual Income validation
    if (data.annualIncome === '' || data.annualIncome === null) {
      newErrors.annualIncome = t.profile.errors.incomeReq;
    } else {
      const numericIncome = Number(data.annualIncome);
      if (isNaN(numericIncome) || numericIncome < 0) {
        newErrors.annualIncome = t.profile.errors.incomeValid;
      }
    }

    // 5. Category validation
    if (!data.category.trim()) {
      newErrors.category = t.profile.errors.categoryReq;
    }

    // 6. Occupation validation
    if (!data.occupation.trim()) {
      newErrors.occupation = t.profile.errors.occupationReq;
    }

    // 7. Education validation
    if (!data.education.trim()) {
      newErrors.education = t.profile.errors.educationReq;
    }

    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (isSubmitted) {
      const liveErrors = validateForm(updatedData);
      setErrors(liveErrors);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      localStorage.setItem('citizen_profile', JSON.stringify(formData));
    } catch {
      // Storage fallback
    }

    navigate('/results', {
      state: {
        profile: {
          ...formData,
          age: Number(formData.age),
          annualIncome: Number(formData.annualIncome),
        },
      },
    });
  };

  const getInputClass = (fieldName) => {
    const hasError = Boolean(errors[fieldName]);
    return `w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-800 transition-all duration-200 outline-none ${
      hasError
        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-100'
        : 'border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-3 focus:ring-emerald-500/15'
    }`;
  };

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in">
      {/* Centered Profile Card */}
      <div className="bg-white rounded-3xl border border-emerald-100/90 shadow-xl shadow-emerald-950/5 p-5 sm:p-10 lg:p-12">
        {/* Header with Step Progress */}
        <div className="border-b border-emerald-100/70 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.profile.stepBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.profile.heading}
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
            {t.profile.subheading}
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
          {/* SECTION 1: Personal Demographics */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4">
              <User className="w-4 h-4 text-emerald-600" />
              <span>{t.profile.sec1Title}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 1. Age (Number) */}
              <div>
                <label htmlFor="age" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.profile.ageLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="120"
                  placeholder={t.profile.agePlaceholder}
                  value={formData.age}
                  onChange={handleChange}
                  className={getInputClass('age')}
                />
                {errors.age && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.age}</span>
                  </p>
                )}
              </div>

              {/* 2. Gender (Dropdown) */}
              <div>
                <label htmlFor="gender" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.profile.genderLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={getInputClass('gender')}
                >
                  <option value="">{t.profile.genderSelect}</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.gender}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Location & Financial Status */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 pt-4">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t.profile.sec2Title}</span>
            </div>

            <div className="space-y-5">
              {/* 3. State (Dropdown of all Indian states) */}
              <div>
                <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.profile.stateLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={getInputClass('state')}
                >
                  <option value="">{t.profile.stateSelect}</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.state}</span>
                  </p>
                )}
              </div>

              {/* 4. Annual Income (Number) */}
              <div>
                <label htmlFor="annualIncome" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.profile.incomeLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
                    ₹
                  </div>
                  <input
                    type="number"
                    id="annualIncome"
                    name="annualIncome"
                    min="0"
                    step="1000"
                    placeholder={t.profile.incomePlaceholder}
                    value={formData.annualIncome}
                    onChange={handleChange}
                    className={`${getInputClass('annualIncome')} pl-8`}
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {t.profile.incomeHint}
                </span>
                {errors.annualIncome && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.annualIncome}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Socio-Economic Background */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 pt-4">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>{t.profile.sec3Title}</span>
            </div>

            <div className="space-y-5">
              {/* 5. Category (General/OBC/SC/ST/EWS) */}
              <div>
                <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t.profile.categoryLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={getInputClass('category')}
                >
                  <option value="">{t.profile.categorySelect}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.category}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 6. Occupation (Dropdown) */}
                <div>
                  <label htmlFor="occupation" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.profile.occupationLabel} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className={getInputClass('occupation')}
                  >
                    <option value="">{t.profile.occupationSelect}</option>
                    {OCCUPATIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {t.profile.occupations?.[occ] || occ}
                      </option>
                    ))}
                  </select>
                  {errors.occupation && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.occupation}</span>
                    </p>
                  )}
                </div>

                {/* 7. Education (Dropdown) */}
                <div>
                  <label htmlFor="education" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.profile.educationLabel} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={getInputClass('education')}
                  >
                    <option value="">{t.profile.educationSelect}</option>
                    {EDUCATION_LEVELS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                  {errors.education && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.education}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions with Big Submit Button */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2 text-xs text-slate-500 order-2 sm:order-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.profile.privacyNotice}</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base rounded-2xl shadow-lg glow-accent transition-all duration-200 hover:-translate-y-0.5 order-1 sm:order-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.profile.submitBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
