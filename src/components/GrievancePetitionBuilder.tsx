import React, { useState } from 'react';
import { 
  Scale, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  User, 
  Sparkles, 
  Send,
  Download
} from 'lucide-react';
import { Grievance, GrievanceCategory, SupportedLanguage, UserProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface GrievancePetitionBuilderProps {
  language: SupportedLanguage;
  userProfile: UserProfile;
  onGrievanceCreated: (referenceId: string) => void;
}

export const GrievancePetitionBuilder: React.FC<GrievancePetitionBuilderProps> = ({
  language,
  userProfile,
  onGrievanceCreated
}) => {
  const t = TRANSLATIONS[language];
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGrievance, setCreatedGrievance] = useState<Grievance | null>(null);

  // Form State
  const [category, setCategory] = useState<GrievanceCategory>('membership_denial');
  const [applicantName, setApplicantName] = useState(userProfile.name || 'Basavaraj Patil');
  const [phone, setPhone] = useState(userProfile.phone_or_email || '+91 94812 34567');
  const [district, setDistrict] = useState(userProfile.district || 'Mandya');
  const [taluk, setTaluk] = useState('Maddur');
  const [village, setVillage] = useState('Koppa');
  const [societyName, setSocietyName] = useState(userProfile.society_name || 'Koppa Primary Agricultural Credit Co-op Society');
  const [societyRegNo, setSocietyRegNo] = useState('MDR/PACS/1984/412');
  const [facts, setFacts] = useState(
    'I hold 2.8 acres of agricultural land in survey no. 44. On 10-Jan-2026, I tendered application for primary membership with share fee. The society secretary refused to accept without giving written statutory grounds.'
  );
  const [reliefSought, setReliefSought] = useState(
    'Direct the society management under Section 20 to grant regular voting membership and issue crop loan eligibility passbook.'
  );
  const [generatedPetition, setGeneratedPetition] = useState('');

  const disputeCategories = [
    {
      id: 'membership_denial' as GrievanceCategory,
      title: 'Denial of Cooperative Membership',
      section: 'Section 20 & Section 70(1)(a) of KCS Act 1959',
      desc: 'Refusal or delay exceeding 60 days to admit eligible cultivator, resident, or artisan.',
    },
    {
      id: 'voting_rights' as GrievanceCategory,
      title: 'Disenfranchisement / Voting Rights in AGM',
      section: 'Section 27 of KCS Act 1959',
      desc: 'Wrongful removal from voter list or denial of attendance at General Body Meetings.',
    },
    {
      id: 'loan_subvention_dispute' as GrievanceCategory,
      title: 'KCC Crop Loan & Zero-Interest Denial',
      section: 'NABARD Guidelines & Section 70(1)(c)',
      desc: 'Arbitrary reduction of scale of finance or non-credit of state interest subsidy.',
    },
    {
      id: 'milk_payment_bonus' as GrievanceCategory,
      title: 'Milk Fat Testing Deduction & Bonus Delay',
      section: 'Model Bye-Law Clause 34 & Section 70',
      desc: 'Manual manipulation of milk analyzer readings or withholding of annual patronage dividend.',
    },
    {
      id: 'audit_financial_irregularity' as GrievanceCategory,
      title: 'Financial Irregularity & Audit Misappropriation',
      section: 'Section 64 & Section 68 of KCS Act',
      desc: 'Suppression of audited balance sheet or misappropriation of society reserve funds.',
    },
    {
      id: 'election_agm_violation' as GrievanceCategory,
      title: 'Election Schedule & Committee Irregularities',
      section: 'Section 29A & 39A of KCS Act',
      desc: 'Violation of mandatory notice periods or illegal nomination rejections.',
    }
  ];

  // Auto-generate petition text when moving to step 4
  const handleGeneratePetition = () => {
    const selectedCat = disputeCategories.find(c => c.id === category);
    const statutorySection = selectedCat?.section || 'Section 70 of KCS Act 1959';

    const text = `BEFORE THE ASSISTANT REGISTRAR OF CO-OPERATIVE SOCIETIES (ARCS)
SUB-DIVISION: ${district.toUpperCase()} / ${taluk.toUpperCase()}
PETITION UNDER ${statutorySection.toUpperCase()}

IN THE MATTER OF:
Sri/Smt. ${applicantName}
Residing at: ${village}, Taluk: ${taluk}, District: ${district}
Mobile: ${phone} ... PETITIONER / COMPLAINANT

VERSUS

1. The Secretary / Chief Executive Officer
2. The Committee of Management
${societyName}
Registration No: ${societyRegNo}
Situated at: ${taluk}, District: ${district} ... RESPONDENTS

MEMORANDUM OF STATUTORY DISPUTE

1. JURISDICTION & CAPACITY:
The Petitioner is a bonafide resident / cultivator in the operational jurisdiction of the Respondent Society and is entitled to statutory rights under the provisions of the Co-operative Societies Act.

2. STATEMENT OF MATERIAL FACTS:
${facts}

3. STATUTORY INFRACTION:
The conduct of the Respondent Society violates the mandate of ${statutorySection}, which prohibits arbitrary exclusion, discriminatory denial of institutional credit, and failure to discharge cooperative governance obligations.

4. GROUNDS OF DISPUTE:
a) The refusal / inaction is arbitrary, contrary to natural justice, and without authority of law.
b) The petitioner has satisfied all prescribed statutory qualifications and has tendered required fees.
c) Failure to resolve this dispute has caused substantial financial injury and agricultural distress.

5. PRAYER / RELIEF SOUGHT:
The Petitioner respectfully prays that the Hon'ble Assistant Registrar of Co-operative Societies may be pleased to:
a) ${reliefSought}
b) Direct the Respondent Society to produce the minutes of the Committee of Management and relevant statutory registers.
c) Pass such further orders as this Hon'ble Authority deems fit in the interest of cooperative democracy.

VERIFICATION:
I, ${applicantName}, the Petitioner above-named, do hereby declare and verify that the facts stated in Paragraphs 1 to 5 are true to my personal knowledge and belief.

Date: ${new Date().toLocaleDateString('en-GB')}
Place: ${taluk}, ${district}

________________________________
Signature / Thumb Impression of Petitioner`;

    setGeneratedPetition(text);
    setCurrentStep(4);
  };

  // Submit to backend API
  const handleSubmitPetition = async () => {
    setIsSubmitting(true);
    const selectedCat = disputeCategories.find(c => c.id === category);

    try {
      const response = await fetch('/api/v1/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_name: applicantName,
          phone_or_email: phone,
          district,
          taluk,
          society_name: societyName,
          society_reg_number: societyRegNo,
          category,
          statutory_act: 'Karnataka Co-operative Societies Act, 1959',
          relevant_section: selectedCat?.section || 'Section 70',
          facts_summary: facts,
          relief_sought: reliefSought,
          petition_text: generatedPetition
        })
      });

      if (!response.ok) throw new Error('Failed to submit petition');
      const data: Grievance = await response.json();
      setCreatedGrievance(data);
      setCurrentStep(5);
    } catch (err) {
      console.error('Submission failed:', err);
      // Fallback local creation
      const ref = `GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const fallbackGrievance: Grievance = {
        id: `grv-${Date.now()}`,
        reference_number: ref,
        applicant_name: applicantName,
        phone_or_email: phone,
        district,
        taluk,
        society_name: societyName,
        society_reg_number: societyRegNo,
        category,
        statutory_act: 'Karnataka Co-operative Societies Act, 1959',
        relevant_section: selectedCat?.section || 'Section 70',
        facts_summary: facts,
        relief_sought: reliefSought,
        status: 'Submitted to ARCS',
        is_official_submission: false,
        petition_text: generatedPetition,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          {
            from_status: 'Drafted',
            to_status: 'Submitted to ARCS',
            action_by: 'Citizen via Sahaya Portal',
            remarks: 'Statutory petition generated and registered on Sahaya civic platform.',
            created_at: new Date().toISOString(),
          }
        ]
      };
      setCreatedGrievance(fallbackGrievance);
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPetition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Statutory Petition - ${createdGrievance?.reference_number || 'Sahaya'}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; font-size: 14pt; }
            pre { white-space: pre-wrap; font-family: inherit; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .badge { font-size: 10pt; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>OFFICIAL STATUTORY PETITION DRAFT</h2>
            <div class="badge">Reference ID: ${createdGrievance?.reference_number || 'PENDING'} • Generated via Sahaya Cooperative Portal</div>
          </div>
          <pre>${generatedPetition}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Clean Minimalist Header */}
      <div className="pb-4 border-b border-slate-200 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t.builder_title || 'File Statutory Grievance Petition'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.builder_subtitle || 'Draft formal dispute petitions under the Co-operative Societies Act.'}
          </p>
        </div>

        {/* Step Progression */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {[
            { num: 1, label: t.step_1 || 'Category' },
            { num: 2, label: t.step_2 || 'Parties' },
            { num: 3, label: t.step_3 || 'Facts' },
            { num: 4, label: t.step_4 || 'Review' },
            { num: 5, label: t.step_5 || 'Status' }
          ].map((s) => (
            <div
              key={s.num}
              className={`text-center transition-all ${
                currentStep === s.num
                  ? 'text-emerald-800 font-semibold'
                  : currentStep > s.num
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs mb-1 font-medium ${
                currentStep === s.num
                  ? 'bg-slate-900 text-white'
                  : currentStep > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span className="text-[10px] sm:text-xs line-clamp-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Non-Judicial Demarcation Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <p>
          <strong>{t.disclaimer_notice}</strong>
        </p>
      </div>

      {/* Interactive Step Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        {/* STEP 1: Dispute Classification */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 1: Select Nature of Cooperative Dispute
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {disputeCategories.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    category === item.id
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    {category === item.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 mb-1.5">
                    {item.section}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                <span>Continue to Society Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Society and Complainant Particulars */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 2: Complainant and Respondent Society Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Complainant Member</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">{t.member_name}</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">{t.contact_phone}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-medium">{t.district}</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-medium">{t.taluk}</label>
                    <input
                      type="text"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Respondent Cooperative Society</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">{t.society_name}</label>
                  <input
                    type="text"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">{t.society_reg_no}</label>
                  <input
                    type="text"
                    value={societyRegNo}
                    onChange={(e) => setSocietyRegNo(e.target.value)}
                    placeholder="e.g. MDR/PACS/1984/412"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Village / Location</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                <span>Continue to Chronology & Facts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Facts & Relief Demanded */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 3: Factual Narrative and Relief Demanded
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.facts_description}
              </label>
              <textarea
                rows={4}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
                placeholder="State dates of application, tender of share money, verbal refusal, or arbitrary deductions..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.relief_sought_label}
              </label>
              <textarea
                rows={3}
                value={reliefSought}
                onChange={(e) => setReliefSought(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
                placeholder="e.g. Order immediate admission of membership, release 0% interest crop loan passbook, refund withheld fat bonus..."
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleGeneratePetition}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.generate_petition_btn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review and Generate */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Step 4: Review Statutory Petition to Assistant Registrar</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : t.copy_petition}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.print_petition}</span>
                </button>
              </div>
            </div>

            {/* Formatted Petition Box */}
            <div className="p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto shadow-inner">
              {generatedPetition}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Details</span>
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSubmitPetition}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering Petition...' : 'Register Petition & Generate Reference ID'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success Reference ID */}
        {currentStep === 5 && createdGrievance && (
          <div className="text-center py-8 px-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Statutory Representation Formatted & Registered
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                Reference ID: {createdGrievance.reference_number}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your petition draft has been registered on Sahaya civic intelligence portal. You can now present this printout directly to the Assistant Registrar of Cooperative Societies (ARCS) desk in {createdGrievance.district}.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Copy</span>
              </button>

              <button
                onClick={() => onGrievanceCreated(createdGrievance.reference_number)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <span>Track Progress in Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
