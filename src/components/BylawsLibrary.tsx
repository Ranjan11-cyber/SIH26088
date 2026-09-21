import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  BookOpen, 
  Download, 
  FileCheck, 
  ExternalLink, 
  Scale, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { BylawDocument, SupportedLanguage } from '../types';
import { OFFICIAL_DOCUMENTS } from '../data/cooperativeData';
import { TRANSLATIONS } from '../i18n/translations';

interface BylawsLibraryProps {
  language: SupportedLanguage;
}

export const BylawsLibrary: React.FC<BylawsLibraryProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<BylawDocument>(OFFICIAL_DOCUMENTS[0]);

  const filteredDocs = OFFICIAL_DOCUMENTS.filter(doc => {
    const q = searchQuery.toLowerCase();
    const titleMatch = doc.title.toLowerCase().includes(q) ||
                       (doc.title_kn && doc.title_kn.includes(q)) ||
                       (doc.title_hi && doc.title_hi.includes(q));
    const highlightMatch = doc.key_highlights.some(h => h.toLowerCase().includes(q));
    return titleMatch || highlightMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Clean Minimalist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t.bylaws_title || 'Cooperative Acts & Model Bye-Laws'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.bylaws_subtitle || 'Digital gazettes, legal chapters, and regulatory circulars.'}
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search_bylaws || 'Search sections, acts, clauses...'}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
          />
        </div>
      </div>

      {/* Grid: Master list & Detailed Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDocs.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            const localizedTitle = language === 'kn' && doc.title_kn 
              ? doc.title_kn 
              : language === 'hi' && doc.title_hi 
              ? doc.title_hi 
              : doc.title;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {doc.document_type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Year {doc.year} • {doc.total_sections} Sections
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                  {localizedTitle}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {doc.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mt-3 pt-2 border-t border-slate-100">
                  <span>{doc.key_highlights.length} Statutory Chapters</span>
                  <div className="flex items-center gap-1">
                    <span>Inspect Clauses</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Details (7 cols) */}
        <div className="lg:col-span-7">
          {selectedDoc && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 sticky top-28">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {selectedDoc.document_type}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Jurisdiction: {selectedDoc.jurisdiction.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {language === 'kn' && selectedDoc.title_kn ? selectedDoc.title_kn : selectedDoc.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Key Highlights / Clauses */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Key Statutory Sections & Regulatory Clauses</span>
                </h4>
                <div className="space-y-2">
                  {selectedDoc.key_highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF & Download options */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>File Size: </span>
                  <strong className="text-slate-800">{selectedDoc.pdf_size || '2.5 MB'}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={(selectedDoc.jurisdiction === 'mscs_central' || selectedDoc.jurisdiction === 'national_model') ? 'https://www.cooperation.gov.in/' : 'https://sahakara.kar.gov.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  >
                    <span>Official Gazette Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      const text = `${selectedDoc.title}\n\nSummary:\n${selectedDoc.summary}\n\nKey Highlights:\n${selectedDoc.key_highlights.map(h => `- ${h}`).join('\n')}\n\nOfficial Portal: ${(selectedDoc.jurisdiction === 'mscs_central' || selectedDoc.jurisdiction === 'national_model') ? 'https://www.cooperation.gov.in/' : 'https://sahakara.kar.gov.in/'}`;
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedDoc.id}-summary.txt`;
                      a.click();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Summary & Clauses</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
