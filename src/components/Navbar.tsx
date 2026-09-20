import React from 'react';
import { 
  Building2, 
  FileText, 
  Scale, 
  SearchCheck, 
  BarChart3, 
  Sparkles,
  LogIn,
  LogOut,
  UserCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { SupportedLanguage, UserProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { SahayaLogo } from './SahayaLogo';

interface NavbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  userProfile: UserProfile;
  onOpenRoleModal: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  onNavigateToLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  userProfile,
  onOpenRoleModal,
  activeTab,
  onSelectTab,
  isAuthenticated = false,
  onSignOut,
  onNavigateToLogin
}) => {
  const t = TRANSLATIONS[language];

  const getRoleLabel = () => {
    switch (userProfile.role) {
      case 'farmer': return t.role_farmer;
      case 'dairy_artisan': return t.role_dairy;
      case 'secretary': return t.role_secretary;
      default: return t.role_citizen;
    }
  };

  const navItems = [
    { id: 'chat', label: t.tab_chat || 'Advisor', icon: Sparkles },
    { id: 'schemes', label: t.tab_schemes || 'Schemes', icon: FileText },
    { id: 'petition', label: t.tab_petition || 'Petitions', icon: Scale },
    { id: 'tracker', label: t.tab_tracker || 'Tracker', icon: SearchCheck },
    { id: 'bylaws', label: t.tab_bylaws || 'Bylaws', icon: Building2 },
    { id: 'civic', label: t.tab_civic || 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0" 
            onClick={() => onSelectTab('chat')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs hover:border-emerald-300 transition-colors">
              <SahayaLogo size={28} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  {t.app_title || 'Sahaya'}
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {t.app_tagline || 'Cooperative Legal Services'}
              </p>
            </div>
          </div>

          {/* Clean Center Navigation Tabs (Desktop) */}
          {activeTab !== 'login' && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Utilities: Language, Role Pill, and Auth */}
          <div className="flex items-center gap-2">
            
            {/* Minimal Language Switcher */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-800 pl-8 pr-6 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="ml">മലയാളം</option>
              </select>
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={onOpenRoleModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors cursor-pointer"
              title="Change your citizen role"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium truncate max-w-[130px]">{getRoleLabel()}</span>
            </button>

            {/* Authentication Action */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => onSelectTab('login')}
                  className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-semibold">
                    {userProfile.avatar_initials || 'BP'}
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-xs font-medium text-slate-900 flex items-center gap-1">
                      <span>{userProfile.name}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                </button>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={t.sign_out || 'Sign Out'}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              activeTab !== 'login' && (
                <button
                  onClick={onNavigateToLogin || (() => onSelectTab('login'))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{t.tab_login || 'Sign In'}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        {activeTab !== 'login' && (
          <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md whitespace-nowrap text-xs ${
                    isActive
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
