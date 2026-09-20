import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { SupportedLanguage, UserProfile, UserRole, Jurisdiction } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { SahayaLogo } from './SahayaLogo';

interface LoginPageProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onLoginSuccess: (profile: UserProfile, loginMethod: 'otp' | 'official_id' | 'member_id' | 'guest') => void;
  onContinueAsGuest: () => void;
}

interface DemoPersona {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  phone: string;
  society: string;
  membershipNo: string;
  district: string;
  jurisdiction: Jurisdiction;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'demo-farmer',
    name: 'Basavaraj Patil',
    role: 'farmer',
    roleLabel: 'Farmer (PACS)',
    phone: '+91 94812 34567',
    society: 'Koppa Primary Agricultural Credit Co-op Society',
    membershipNo: 'MDR-412',
    district: 'Mandya',
    jurisdiction: 'karnataka_state'
  },
  {
    id: 'demo-dairy',
    name: 'Lakshmi Gowda',
    role: 'dairy_artisan',
    roleLabel: 'Dairy Producer',
    phone: '+91 98451 77234',
    society: 'Channarayapatna Milk Co-operative (KMF)',
    membershipNo: 'MPCS-88',
    district: 'Hassan',
    jurisdiction: 'karnataka_state'
  },
  {
    id: 'demo-secretary',
    name: 'Suresh Kulkarni',
    role: 'secretary',
    roleLabel: 'Society Secretary',
    phone: '+91 91480 89201',
    society: 'Belagavi Rural PACS',
    membershipNo: 'SEC-BGV-09',
    district: 'Belagavi',
    jurisdiction: 'karnataka_state'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  onLoginSuccess,
  onContinueAsGuest,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'citizen' | 'official'>('citizen');

  // Citizen / Member Form
  const [mobileNumber, setMobileNumber] = useState<string>('9481234567');
  const [memberId, setMemberId] = useState<string>('');
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [citizenError, setCitizenError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Official Form
  const [officialId, setOfficialId] = useState<string>('SEC-BELAGAVI-09');
  const [officialPin, setOfficialPin] = useState<string>('****');
  const [officialDistrict, setOfficialDistrict] = useState<string>('Belagavi');
  const [officialError, setOfficialError] = useState<string | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setCitizenError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setCitizenError(null);
    setOtpStep(true);
    setCountdown(30);
  };

  const handleAutoFillDemoOtp = () => {
    setOtpValue('729401');
    setCitizenError(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      setCitizenError('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setCitizenError(null);

    setTimeout(() => {
      const authenticatedProfile: UserProfile = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: 'Basavaraj Patil',
        phone_or_email: `+91 ${mobileNumber}`,
        role: 'farmer',
        language,
        jurisdiction: 'karnataka_state',
        society_name: 'Koppa Primary Agricultural Credit Co-op Society',
        membership_number: memberId || 'MDR-412',
        district: 'Mandya',
        is_verified: true,
        avatar_initials: 'BP',
        last_login: new Date().toISOString()
      };
      setIsVerifying(false);
      onLoginSuccess(authenticatedProfile, 'otp');
    }, 400);
  };

  const handleOfficialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialId.trim()) {
      setOfficialError('Please enter staff ID or registration code.');
      return;
    }

    setIsVerifying(true);
    setOfficialError(null);

    setTimeout(() => {
      const officialProfile: UserProfile = {
        id: `sec-${officialId.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name: 'Suresh Kulkarni',
        phone_or_email: '+91 91480 89201',
        role: 'secretary',
        language,
        jurisdiction: 'karnataka_state',
        society_name: 'Belagavi Rural Agricultural Service Co-op',
        membership_number: officialId,
        district: officialDistrict,
        is_verified: true,
        avatar_initials: 'SK',
        last_login: new Date().toISOString()
      };
      setIsVerifying(false);
      onLoginSuccess(officialProfile, 'official_id');
    }, 400);
  };

  const handleSelectDemoPersona = (persona: DemoPersona) => {
    const profile: UserProfile = {
      id: persona.id,
      name: persona.name,
      phone_or_email: persona.phone,
      role: persona.role,
      language,
      jurisdiction: persona.jurisdiction,
      society_name: persona.society,
      membership_number: persona.membershipNo,
      district: persona.district,
      is_verified: true,
      avatar_initials: persona.name.split(' ').map(n => n[0]).join(''),
      last_login: new Date().toISOString()
    };
    onLoginSuccess(profile, 'guest');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
            <SahayaLogo size={40} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t.login_portal_title || 'Sign In'}
          </h2>
          <p className="text-xs text-slate-500">
            {t.login_portal_subtitle || 'Access cooperative records, schemes, and legal guidance.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => { setActiveTab('citizen'); setOtpStep(false); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'citizen'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            {t.login_citizen_tab || 'Member (Mobile OTP)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('official')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'official'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            {t.login_official_tab || 'Secretary / Official'}
          </button>
        </div>

        {/* Member OTP Flow */}
        {activeTab === 'citizen' && (
          <div>
            {!otpStep ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.mobile_number || 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="9481234567"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.member_id_or_number || 'PACS / Milk Union Member ID (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="e.g. MDR-412"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                {citizenError && (
                  <div className="text-xs text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{citizenError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{t.get_otp || 'Get Verification Code'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Code sent to +91 {mobileNumber}</span>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-emerald-700 hover:underline font-medium"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-center font-mono"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleAutoFillDemoOtp}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    Auto-fill demo (729401)
                  </button>
                  <span className="text-slate-400">
                    {countdown > 0 ? `Resend in ${countdown}s` : (
                      <button
                        type="button"
                        onClick={() => setCountdown(30)}
                        className="text-slate-600 hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </span>
                </div>

                {citizenError && (
                  <div className="text-xs text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{citizenError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>{t.verify_and_login || 'Verify & Sign In'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Official Flow */}
        {activeTab === 'official' && (
          <form onSubmit={handleOfficialLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.official_id || 'Society Registration / Staff ID'}
              </label>
              <input
                type="text"
                value={officialId}
                onChange={(e) => setOfficialId(e.target.value)}
                placeholder="e.g. SEC-BELAGAVI-09"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.official_pin || 'Security Passkey / PIN'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={officialPin}
                  onChange={(e) => setOfficialPin(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                District Jurisdiction
              </label>
              <select
                value={officialDistrict}
                onChange={(e) => setOfficialDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              >
                <option value="Belagavi">Belagavi</option>
                <option value="Mandya">Mandya</option>
                <option value="Hassan">Hassan</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Tumakuru">Tumakuru</option>
              </select>
            </div>

            {officialError && (
              <div className="text-xs text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{officialError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              {isVerifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>{t.official_login_btn || 'Staff Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Switcher */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-medium text-slate-400 text-center">
            Or test with a 1-click persona:
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {DEMO_PERSONAS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectDemoPersona(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-xs transition-colors cursor-pointer"
              >
                {p.roleLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Continue as Guest */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            {t.continue_guest || 'Continue as public guest'}
          </button>
        </div>

      </div>
    </div>
  );
};
