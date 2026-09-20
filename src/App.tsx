import React, { useState, useEffect } from 'react';
import { SupportedLanguage, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { LanguageRoleSetup } from './components/LanguageRoleSetup';
import { MultilingualAIChat } from './components/MultilingualAIChat';
import { SchemesNavigator } from './components/SchemesNavigator';
import { GrievancePetitionBuilder } from './components/GrievancePetitionBuilder';
import { GrievanceTracker } from './components/GrievanceTracker';
import { BylawsLibrary } from './components/BylawsLibrary';
import { CivicIntelligenceDashboard } from './components/CivicIntelligenceDashboard';
import { LoginPage } from './components/LoginPage';
import { SahayaLogo } from './components/SahayaLogo';
import { TRANSLATIONS } from './i18n/translations';
import { ShieldCheck, Scale, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('sahaya_language');
    return (saved as SupportedLanguage) || 'en';
  });
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [trackedRefId, setTrackedRefId] = useState<string>('GRV-2026-00042');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sahaya_authenticated') === 'true';
  });
  const [loginToast, setLoginToast] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sahaya_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      } catch {}
    }
    return {
      id: 'user-001',
      name: 'Basavaraj Patil',
      phone_or_email: '+91 94812 34567',
      role: 'farmer',
      language: 'en',
      jurisdiction: 'karnataka_state',
      society_name: 'Koppa Primary Agricultural Credit Co-op Society',
      membership_number: 'MDR-412',
      district: 'Mandya',
      is_verified: true,
      avatar_initials: 'BP'
    };
  });

  const t = TRANSLATIONS[language];

  // Auto-dismiss login toast after 4 seconds
  useEffect(() => {
    if (loginToast) {
      const timer = setTimeout(() => setLoginToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [loginToast]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    localStorage.setItem('sahaya_language', newLang);
    setUserProfile(prev => {
      const updated = { ...prev, language: newLang };
      localStorage.setItem('sahaya_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const handleGrievanceCreated = (referenceId: string) => {
    setTrackedRefId(referenceId);
    setActiveTab('tracker');
  };

  const handleLoginSuccess = (profile: UserProfile, loginMethod: string) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
    localStorage.setItem('sahaya_authenticated', 'true');
    localStorage.setItem('sahaya_profile', JSON.stringify(profile));
    
    // Set toast message
    const welcomeName = profile.name;
    const msg = language === 'kn'
      ? `ಸ್ವಾಗತ, ${welcomeName}! ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.`
      : language === 'hi'
      ? `स्वागत है, ${welcomeName}! आप सफलतापूर्वक प्रमाणित हुए हैं।`
      : `Welcome, ${welcomeName}! Successfully signed in to Sahaya.`;
    setLoginToast(msg);

    // Switch back to chat or previous tab
    setActiveTab('chat');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sahaya_authenticated');
    const guestProfile: UserProfile = {
      id: 'guest',
      name: language === 'kn' ? 'ಸಾರ್ವಜನಿಕ ನಾಗರಿಕ' : language === 'hi' ? 'सार्वजनिक नागरिक' : 'Public Citizen',
      phone_or_email: '',
      role: 'citizen',
      language,
      jurisdiction: 'karnataka_state',
      is_verified: false
    };
    setUserProfile(guestProfile);
    localStorage.setItem('sahaya_profile', JSON.stringify(guestProfile));
    setActiveTab('login');
  };

  const handleContinueAsGuest = () => {
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Primary Top Header & Navigation */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        userProfile={userProfile}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        onNavigateToLogin={() => setActiveTab('login')}
      />

      {/* Floating Login/Action Toast Notification */}
      {loginToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold leading-snug">
              {loginToast}
            </p>
          </div>
          <button
            onClick={() => setLoginToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'login' && (
          <LoginPage
            language={language}
            onLanguageChange={handleLanguageChange}
            onLoginSuccess={handleLoginSuccess}
            onContinueAsGuest={handleContinueAsGuest}
          />
        )}

        {activeTab === 'chat' && (
          <MultilingualAIChat
            language={language}
            userProfile={userProfile}
            onNavigateToPetition={() => setActiveTab('petition')}
            isAuthenticated={isAuthenticated}
            onNavigateToLogin={() => setActiveTab('login')}
          />
        )}

        {activeTab === 'schemes' && (
          <SchemesNavigator language={language} />
        )}

        {activeTab === 'petition' && (
          <GrievancePetitionBuilder
            language={language}
            userProfile={userProfile}
            onGrievanceCreated={handleGrievanceCreated}
          />
        )}

        {activeTab === 'tracker' && (
          <GrievanceTracker
            language={language}
            initialRefId={trackedRefId}
            onNavigateToBuilder={() => setActiveTab('petition')}
          />
        )}

        {activeTab === 'bylaws' && (
          <BylawsLibrary language={language} />
        )}

        {activeTab === 'civic' && (
          <CivicIntelligenceDashboard language={language} />
        )}
      </main>

      {/* Persona and Jurisdiction Configuration Modal */}
      <LanguageRoleSetup
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={setUserProfile}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <SahayaLogo size={18} />
            <span className="font-semibold text-slate-800">{t.app_title || 'Sahaya'}</span>
            <span className="text-slate-300">•</span>
            <span>{t.app_tagline || 'Cooperative Legal Services'}</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700">KCS Act 1959</span>
          </div>
          <p className="text-slate-400">
            {t.footer_text || 'Civic legal guidance portal. Generated petitions subject to Registrar scrutiny.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
