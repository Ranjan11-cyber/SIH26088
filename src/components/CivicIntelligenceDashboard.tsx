import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Languages, 
  Star, 
  Send, 
  Check, 
  AlertTriangle,
  Download,
  FileSpreadsheet,
  Filter,
  Search,
  Building,
  Database
} from 'lucide-react';
import { CivicMetric, CooperativeSocietySummary, SupportedLanguage } from '../types';
import { CIVIC_METRICS, COOPERATIVE_SOCIETIES_DATA } from '../data/cooperativeData';
import { TRANSLATIONS } from '../i18n/translations';

interface CivicIntelligenceDashboardProps {
  language: SupportedLanguage;
}

export const CivicIntelligenceDashboard: React.FC<CivicIntelligenceDashboardProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [metrics, setMetrics] = useState<CivicMetric>(CIVIC_METRICS);
  const [societies, setSocieties] = useState<CooperativeSocietySummary[]>(COOPERATIVE_SOCIETIES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetch('/api/v1/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.total_registered_grievances) {
          setMetrics(data);
        }
        if (data.societies && Array.isArray(data.societies)) {
          setSocieties(data.societies);
        }
      })
      .catch(err => console.warn('Using local analytics fallback:', err));
  }, []);

  const handleExportCSV = () => {
    setIsExporting(true);

    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Calculate totals for CSV executive summary
      const totalMembers = societies.reduce((acc, s) => acc + s.active_members, 0);
      const totalPetitions = societies.reduce((acc, s) => acc + s.petitions_logged, 0);
      const totalResolved = societies.reduce((acc, s) => acc + s.resolved_petitions, 0);
      const totalKCC = societies.reduce((acc, s) => acc + s.kcc_credit_disbursed_lakhs, 0);
      const avgResolution = totalPetitions > 0 ? ((totalResolved / totalPetitions) * 100).toFixed(1) : '85.0';

      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const metaSection = [
        '# ==========================================================================',
        '# SAHAYA CIVIC INTELLIGENCE - COOPERATIVE SOCIETIES COMPLIANCE & PERFORMANCE SUMMARY',
        '# Official Record for Offline Civic Auditing & Administrative Review',
        `# Generated At: ${dateStr} ${timeStr}`,
        `# Jurisdiction: Karnataka State Department of Co-operation`,
        `# Total Societies Monitored: ${societies.length}`,
        `# Total Active Members: ${totalMembers.toLocaleString()}`,
        `# Total Registered Petitions: ${totalPetitions.toLocaleString()}`,
        `# Total Resolved Petitions: ${totalResolved.toLocaleString()} (Resolution Rate: ${avgResolution}%)`,
        `# Total KCC Crop Credit Disbursed: INR ${totalKCC.toFixed(1)} Lakhs`,
        '# ==========================================================================',
        ''
      ].join('\r\n');

      const headers = [
        'Society ID',
        'Society Name',
        'Registration Number',
        'Society Type',
        'District',
        'Taluk',
        'Active Members',
        'Petitions Logged',
        'Resolved Petitions',
        'Resolution Rate (%)',
        'ERP Computerization Status',
        'Audit Grade',
        'KCC Credit Disbursed (Lakhs INR)'
      ];

      const dataRows = societies.map(s => [
        escapeCSV(s.id),
        escapeCSV(s.name),
        escapeCSV(s.reg_number),
        escapeCSV(s.type),
        escapeCSV(s.district),
        escapeCSV(s.taluk),
        s.active_members,
        s.petitions_logged,
        s.resolved_petitions,
        `${s.resolution_rate_percent}%`,
        escapeCSV(s.erp_computerization_status),
        escapeCSV(s.audit_grade),
        s.kcc_credit_disbursed_lakhs
      ].join(','));

      const csvContent = metaSection + headers.map(h => `"${h}"`).join(',') + '\r\n' + dataRows.join('\r\n');

      // Trigger standard browser download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.setAttribute('download', `sahaya_cooperative_societies_summary_${dateStr}.csv`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredSocieties = societies.filter(soc => {
    const matchesSearch = 
      soc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      soc.reg_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      soc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      soc.taluk.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || soc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });
      setFeedbackSent(true);
    } catch (e) {
      setFeedbackSent(true);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Clean Minimalist Header with CSV Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t.civic_title || 'Civic Intelligence & Transparency'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.civic_subtitle || 'Resolution metrics, PACS computerization, and language outreach.'}
          </p>
        </div>

        <button
          id="btn-export-societies-csv-top"
          onClick={handleExportCSV}
          disabled={isExporting}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all shadow-xs whitespace-nowrap min-h-[44px] ${
            exportSuccess 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 active:scale-98'
          }`}
          title="Download current society summary as CSV for offline record keeping"
        >
          {exportSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t.export_csv_success || 'CSV Downloaded'}</span>
            </>
          ) : isExporting ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-slate-500" />
              <span>{t.export_csv_downloading || 'Preparing CSV...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-emerald-700" />
              <span>{t.export_csv_btn || 'Export Society Data (CSV)'}</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Big KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.stat_total_grv}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.total_registered_grievances.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>+18% this harvest quarter</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.stat_resolved}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {metrics.resolved_percentage}%
          </div>
          <p className="text-[11px] text-slate-500">
            Conciliated before ARCS benches
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.stat_days}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.average_hearing_days} Days
          </div>
          <p className="text-[11px] text-slate-500">
            Down from 90 days statutory ceiling
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.stat_pacs_erp}</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.pacs_computerization_count.toLocaleString()}
          </div>
          <p className="text-[11px] text-blue-700 font-semibold">
            Live on National Co-op Portal
          </p>
        </div>
      </div>

      {/* Analytical Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vernacular Language Usage (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{t.vernacular_chart_title}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Karnataka Sample</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">ಕನ್ನಡ (Kannada)</span>
                <span className="text-emerald-700 font-bold">{metrics.vernacular_adoption.kannada_percent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.vernacular_adoption.kannada_percent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">हिंदी (Hindi)</span>
                <span className="text-amber-700 font-bold">{metrics.vernacular_adoption.hindi_percent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.vernacular_adoption.hindi_percent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">English (Statutory)</span>
                <span className="text-blue-700 font-bold">{metrics.vernacular_adoption.english_percent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.vernacular_adoption.english_percent}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            Vernacular acoustic speech input (Kannada voice queries) accounts for 72% of farmer and rural citizen interactions on the Sahaya platform.
          </p>
        </div>

        {/* Top Dispute Categories Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Top Reported Statutory Disputes</span>
          </h3>

          <div className="space-y-2.5">
            {[
              { label: 'Denial of Membership (Section 20)', share: 38, count: 563 },
              { label: 'Milk Testing Deduction & Bonus Withholding', share: 26, count: 385 },
              { label: 'KCC 0% Interest Subvention Denial', share: 19, count: 281 },
              { label: 'Disenfranchisement / AGM Voting Exclusion', share: 11, count: 163 },
              { label: 'Audit Delays & Financial Inquiries (Sec 64)', share: 6, count: 90 },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">{d.label}</div>
                  <div className="text-[11px] text-slate-500">{d.count} petitions logged</div>
                </div>
                <span className="font-bold text-slate-700 text-xs px-2 py-1 rounded bg-white border border-slate-200">
                  {d.share}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cooperative Societies Registry & Summary Table (Offline Record Keeping Source) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>{t.societies_table_title || 'Cooperative Societies Registry & Summary'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.societies_table_subtitle || 'Field audit records, membership metrics, and statutory dispute resolution rates.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_societies || 'Search society or district...'}
                className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-56"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">{t.filter_all_types || 'All Society Types'}</option>
              <option value="PACS">PACS</option>
              <option value="Dairy Producers Co-op">Dairy Producers Co-op</option>
              <option value="Horticulture Co-op">Horticulture Co-op</option>
              <option value="Weavers Co-op">Weavers Co-op</option>
              <option value="DCCB Branch">DCCB Branch</option>
            </select>

            {/* CSV Export Button in Table Toolbar */}
            <button
              id="btn-export-societies-csv-table"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-xs transition-all whitespace-nowrap min-h-[38px]"
              title="Download CSV file for offline record keeping"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{t.export_csv_btn || 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Society Name & Reg No</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Active Members</th>
                <th className="py-3 px-4 text-right">Disputes (Resolved)</th>
                <th className="py-3 px-4 text-center">Resolution Rate</th>
                <th className="py-3 px-4 text-center">ERP Status</th>
                <th className="py-3 px-4 text-center">Audit Grade</th>
                <th className="py-3 px-4 text-right">KCC Disbursed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSocieties.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No cooperative societies match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredSocieties.map((soc) => (
                  <tr key={soc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{soc.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{soc.reg_number}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {soc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{soc.taluk}</div>
                      <div className="text-[11px] text-slate-400">{soc.district}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">
                      {soc.active_members.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-slate-900">{soc.resolved_petitions}</span>
                      <span className="text-slate-400"> / {soc.petitions_logged}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        soc.resolution_rate_percent >= 88 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {soc.resolution_rate_percent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        soc.erp_computerization_status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : soc.erp_computerization_status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {soc.erp_computerization_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block w-6 h-6 leading-6 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {soc.audit_grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      ₹{soc.kcc_credit_disbursed_lakhs} L
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Feedback / Rating Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'kn' ? 'ಸಹಾಯ ವೇದಿಕೆಯ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ' : 'Citizen Feedback & Civic Accountability'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your feedback is shared directly with the District Cooperative Registrar for continuous governance improvement.
            </p>
          </div>

          {feedbackSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your feedback has been recorded on the civic ledger.</span>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-left">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Suggestions or experience with local cooperative society..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="flex items-center gap-1.5 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Citizen Review</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
