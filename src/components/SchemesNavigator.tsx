import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Zap, 
  Building, 
  HelpCircle, 
  Download, 
  Search, 
  ChevronRight, 
  Sun, 
  Milk, 
  HeartHandshake, 
  Coins, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Scheme, SupportedLanguage } from '../types';
import { GOVERNMENT_SCHEMES } from '../data/cooperativeData';
import { TRANSLATIONS } from '../i18n/translations';

interface SchemesNavigatorProps {
  language: SupportedLanguage;
}

export const SchemesNavigator: React.FC<SchemesNavigatorProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(GOVERNMENT_SCHEMES[0]);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  // Simple Interactive Eligibility State
  const [eligibilityAnswers, setEligibilityAnswers] = useState({
    isMember: true,
    hasLand: true,
    repaymentHistoryClean: true
  });

  const categories = [
    { id: 'all', label: t.filter_all, icon: FileText },
    { id: 'credit_interest', label: t.filter_credit, icon: Coins },
    { id: 'solar_equipment', label: t.filter_solar, icon: Sun },
    { id: 'dairy_livestock', label: t.filter_dairy, icon: Milk },
    { id: 'digital_infra', label: t.filter_digital, icon: Building },
    { id: 'health_welfare', label: t.filter_health, icon: HeartHandshake },
  ];

  const filteredSchemes = GOVERNMENT_SCHEMES.filter(scheme => {
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const localizedName = scheme.name[language] || scheme.name.en;
    const matchesSearch = localizedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.subsidy_highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t.schemes_heading}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.schemes_subheading}
          </p>
        </div>

        <button
          onClick={() => setShowEligibilityModal(true)}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Check Eligibility</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes or subsidies..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Main Content: Split Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheme List (Left 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredSchemes.map((scheme) => {
            const isSelected = selectedScheme?.id === scheme.id;
            const localizedTitle = scheme.name[language] || scheme.name.en;
            return (
              <div
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {scheme.department.split('/')[0]}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {scheme.application_mode}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                  {localizedTitle}
                </h3>

                <div className="p-2 rounded-xl bg-emerald-100/60 border border-emerald-200/80 text-emerald-950 font-bold text-xs flex items-center gap-1.5 my-2">
                  <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{scheme.subsidy_highlight}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  <span>{scheme.eligibility.length} Eligibility Rules</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span>{t.view_details}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scheme Detailed View (Right 7 cols) */}
        <div className="lg:col-span-7">
          {selectedScheme ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 sticky top-28">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {selectedScheme.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Mode: {selectedScheme.application_mode}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {selectedScheme.name[language] || selectedScheme.name.en}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Department: {selectedScheme.department}
                </p>
              </div>

              {/* Major Subsidy Benefit Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Official Financial Incentive
                </div>
                <div className="text-base font-black text-emerald-950 mt-0.5">
                  {selectedScheme.subsidy_highlight}
                </div>
              </div>

              {/* Direct Benefits */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.benefits_label}</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedScheme.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.eligibility_label}</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedScheme.eligibility.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Required Documents Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.required_docs}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedScheme.documents_required.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs text-amber-950 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="line-clamp-1">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Action Footnote */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-600">
                    <span className="text-slate-400">Application Mode: </span>
                    <strong className="text-slate-800 font-semibold">{selectedScheme.application_mode}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const text = `SCHEME APPLICATION CHECKLIST\n${selectedScheme.name.en}\nSubsidy: ${selectedScheme.subsidy_highlight}\n\nOfficial Portal: ${selectedScheme.official_link || 'Apply at Local PACS / Registrar Office'}\n\nRequired Documents:\n${selectedScheme.documents_required.map(d => `- ${d}`).join('\n')}\n\nApply via: ${selectedScheme.application_mode}`;
                        const blob = new Blob([text], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedScheme.id}-checklist.txt`;
                        a.click();
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Checklist</span>
                    </button>

                    {selectedScheme.official_link ? (
                      <a
                        href={selectedScheme.official_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                        <span>In-Person at PACS / ARCS</span>
                      </span>
                    )}
                  </div>
                </div>

                {selectedScheme.official_link && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-600">
                    <span className="truncate max-w-[80%] font-mono text-[11px] text-emerald-800">
                      {selectedScheme.official_link}
                    </span>
                    <a
                      href={selectedScheme.official_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline shrink-0 text-xs flex items-center gap-1"
                    >
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-xs">
              Select a scheme from the left panel to inspect eligibility criteria and documents.
            </div>
          )}
        </div>
      </div>

      {/* Instant Eligibility Modal */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Quick Cooperative Subsidy Eligibility Check</h3>
              </div>
              <button
                onClick={() => setShowEligibilityModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <span>Are you an active registered member of a local PACS or Milk Society?</span>
                <input
                  type="checkbox"
                  checked={eligibilityAnswers.isMember}
                  onChange={(e) => setEligibilityAnswers({ ...eligibilityAnswers, isMember: e.target.checked })}
                  className="rounded text-emerald-600 w-4 h-4 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <span>Do you hold cultivable agricultural land or dairy livestock in Karnataka?</span>
                <input
                  type="checkbox"
                  checked={eligibilityAnswers.hasLand}
                  onChange={(e) => setEligibilityAnswers({ ...eligibilityAnswers, hasLand: e.target.checked })}
                  className="rounded text-emerald-600 w-4 h-4 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <span>Is your credit record free of willful default with financial institutions?</span>
                <input
                  type="checkbox"
                  checked={eligibilityAnswers.repaymentHistoryClean}
                  onChange={(e) => setEligibilityAnswers({ ...eligibilityAnswers, repaymentHistoryClean: e.target.checked })}
                  className="rounded text-emerald-600 w-4 h-4 focus:ring-emerald-500"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
              {eligibilityAnswers.isMember && eligibilityAnswers.hasLand && eligibilityAnswers.repaymentHistoryClean ? (
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Eligible for 100% Interest Subvention (0% KCC) & PM-KUSUM</span>
                  </div>
                  <p className="text-slate-600">
                    You qualify for short-term crop loans up to ₹3,00,000 at zero interest and 60% solar pump subsidies through your PACS.
                  </p>
                </div>
              ) : (
                <div className="text-amber-800">
                  You may need to regularize membership or settle prior PACS liabilities before claiming 0% state interest subvention.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowEligibilityModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
