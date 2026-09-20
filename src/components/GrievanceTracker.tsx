import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SearchCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar, 
  FileText, 
  ArrowRight, 
  RefreshCw,
  Printer,
  ChevronDown,
  ChevronUp,
  Scale
} from 'lucide-react';
import { Grievance, GrievanceStatus, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface GrievanceTrackerProps {
  language: SupportedLanguage;
  initialRefId?: string;
  onNavigateToBuilder: () => void;
}

export const GrievanceTracker: React.FC<GrievanceTrackerProps> = ({
  language,
  initialRefId,
  onNavigateToBuilder
}) => {
  const t = TRANSLATIONS[language];
  const [searchRef, setSearchRef] = useState(initialRefId || 'GRV-2026-00042');
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentGrievances, setRecentGrievances] = useState<Grievance[]>([]);
  const [showFullPetition, setShowFullPetition] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch recent filings on load
  const fetchRecent = async () => {
    try {
      const res = await fetch('/api/v1/grievances');
      if (res.ok) {
        const data = await res.json();
        setRecentGrievances(data.grievances || []);
      }
    } catch (e) {
      console.warn('Failed to load recent grievances:', e);
    }
  };

  const handleSearch = async (refToQuery?: string) => {
    const targetRef = (refToQuery || searchRef).trim().toUpperCase();
    if (!targetRef) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/grievances/${encodeURIComponent(targetRef)}`);
      if (!res.ok) {
        throw new Error(`Grievance ${targetRef} was not found.`);
      }
      const data: Grievance = await res.json();
      setGrievance(data);
      setSearchRef(targetRef);
    } catch (err: any) {
      setError(err.message || 'Error locating grievance petition.');
      setGrievance(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
    if (initialRefId) {
      handleSearch(initialRefId);
    } else {
      handleSearch('GRV-2026-00042');
    }
  }, [initialRefId]);

  // Status transition simulation (Simulating ARCS Desk Action)
  const handleAdvanceStatus = async (nextStatus: GrievanceStatus, remarks: string) => {
    if (!grievance) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/v1/grievances/${grievance.reference_number}/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status: nextStatus,
          remarks,
          action_by: 'ARCS Mandya Division'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setGrievance(updated);
        fetchRecent();
      }
    } catch (e) {
      console.error('Failed to update grievance status:', e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const stages: { label: GrievanceStatus; desc: string }[] = [
    { label: 'Drafted', desc: 'Statutory petition generated' },
    { label: 'Submitted to ARCS', desc: 'Filed with Registrar desk' },
    { label: 'Under Scrutiny', desc: 'Jurisdiction & RTC verified' },
    { label: 'Notice Issued', desc: 'Summons served to Society' },
    { label: 'Hearing Scheduled', desc: 'Conciliation proceeding fixed' },
    { label: 'Disposed', desc: 'Final statutory relief awarded' },
  ];

  const getStageIndex = (status: GrievanceStatus) => {
    return stages.findIndex(s => s.label === status);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Clean Minimalist Header & Search */}
      <div className="pb-4 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {t.tracker_title || 'Case Tracking & Redressal Status'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.tracker_subtitle || 'Track official ARCS scrutiny, summons notices, and disposal hearings.'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-[11px] font-medium text-slate-400">Samples:</span>
            {['GRV-2026-00042', 'GRV-2026-00088'].map((sample) => (
              <button
                key={sample}
                onClick={() => handleSearch(sample)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700 transition-colors cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Search Input */}
        <div className="flex items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.tracker_placeholder || 'Enter petition reference ID...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <SearchCheck className="w-3.5 h-3.5" />}
            <span>{t.tracker_search_btn || 'Track'}</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={onNavigateToBuilder}
            className="font-bold underline underline-offset-2 hover:text-rose-950"
          >
            File New Dispute Petition
          </button>
        </div>
      )}

      {/* Grievance Details & Timeline View */}
      {grievance && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          {/* Top Particulars Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black font-mono text-slate-900">
                  {grievance.reference_number}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {grievance.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Filed on {new Date(grievance.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {grievance.statutory_act}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullPetition(!showFullPetition)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showFullPetition ? 'Hide Petition Text' : 'View Full Petition'}</span>
                {showFullPetition ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Full Petition Text */}
          {showFullPetition && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-80 overflow-y-auto">
              {grievance.petition_text}
            </div>
          )}

          {/* Core Case Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Complainant</div>
              <div className="font-bold text-slate-900 text-sm">{grievance.applicant_name}</div>
              <div className="text-slate-600">{grievance.phone_or_email}</div>
              <div className="text-slate-500">{grievance.taluk}, {grievance.district}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Respondent Society</div>
              <div className="font-bold text-slate-900 text-sm line-clamp-1">{grievance.society_name}</div>
              <div className="text-slate-600">Reg #: {grievance.society_reg_number}</div>
              <div className="text-slate-500">Jurisdiction: {grievance.district} Sub-division</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Statutory Provision</div>
              <div className="font-bold text-emerald-800 text-sm">{grievance.relevant_section}</div>
              <div className="text-slate-600 capitalize">Category: {grievance.category.replace(/_/g, ' ')}</div>
              <div className="text-[11px] text-slate-500">Demarcation: Quasi-Judicial Conciliation</div>
            </div>
          </div>

          {/* Factual Narrative Summary */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs sm:text-sm space-y-1">
            <span className="font-bold text-emerald-950 uppercase text-[11px] tracking-wide">
              Facts & Relief Demanded:
            </span>
            <p className="text-slate-700 leading-relaxed">
              {grievance.facts_summary}
            </p>
            <div className="pt-2 text-emerald-800 font-medium text-xs">
              <strong>Relief Sought:</strong> {grievance.relief_sought}
            </div>
          </div>

          {/* Interactive Stepper Visual Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{t.timeline_heading}</span>
            </h3>

            <div className="relative">
              {/* Timeline bar */}
              <div className="hidden sm:block absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
                {stages.map((stage, idx) => {
                  const currentIdx = getStageIndex(grievance.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stage.label} className="text-center space-y-1">
                      <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-100 scale-110'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className={`text-xs font-bold ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {stage.label}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                        {stage.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Audit History Log */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Official Registrar Audit Trail
            </h3>

            <div className="space-y-2">
              {grievance.history.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800">
                        {h.from_status} → {h.to_status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(h.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{h.remarks}</p>
                    <div className="text-[10px] font-semibold text-emerald-700 mt-1">
                      Actioned by: {h.action_by}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Simulation Controller (ARCS Conciliation Desk) */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>ARCS Conciliation Desk Action Simulator</span>
              <span className="text-[10px] text-slate-500 font-normal">Test grievance state progression</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                disabled={isUpdatingStatus}
                onClick={() => handleAdvanceStatus('Under Scrutiny', 'Records verified from Registrar database.')}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Mark Under Scrutiny
              </button>
              <button
                disabled={isUpdatingStatus}
                onClick={() => handleAdvanceStatus('Notice Issued', 'Statutory summons dispatched to society secretary.')}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Issue Summons Notice
              </button>
              <button
                disabled={isUpdatingStatus}
                onClick={() => handleAdvanceStatus('Hearing Scheduled', 'Conciliation hearing fixed before Assistant Registrar.')}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Schedule ARCS Hearing
              </button>
              <button
                disabled={isUpdatingStatus}
                onClick={() => handleAdvanceStatus('Disposed', 'Dispute settled. Society directed to grant membership & release credit.')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
              >
                Pass Final Disposal Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Grievances List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t.recent_filings}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentGrievances.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setGrievance(item);
                setSearchRef(item.reference_number);
              }}
              className="cursor-pointer p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-xs space-y-1 bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900">{item.reference_number}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {item.status}
                </span>
              </div>
              <div className="font-medium text-slate-800 line-clamp-1">{item.society_name}</div>
              <div className="text-[11px] text-slate-500">{item.district} • {item.applicant_name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
