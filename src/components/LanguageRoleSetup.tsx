import React, { useState } from 'react';
import { 
  X, 
  Sprout, 
  Milk, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Compass, 
  MapPin, 
  Building2,
  ArrowRight
} from 'lucide-react';
import { Jurisdiction, SupportedLanguage, UserProfile, UserRole } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { SahayaLogo } from './SahayaLogo';

interface LanguageRoleSetupProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const LanguageRoleSetup: React.FC<LanguageRoleSetupProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  language,
  onLanguageChange
}) => {
  const t = TRANSLATIONS[language];

  const [selectedRole, setSelectedRole] = useState<UserRole>(userProfile.role);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction>(userProfile.jurisdiction);
  const [district, setDistrict] = useState(userProfile.district || 'Mandya');
  const [societyName, setSocietyName] = useState(userProfile.society_name || '');
  const [applicantName, setApplicantName] = useState(userProfile.name || '');

  if (!isOpen) return null;

  const roles = [
    {
      id: 'farmer' as UserRole,
      title: t.role_farmer,
      description: t.role_farmer_desc,
      icon: Sprout,
      badge: '0% Crop Loan / PACS',
      color: 'emerald'
    },
    {
      id: 'dairy_artisan' as UserRole,
      title: t.role_dairy,
      description: t.role_dairy_desc,
      icon: Milk,
      badge: 'Fat Testing / Bonus',
      color: 'blue'
    },
    {
      id: 'secretary' as UserRole,
      title: t.role_secretary,
      description: t.role_secretary_desc,
      icon: Briefcase,
      badge: 'Audit & Compliance',
      color: 'amber'
    },
    {
      id: 'citizen' as UserRole,
      title: t.role_citizen,
      description: t.role_citizen_desc,
      icon: Users,
      badge: 'Open Membership',
      color: 'indigo'
    }
  ];

  const handleSave = () => {
    onSaveProfile({
      ...userProfile,
      role: selectedRole,
      jurisdiction: selectedJurisdiction,
      district,
      society_name: societyName,
      name: applicantName || userProfile.name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <SahayaLogo size={26} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                {t.select_role_title}
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                {t.select_role_subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Language (ಭಾಷೆ / भाषा)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { code: 'kn' as SupportedLanguage, label: 'ಕನ್ನಡ (Kannada)', sub: 'ಕರ್ನಾಟಕ' },
                { code: 'hi' as SupportedLanguage, label: 'हिंदी (Hindi)', sub: 'राष्ट्रीय' },
                { code: 'ta' as SupportedLanguage, label: 'தமிழ் (Tamil)', sub: 'தமிழ்நாடு' },
                { code: 'te' as SupportedLanguage, label: 'తెలుగు (Telugu)', sub: 'ఆంధ్రప్రదేశ్ / తెలంగాణ' },
                { code: 'ml' as SupportedLanguage, label: 'മലയാളം (Malayalam)', sub: 'കേരളം' },
                { code: 'en' as SupportedLanguage, label: 'English', sub: 'Statutory' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onLanguageChange(lang.code)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    language === lang.code
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-900">{lang.label}</div>
                  <div className="text-[11px] text-slate-500">{lang.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Persona / Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Citizen / Stakeholder Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm text-slate-900 leading-snug">
                          {r.title}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {r.description}
                    </p>
                    <div className="mt-2.5">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {r.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statutory Jurisdiction */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.jurisdiction_label}
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'karnataka_state' as Jurisdiction,
                  name: t.jurisdiction_karnataka,
                  details: 'Applies to state PACS, DCC banks, KMF Milk Unions, and Taluk societies.'
                },
                {
                  id: 'mscs_central' as Jurisdiction,
                  name: t.jurisdiction_mscs,
                  details: 'Applies to Multi-State credit cooperatives and interstate federations.'
                },
                {
                  id: 'national_model' as Jurisdiction,
                  name: t.jurisdiction_national,
                  details: 'Universal bye-laws circulated for nationwide computerized PACS modernization.'
                }
              ].map((j) => (
                <div
                  key={j.id}
                  onClick={() => setSelectedJurisdiction(j.id)}
                  className={`cursor-pointer p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    selectedJurisdiction === j.id
                      ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="jurisdiction"
                    checked={selectedJurisdiction === j.id}
                    onChange={() => setSelectedJurisdiction(j.id)}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-slate-900">{j.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{j.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Location & Society Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Location & Society Information (Optional)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Basavaraj Patil"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Mandya / Belagavi / Mysuru"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">Primary Society Name</label>
                <input
                  type="text"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  placeholder="e.g. Koppa Primary Agricultural Credit Co-op Society"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm"
          >
            <span>Apply & Personalize Guidance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
