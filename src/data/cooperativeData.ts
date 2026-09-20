import { BylawDocument, CivicMetric, Grievance, Scheme, CooperativeSocietySummary } from '../types';

export const OFFICIAL_DOCUMENTS: BylawDocument[] = [
  {
    id: 'doc-kcs-1959',
    title: 'Karnataka Co-operative Societies Act, 1959 (Amended up to 2023)',
    title_kn: 'ಕರ್ನಾಟಕ ಸಹಕಾರ ಸಂಘಗಳ ಕಾಯ್ದೆ, ೧೯೫೯ (೨೦೨೩ ರವರೆಗಿನ ತಿದ್ದುಪಡಿಗಳು)',
    title_hi: 'कर्नाटक सहकारी समितियां अधिनियम, 1959 (2023 तक संशोधित)',
    title_ta: 'கர்நாடக கூட்டுறவு சங்கங்கள் சட்டம், 1959 (2023 வரை திருத்தப்பட்டது)',
    title_te: 'కర్ణాటక సహకార సంఘాల చట్టం, 1959 (2023 వరకు సవరించబడింది)',
    title_ml: 'കർണാടക സഹകരണ സംഘ നിയമം, 1959 (2023 വരെ ഭേദഗതി ചെയ്തത്)',
    document_type: 'Act',
    jurisdiction: 'karnataka_state',
    year: 1959,
    total_sections: 131,
    key_highlights: [
      'Section 20: Disqualification for membership and mandatory share capital provisions',
      'Section 27: Right to vote & disqualification for default or non-attendance in 3 out of 5 AGMs',
      'Section 29G: Appointment and statutory duties of Chief Executive / Secretary',
      'Section 64: Statutory inquiry into the constitution, working and financial condition of society by Registrar',
      'Section 70: Mandatory dispute settlement between members, past members, and society before Registrar'
    ],
    summary: 'The principal state legislation governing all Primary Agricultural Credit Societies (PACS), District Central Co-operative (DCC) banks, Milk Producers Co-operatives, and Urban Co-operative Banks in Karnataka.',
    pdf_size: '4.2 MB'
  },
  {
    id: 'doc-mscs-2002',
    title: 'Multi-State Co-operative Societies (MSCS) Act, 2002 & Amendment Act 2023',
    title_kn: 'ಬಹು-ರಾಜ್ಯ ಸಹಕಾರ ಸಂಘಗಳ ಕಾಯ್ದೆ, ೨೦೦೨ ಮತ್ತು ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ ೨೦೨೩',
    title_hi: 'बहु-राज्य सहकारी समितियां (MSCS) अधिनियम, 2002 एवं संशोधन 2023',
    title_ta: 'பல்மாநில கூட்டுறவு சங்கங்கள் சட்டம் (MSCS), 2002 & திருத்தச் சட்டம் 2023',
    title_te: 'బహుళ-రాష్ట్ర సహకార సంఘాల చట్టం (MSCS), 2002 & సవరణ చట్టం 2023',
    title_ml: 'മൾട്ടി-സ്റ്റേറ്റ് കോ-ഓപ്പറേറ്റീവ് സൊസൈറ്റീസ് ആക്ട് (MSCS), 2002 & ഭേദഗതി നിയമം 2023',
    document_type: 'Act',
    jurisdiction: 'mscs_central',
    year: 2023,
    total_sections: 124,
    key_highlights: [
      'Establishment of Co-operative Election Authority for fair, timely board elections',
      'Establishment of Co-operative Ombudsman for prompt resolution of member grievances',
      'Section 84: Reference of disputes to arbitration',
      'Mandatory reserve funds and limits on maximum dividend distribution to 20%'
    ],
    summary: 'Central legislation governing all multi-state co-operative societies whose objects extend to serving members across more than one Indian state.',
    pdf_size: '3.8 MB'
  },
  {
    id: 'doc-model-pacs-2023',
    title: 'National Model Bye-Laws for Primary Agricultural Credit Societies (PACS)',
    title_kn: 'ಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಹಕಾರ ಸಂಘಗಳ (PACS) ರಾಷ್ಟ್ರೀಯ ಮಾದರಿ ಉಪ-ನಿಯಮಗಳು',
    title_hi: 'प्राथमिक कृषि ऋण समितियों (PACS) के लिए राष्ट्रीय मॉडल उप-नियम',
    title_ta: 'தொடக்க வேளாண் கூட்டுறவு சங்கங்களுக்கான (PACS) தேசிய மாதிரி துணைவிதிகள்',
    title_te: 'ప్రాథమిక వ్యవసాయ సహకార సంఘాల (PACS) జాతీయ మోడల్ ఉప-నిబంధనలు',
    title_ml: 'പ്രാഥമിക കാർഷിക സഹകരണ സംഘങ്ങൾക്കായുള്ള (PACS) ദേശീയ മാതൃകാ ഉപനിയമങ്ങൾ',
    document_type: 'Model Bylaw',
    jurisdiction: 'national_model',
    year: 2023,
    total_sections: 68,
    key_highlights: [
      'Diversification of PACS into 25+ business activities (Common Service Centres, fair price shops, solar energy, cold storage)',
      'Mandatory computerized accounting on standard ERP under National PACS Computerization Mission',
      'Clause 8: Universal membership provisions for small and marginal farmers, tenant farmers, and rural artisans',
      'Clause 42: Transparent loan sanctioning and time-bound disbursement schedule'
    ],
    summary: 'Model bye-laws circulated by Ministry of Cooperation, Government of India, enabling PACS to function as multi-purpose economic hubs in rural villages.',
    pdf_size: '2.4 MB'
  },
  {
    id: 'doc-nabard-st-credit',
    title: 'NABARD Master Circular: Ground Level Credit Flow to Agriculture & KCC',
    title_kn: 'ನಬಾರ್ಡ್ ಮಾಸ್ಟರ್ ಸುತ್ತೋಲೆ: ಕೃಷಿ ಸಾಲ ಹರಿವು ಮತ್ತು ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಮಾರ್ಗಸೂಚಿಗಳು',
    title_hi: 'नाबार्ड मास्टर परिपत्र: कृषि ऋण प्रवाह और किसान क्रेडिट कार्ड',
    title_ta: 'நபார்டு மாஸ்டர் சுற்றறிக்கை: விவசாய கடன் மற்றும் கிசான் கிரெடிட் கார்டு',
    title_te: 'నాబార్డ్ మాస్టర్ సర్క్యులర్: వ్యవసాయ రుణాలు మరియు కిసాన్ క్రెడిట్ కార్డ్',
    title_ml: 'നബാർഡ് മാസ്റ്റർ സർക്കുലർ: കാർഷിക വായ്പയും കിസാൻ ക്രെഡിറ്റ് കാർഡും',
    document_type: 'NABARD Guideline',
    jurisdiction: 'national_model',
    year: 2024,
    total_sections: 45,
    key_highlights: [
      'Scale of Finance fixation per acre across major agricultural and horticulture crops',
      'Modified Interest Subvention Scheme (MISS): 7% normal interest with 3% prompt repayment incentive (effective 4% or 0% in state programs)',
      'Zero collateral requirement up to Rs. 1.60 Lakh for KCC crop loans',
      'Extension of KCC facilities to Animal Husbandry and Fisheries farmers'
    ],
    summary: 'Regulatory and operational guidelines binding on State Cooperative Banks and DCCBs for crop loans, scale of finance, and interest subventions.',
    pdf_size: '1.9 MB'
  }
];

export const GOVERNMENT_SCHEMES: Scheme[] = [
  {
    id: 'scheme-kcc-subvention',
    name: {
      en: 'Kisan Credit Card (KCC) & Interest Subvention Scheme',
      kn: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಮತ್ತು ಬಡ್ಡಿ ಸಹಾಯಧನ ಯೋಜನೆ (ಶೂನ್ಯ ಬಡ್ಡಿ ಸಾಲ)',
      hi: 'किसान क्रेडिट कार्ड (KCC) एवं ब्याज अनुदान योजना',
      ta: 'கிசான் கிரெடிட் கார்டு (KCC) & வட்டி மானியத் திட்டம் (0% வட்டி)',
      te: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC) & వడ్డీ రాయితీ పథకం (0% వడ్డీ)',
      ml: 'കിസാൻ ക്രെഡിറ്റ് കാർഡ് (KCC) & പലിശ സബ്‌സിഡി പദ്ധതി (0% പലിശ)'
    },
    department: 'Ministry of Agriculture & Farmers Welfare / Karnataka Cooperative Dept',
    category: 'credit_interest',
    subsidy_highlight: '0% to 3% Effective Interest Rate up to ₹3,00,000 for timely repayment',
    eligibility: [
      'Owner cultivators, tenant farmers, sharecroppers or oral lessees with verified crop acreage',
      'Valid active membership in local Primary Agricultural Credit Society (PACS)',
      'No willful default history with any institutional credit agency'
    ],
    benefits: [
      'Crop loan up to ₹3 Lakh at zero interest (Karnataka State tops up the central 3% subvention)',
      'Simplified revolving credit line valid for 5 years with annual review',
      'No processing fee or collateral required for loans up to ₹1.60 Lakh'
    ],
    documents_required: [
      'Aadhaar Card copy linked to mobile number',
      'RTC / Pahani (Record of Rights, Tenancy and Crops)',
      'PACS Membership Passbook / Share Certificate',
      'Self-declaration of land cultivated and crop pattern'
    ],
    application_mode: 'Online PACS Portal',
    official_link: 'https://www.jansamarth.in/agri-loan-kisan-credit-card'
  },
  {
    id: 'scheme-pm-kusum',
    name: {
      en: 'PM-KUSUM Scheme (Solar Agriculture Pumps for PACS & Farmers)',
      kn: 'ಪಿಎಂ-ಕುಸುಮ್ ಯೋಜನೆ (ಸಹಕಾರ ಸಂಘಗಳು ಮತ್ತು ರೈತರಿಗೆ ಸೌರ ಕೃಷಿ ಪಂಪ್)',
      hi: 'पीएम-कुसुम योजना (किसानों और पैक्स के लिए सौर कृषि पंप)',
      ta: 'பிஎம்-குசும் திட்டம் (விவசாயிகள் & சங்கங்களுக்கு சோலார் பம்புகள்)',
      te: 'పీఎం-కుసుమ్ పథకం (రైతులు & సొసైటీలకు సోలార్ పంపులు)',
      ml: 'പിഎം-കുസും പദ്ധതി (കർഷകർക്കും സംഘങ്ങൾക്കുമുള്ള സൗരോർജ്ജ പമ്പുകൾ)'
    },
    department: 'Ministry of New and Renewable Energy (MNRE)',
    category: 'solar_equipment',
    subsidy_highlight: 'Up to 60% Subsidy (30% Central + 30% State) on Standalone Solar Pumps',
    eligibility: [
      'Individual farmers, farmer groups, PACS, and Water User Cooperative Societies',
      'Cultivable land with an existing non-electrified water source or grid pump replacement eligibility',
      'Adequate open space for solar panel installation free of shadow'
    ],
    benefits: [
      'Replacement of costly diesel pumps with zero daytime electricity cost',
      'Component-A: Earn revenue by selling excess solar power back to DISCOM via cooperative feed-in',
      'Reliable daytime power supply for micro-irrigation'
    ],
    documents_required: [
      'RTC / Land ownership proof',
      'Bank Account passbook linked to Aadhaar (DBT enabled)',
      'Quotation from empanelled solar vendor through PACS',
      'NOC from local electricity board (for Component C)'
    ],
    application_mode: 'Online PACS Portal',
    official_link: 'https://pmkusum.mnre.gov.in/'
  },
  {
    id: 'scheme-pacs-computerization',
    name: {
      en: 'Centrally Sponsored Project for Computerization of PACS',
      kn: 'ಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಂಘಗಳ ಗಣಕೀಕರಣ ಕೇಂದ್ರ ಪ್ರಾಯೋಜಿತ ಯೋಜನೆ',
      hi: 'पैक्स के कम्प्यूटरीकरण के लिए केंद्र प्रायोजित परियोजना',
      ta: 'தொடக்க வேளாண் கூட்டுறவு சங்கங்களை கணினிமயமாக்கும் மத்திய திட்டம்',
      te: 'ప్రాథమిక వ్యవసాయ సహకార సంఘాల (PACS) కంప్యూటరీకరణ కేంద్ర పథకం',
      ml: 'പ്രാഥമിക കാർഷിക സഹകരണ സംഘങ്ങളുടെ കമ്പ്യൂട്ടർവൽക്കരണ പദ്ധതി'
    },
    department: 'Ministry of Cooperation, Government of India',
    category: 'digital_infra',
    subsidy_highlight: '100% Grant for Hardware, ERP Software, UPS & Digitization',
    eligibility: [
      'Registered Primary Agricultural Credit Societies (PACS) operational in rural blocks',
      'Resolution passed by Society Management Committee agreeing to standard national ERP integration',
      'Dedicated computer operator or secretary trained in digital accounting'
    ],
    benefits: [
      'Complete hardware suite (Desktop, Printer, Web Camera, Biometric Scanner, UPS) provided free of cost',
      'Direct link with NABARD and District Central Co-op Bank core banking solution',
      'Elimination of manual ledger manipulation; automated audit preparation'
    ],
    documents_required: [
      'Society Registration Certificate and current Audit Classification report',
      'Board Resolution authorizing digital transformation',
      'List of active registered members with share capital ledger'
    ],
    application_mode: 'District Registrar Office',
    official_link: 'https://www.cooperation.gov.in/'
  },
  {
    id: 'scheme-didf-dairy',
    name: {
      en: 'Dairy Processing & Infrastructure Development Fund (DIDF)',
      kn: 'ಹಾಲು ಸಂಸ್ಕರಣೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ ಅಭಿವೃದ್ಧಿ ನಿಧಿ (DIDF - ಹಾಲು ಒಕ್ಕೂಟಗಳು)',
      hi: 'डेयरी प्रसंस्करण एवं अवसंरचना विकास निधि (DIDF)',
      ta: 'பால் பதப்படுத்துதல் & உள்கட்டமைப்பு மேம்பாட்டு நிதி (DIDF)',
      te: 'పాడి ప్రాసెసింగ్ & మౌలిక సదుపాయాల అభివృద్ధి నిధి (DIDF)',
      ml: 'ക്ഷീര സംസ്കരണ & പശ്ചാത്തല വികസന ഫണ്ട് (DIDF)'
    },
    department: 'Department of Animal Husbandry and Dairying & NDDB',
    category: 'dairy_livestock',
    subsidy_highlight: '2.5% Interest Subvention on Infrastructure Loans up to 80% project cost',
    eligibility: [
      'Milk Producer Cooperative Societies, District Milk Unions (KMF/Amul federations), and SHGs',
      'Positive net worth and sound operational track record',
      'Project proposal vetted by State Cooperative Dairy Registrar'
    ],
    benefits: [
      'Modernization of Village Milk Collection Centers with automated testing analyzers',
      'Installation of Bulk Milk Coolers (BMCs) preventing milk spoilage',
      'Prompt transparent testing ensures fair fat/SNF payout directly to dairy farmers'
    ],
    documents_required: [
      'Union/Society registration credentials',
      'Detailed Project Report (DPR) certified by chartered engineer',
      'Financial statements for preceding 3 fiscal years'
    ],
    application_mode: 'Direct Benefit Transfer (DBT)',
    official_link: 'https://www.nddb.coop/'
  },
  {
    id: 'scheme-yashaswini',
    name: {
      en: 'Yashaswini Cooperative Health Care Scheme',
      kn: 'ಯಶಸ್ವಿನಿ ಸಹಕಾರಿಗಳ ಆರೋಗ್ಯ ರಕ್ಷಣಾ ಯೋಜನೆ (ಕರ್ನಾಟಕ)',
      hi: 'यशस्विनी सहकारी स्वास्थ्य योजना',
      ta: 'யஷஸ்வினி கூட்டுறவு சுகாதார பாதுகாப்பு திட்டம்',
      te: 'యశస్విని సహకార ఆరోగ్య సంరక్షణ పథకం',
      ml: 'യശസ്വിനി സഹകരണ ആരോഗ്യ സംരക്ഷണ പദ്ധതി'
    },
    department: 'Department of Co-operation, Government of Karnataka',
    category: 'health_welfare',
    subsidy_highlight: 'Cashless surgical coverage up to ₹5 Lakh per rural cooperative family',
    eligibility: [
      'Rural citizen having active membership in any registered cooperative society in Karnataka for minimum 3 months',
      'Family members of rural cooperative society members',
      'Modest annual contribution: ₹500/year for rural family, ₹1,000 for urban co-op member'
    ],
    benefits: [
      'Cashless hospital treatment across 1,650+ specified surgical procedures in networked hospitals',
      'Empanelled top private and government super-specialty hospitals statewide',
      'Covers pre-existing conditions and intensive care procedures'
    ],
    documents_required: [
      'Aadhaar card of all family members',
      'Certificate of Cooperative Membership issued by PACS/DCCB/Milk Society Secretary',
      'Ration Card / Food Security Card copy'
    ],
    application_mode: 'Online PACS Portal',
    official_link: 'https://sahakara.kar.gov.in/'
  },
  {
    id: 'scheme-tn-crop-loan',
    name: {
      en: 'Tamil Nadu Interest-Free Cooperative Crop Loan Scheme',
      kn: 'ತಮಿಳುನಾಡು ಬಡ್ಡಿ ರಹಿತ ಸಹಕಾರ ಬೆಳೆ ಸಾಲ ಯೋಜನೆ',
      hi: 'तमिलनाडु ब्याज मुक्त सहकारी फसल ऋण योजना',
      ta: 'தமிழ்நாடு கூட்டுறவு வட்டி இல்லாத பயிர்க்கடன் திட்டம்',
      te: 'తమిళనాడు వడ్డీ లేని సహకార పంట రుణ పథకం',
      ml: 'തമിഴ്‌നാട് പലിശ രഹിത സഹകരണ വിള വായ്പ പദ്ധതി'
    },
    department: 'Department of Cooperation, Government of Tamil Nadu',
    category: 'credit_interest',
    subsidy_highlight: '100% Interest Waiver (0% Effective Interest) up to ₹1,50,000',
    eligibility: [
      'Farmers registered with Primary Agricultural Cooperative Credit Societies (PACCS) in Tamil Nadu',
      'Must have clean record without willful defaults on previous crop loans',
      'Cultivation land must be within the operating area of the local PACCS'
    ],
    benefits: [
      'Entire interest is subsidized by the State Government if loan is repaid within due date',
      'No collateral required for loans up to ₹1.60 Lakh under simplified RBI rules',
      'Flexible credit line for purchasing quality seeds, fertilizers, and pesticide inputs'
    ],
    documents_required: [
      'Aadhaar card and smart ration card',
      'Chitta / Adangal land cultivation certificate issued by Village Administrative Officer (VAO)',
      'PACCS membership book and share certificate copy'
    ],
    application_mode: 'Online PACS Portal',
    official_link: 'https://www.tncoops.tn.gov.in/'
  },
  {
    id: 'scheme-tg-rythu-bima',
    name: {
      en: 'Telangana Rythu Bima Cooperative Life Insurance Scheme',
      kn: 'ತೆಲಂಗಾಣ ರೈತು ಬಿಮಾ ಸಹಕಾರ ಜೀವ ವಿಮಾ ಯೋಜನೆ',
      hi: 'तेलंगाना रायथू बीमा सहकारी जीवन बीमा योजना',
      ta: 'தெலுங்கானா விவசாய காப்பீட்டுத் திட்டம் (Rythu Bima)',
      te: 'తెలంగాణ రైతు బీమా సహకార సమూహ జీవిత బీమా పథకం',
      ml: 'തെലങ്കാന റൈതു ബീമ സഹകരണ ഗ്രൂപ്പ് ഇൻഷുറൻസ് പദ്ധതി'
    },
    department: 'Agriculture & Cooperative Department, Government of Telangana',
    category: 'health_welfare',
    subsidy_highlight: '100% Premium Paid by State for ₹5 Lakh Group Life Cover',
    eligibility: [
      'Pattadar landholding farmers in Telangana aged between 18 to 59 years',
      'Must have active membership in local Primary Agricultural Cooperative Society (PACS) or Rythu Sangham',
      'Nominee details must be registered and updated in state agricultural land portal (Dharani)'
    ],
    benefits: [
      'Financial security of ₹5,00,000 deposited to nominee bank account within 10 days of claim',
      'No contribution or premium payment required from the farmer or family',
      'Entire premium is paid by Government directly to Life Insurance Corporation (LIC) through cooperative funds'
    ],
    documents_required: [
      'Pattadar Passbook / Dharani Land Record Copy',
      'Aadhaar Card copy of farmer and nominee',
      'PACS Membership ID or declaration from society secretary'
    ],
    application_mode: 'Online PACS Portal',
    official_link: 'https://rythubandhu.telangana.gov.in/'
  },
  {
    id: 'scheme-ap-sunna-vaddi',
    name: {
      en: 'AP YSR Sunna Vaddi Panta Runalu (Zero Interest Loans)',
      kn: 'ಆಂಧ್ರಪ್ರದೇಶ್ ವೈಎಸ್ಆರ್ ಶೂನ್ಯ ಬಡ್ಡಿ ಬೆಳೆ ಸಾಲ ಯೋಜನೆ (ಸುನ್ನ ವಡ್ಡಿ)',
      hi: 'आंध्र प्रदेश वाईएसआर सुन्ना वड्डी शून्य ब्याज फसल ऋण',
      ta: 'ஆந்திரா ஒய்.எஸ்.ஆர் சுன்னா வட்டி பயிர்க்கடன் திட்டம்',
      te: 'వైఎస్సార్ సున్నా వడ్డీ పంట రుణాలు (శూన్య వడ్డీ పథకం)',
      ml: 'ആന്ധ്രാപ്രദേശ് వై.എസ്.ആർ സുണ്ണ വഡ്ഡി വിള വായ്പ പദ്ധതി'
    },
    department: 'Department of Agriculture & Cooperation, Government of Andhra Pradesh',
    category: 'credit_interest',
    subsidy_highlight: '0% Interest on crop loans up to ₹1,00,000 for timely repay',
    eligibility: [
      'Owner and Tenant (CCRC holder) farmers who have availed crop loans from PACS or DCCBs in AP',
      'The crop loan amount must be under ₹1,00,000 per crop season',
      'Repayment must be completed within the standard 1-year loan term'
    ],
    benefits: [
      'Full interest amount is directly credited back to the farmer’s bank account via DBT',
      'Covers both owner-cultivators and tenant farmers holding Crop Cultivator Rights Cards (CCRC)',
      'Substantial cost savings on seasonal agricultural expenses'
    ],
    documents_required: [
      'Aadhaar Card linked with active mobile number',
      'e-Crop booking database certificate from Rythu Bharosa Kendra (RBK)',
      'DCCB / PACS Loan Account statement showing timely repayment'
    ],
    application_mode: 'Direct Benefit Transfer (DBT)',
    official_link: 'https://ysrsunnavaddi.ap.gov.in/'
  },
  {
    id: 'scheme-kl-kshemanidhi',
    name: {
      en: 'Kerala Karshaka Kshemanidhi Farmers Welfare Pension',
      kn: 'ಕೇರಳ ಕರ್ಷಕ ಕ್ಷೇಮನಿಧಿ ರೈತರ ಕಲ್ಯಾಣ ಪಿಂಚಣಿ ಯೋಜನೆ',
      hi: 'केरल कर्षक क्षेमनिधि किसान कल्याण पेंशन योजना',
      ta: 'கேரளா விவசாய நல வாரிய ஓய்வூதியத் திட்டம்',
      te: 'కేరళ కర్షక క్షేమనిధి రైతు సంక్షేమ పెన్షన్ పథకం',
      ml: 'കേരള കർഷക ക്ഷേമനിധി ബോർഡ് പെൻഷൻ പദ്ധതി'
    },
    department: 'Kerala Karshaka Kshemanidhi Board / Cooperative Department, Govt of Kerala',
    category: 'health_welfare',
    subsidy_highlight: 'Monthly Welfare Pension of ₹5,000 and medical grants',
    eligibility: [
      'Agricultural workers and small-scale farmers in Kerala holding between 5 cents and 15 acres',
      'Age between 18 to 65 years at the time of cooperative welfare fund enrollment',
      'Must not be a member of any other statutory state pension or welfare scheme'
    ],
    benefits: [
      'Guaranteed retirement pension of ₹5,000/month after attaining 60 years',
      'One-time marriage assistant grant of ₹10,000 for registered farmer’s daughters',
      'Emergency medical grants for major operations and chronic illnesses'
    ],
    documents_required: [
      'Aadhaar Card and cooperative society membership certificate',
      'Land tax receipt from Village Office showing agricultural crop acreage',
      'Age certificate / SSLC book copy'
    ],
    application_mode: 'Online PACS Portal',
    official_link: 'https://keralakarshakashemanidhi.org/'
  }
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-001',
    reference_number: 'GRV-2026-00042',
    applicant_name: 'Basavarajappa Patil',
    phone_or_email: '+91 94812 34567',
    district: 'Mandya',
    taluk: 'Maddur',
    society_name: 'Koppa Primary Agricultural Credit Co-operative Society',
    society_reg_number: 'MDR/PACS/1984/412',
    category: 'membership_denial',
    statutory_act: 'Karnataka Co-operative Societies Act, 1959',
    relevant_section: 'Section 20 & Section 70(1)(a)',
    facts_summary: 'Applicant has agricultural land of 3.2 acres in Koppa village and applied for primary membership on 12-Jan-2026 with requisite share capital fee. Society committee failed to communicate acceptance or reasons for refusal within the statutory period of 60 days.',
    relief_sought: 'Direction under Section 20(3) to register applicant as regular member and issue share certificate with immediate credit borrowing eligibility.',
    status: 'Notice Issued',
    is_official_submission: false,
    petition_text: `BEFORE THE ASSISTANT REGISTRAR OF CO-OPERATIVE SOCIETIES (ARCS), SUB-DIVISION MANDYA
PETITION UNDER SECTION 70 READ WITH SECTION 20 OF THE KARNATAKA CO-OPERATIVE SOCIETIES ACT, 1959

In the matter of:
Sri Basavarajappa Patil, S/o Late Shivalingappa Patil
Residing at Koppa Village, Maddur Taluk, Mandya District ... PETITIONER

Versus
1. The Secretary / Chief Executive Officer, Koppa PACS
2. The Committee of Management, Koppa PACS ... RESPONDENTS

MEMORANDUM OF DISPUTE
1. The Petitioner is an owner-cultivator holding 3.2 acres of arable land in Survey No. 44/2 of Koppa village, within the jurisdiction area of Respondent Society.
2. On 12th January 2026, the Petitioner tendered application in Form No. 1 along with required share fee of Rs. 1,000/- and admission fee.
3. As per Section 20 of the Karnataka Co-operative Societies Act, 1959, any qualified person residing in the operational area is entitled to admission. The society has sat on the application for over 60 days without statutory communication.
4. PRAYER: May the Hon'ble Assistant Registrar issue notice to Respondent Society and order deemed admission of the Petitioner with all statutory rights.`,
    created_at: '2026-02-15T10:30:00Z',
    updated_at: '2026-03-02T14:15:00Z',
    history: [
      {
        from_status: 'Drafted',
        to_status: 'Submitted to ARCS',
        action_by: 'Citizen / Sahaya Portal',
        remarks: 'Statutory petition generated with RTC verification documents attached.',
        created_at: '2026-02-15T10:30:00Z'
      },
      {
        from_status: 'Submitted to ARCS',
        to_status: 'Under Scrutiny',
        action_by: 'ARCS Office Scrutiny Desk',
        remarks: 'Preliminary verification of land records and jurisdictional check completed.',
        created_at: '2026-02-20T11:45:00Z'
      },
      {
        from_status: 'Under Scrutiny',
        to_status: 'Notice Issued',
        action_by: 'ARCS Mandya Sub-division',
        remarks: 'Statutory summons issued to Respondent Secretary to explain non-admission within 14 days.',
        created_at: '2026-03-02T14:15:00Z'
      }
    ]
  },
  {
    id: 'grv-002',
    reference_number: 'GRV-2026-00088',
    applicant_name: 'Shobha R. Kulkarni',
    phone_or_email: '+91 98450 87654',
    district: 'Belagavi',
    taluk: 'Gokak',
    society_name: 'Gokak Dairy Farmers Co-operative Society Ltd',
    society_reg_number: 'GOK/MILK/2004/78',
    category: 'milk_payment_bonus',
    statutory_act: 'Karnataka Co-operative Societies Act, 1959',
    relevant_section: 'Section 56 & Model Bye-Law Clause 34',
    facts_summary: 'Deduction of fat percentage reading manually at village collection booth resulting in underpayment of Rs. 4.20 per liter for 4 months. Society management refused to share automatic analyzer calibration log.',
    relief_sought: 'Audit of automated milk testing equipment and reimbursement of wrongful deductions amounting to ₹14,280/- with annual patron dividend.',
    status: 'Hearing Scheduled',
    is_official_submission: false,
    petition_text: `BEFORE THE JOINT REGISTRAR OF CO-OPERATIVE SOCIETIES, BELAGAVI DIVISION
REPRESENTATION UNDER SECTION 64/70 OF KCS ACT 1959

Petitioner: Smt. Shobha R. Kulkarni, Member No. 342, Gokak Dairy Co-op.
Subject: Irregularity in milk testing calibration and withholding of patron bonus.
Summary of Grounds:
- The petitioner pours 25 liters daily from crossbreed cows.
- From October 2025 onwards, milk fat was manually recorded at 3.2% while independent veterinary testing records 4.4%.
- PRAYER: Direction to impound analyzer log records and pay withheld dues.`,
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-03-10T16:00:00Z',
    history: [
      {
        from_status: 'Drafted',
        to_status: 'Submitted to ARCS',
        action_by: 'Citizen via Sahaya',
        remarks: 'Dispute petition prepared with pourer receipts.',
        created_at: '2026-01-20T09:00:00Z'
      },
      {
        from_status: 'Submitted to ARCS',
        to_status: 'Under Scrutiny',
        action_by: 'Dairy Registrar Wing',
        remarks: 'Sample receipts cross-checked with Union pricing chart.',
        created_at: '2026-01-28T10:00:00Z'
      },
      {
        from_status: 'Under Scrutiny',
        to_status: 'Notice Issued',
        action_by: 'JRCS Belagavi',
        remarks: 'Notice issued to Society President and Quality Inspector.',
        created_at: '2026-02-14T15:30:00Z'
      },
      {
        from_status: 'Notice Issued',
        to_status: 'Hearing Scheduled',
        action_by: 'ARCS Gokak Court Hall',
        remarks: 'Formal conciliation hearing fixed for 28-March-2026 at 11:30 AM.',
        created_at: '2026-03-10T16:00:00Z'
      }
    ]
  }
];

export const CIVIC_METRICS: CivicMetric = {
  total_registered_grievances: 1482,
  resolved_percentage: 84.6,
  average_hearing_days: 22,
  cooperatives_digitized: 4890,
  pacs_computerization_count: 3620,
  vernacular_adoption: {
    kannada_percent: 54,
    hindi_percent: 14,
    tamil_percent: 12,
    telugu_percent: 11,
    malayalam_percent: 5,
    english_percent: 4
  }
};

export const COOPERATIVE_SOCIETIES_DATA: CooperativeSocietySummary[] = [
  {
    id: 'soc-001',
    name: 'Koppa Primary Agricultural Credit Co-operative Society',
    reg_number: 'MDR/PACS/1984/412',
    type: 'PACS',
    district: 'Mandya',
    taluk: 'Maddur',
    active_members: 1840,
    petitions_logged: 34,
    resolved_petitions: 31,
    resolution_rate_percent: 91.2,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 420.5
  },
  {
    id: 'soc-002',
    name: 'Gokak Dairy Farmers Co-operative Society Ltd',
    reg_number: 'GOK/MILK/2004/78',
    type: 'Dairy Producers Co-op',
    district: 'Belagavi',
    taluk: 'Gokak',
    active_members: 1250,
    petitions_logged: 48,
    resolved_petitions: 42,
    resolution_rate_percent: 87.5,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 215.0
  },
  {
    id: 'soc-003',
    name: 'Channarayapatna Milk Co-operative Union',
    reg_number: 'HSN/DAIRY/1996/310',
    type: 'Dairy Producers Co-op',
    district: 'Hassan',
    taluk: 'Channarayapatna',
    active_members: 2420,
    petitions_logged: 62,
    resolved_petitions: 53,
    resolution_rate_percent: 85.5,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 580.0
  },
  {
    id: 'soc-004',
    name: 'Belagavi Rural Agricultural Service Co-op',
    reg_number: 'BLG/PACS/1978/104',
    type: 'PACS',
    district: 'Belagavi',
    taluk: 'Belagavi Rural',
    active_members: 3100,
    petitions_logged: 51,
    resolved_petitions: 44,
    resolution_rate_percent: 86.3,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 690.0
  },
  {
    id: 'soc-005',
    name: 'Nanjangud Farmers Service Co-operative Society',
    reg_number: 'MYS/PACS/1991/223',
    type: 'PACS',
    district: 'Mysuru',
    taluk: 'Nanjangud',
    active_members: 1670,
    petitions_logged: 29,
    resolved_petitions: 25,
    resolution_rate_percent: 86.2,
    erp_computerization_status: 'In Progress',
    audit_grade: 'B',
    kcc_credit_disbursed_lakhs: 345.0
  },
  {
    id: 'soc-006',
    name: 'Tiptur Coconut & Copra Growers Co-operative Society',
    reg_number: 'TUM/MKTG/1982/55',
    type: 'Horticulture Co-op',
    district: 'Tumakuru',
    taluk: 'Tiptur',
    active_members: 2890,
    petitions_logged: 41,
    resolved_petitions: 37,
    resolution_rate_percent: 90.2,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 710.0
  },
  {
    id: 'soc-007',
    name: 'Sagara Taluk Agricultural Produce Co-op Society',
    reg_number: 'SHM/PACS/1989/194',
    type: 'PACS',
    district: 'Shivamogga',
    taluk: 'Sagara',
    active_members: 1430,
    petitions_logged: 22,
    resolved_petitions: 20,
    resolution_rate_percent: 90.9,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 310.0
  },
  {
    id: 'soc-008',
    name: 'Kundapura Coastal Fishermen Co-operative Society',
    reg_number: 'UDP/FISH/2001/88',
    type: 'PACS',
    district: 'Udupi',
    taluk: 'Kundapura',
    active_members: 980,
    petitions_logged: 18,
    resolved_petitions: 15,
    resolution_rate_percent: 83.3,
    erp_computerization_status: 'In Progress',
    audit_grade: 'B',
    kcc_credit_disbursed_lakhs: 180.0
  },
  {
    id: 'soc-009',
    name: 'Kolar District Horticulture & Mango Producers Co-op',
    reg_number: 'KLR/HORT/1998/142',
    type: 'Horticulture Co-op',
    district: 'Kolar',
    taluk: 'Srinivaspur',
    active_members: 1750,
    petitions_logged: 33,
    resolved_petitions: 28,
    resolution_rate_percent: 84.8,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 390.0
  },
  {
    id: 'soc-010',
    name: 'Mudhol Sugarcane Growers Co-operative Society Ltd',
    reg_number: 'BGK/SUGAR/1994/309',
    type: 'PACS',
    district: 'Bagalkote',
    taluk: 'Mudhol',
    active_members: 3450,
    petitions_logged: 57,
    resolved_petitions: 47,
    resolution_rate_percent: 82.5,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 820.0
  },
  {
    id: 'soc-011',
    name: 'Ranebennur Oilseeds & Cotton Co-operative Society',
    reg_number: 'HVR/PACS/2000/171',
    type: 'PACS',
    district: 'Haveri',
    taluk: 'Ranebennur',
    active_members: 1520,
    petitions_logged: 26,
    resolved_petitions: 21,
    resolution_rate_percent: 80.8,
    erp_computerization_status: 'In Progress',
    audit_grade: 'B',
    kcc_credit_disbursed_lakhs: 295.0
  },
  {
    id: 'soc-012',
    name: 'Ilkal Traditional Handloom Weavers Co-operative Society',
    reg_number: 'BGK/WEAV/1987/64',
    type: 'Weavers Co-op',
    district: 'Bagalkote',
    taluk: 'Ilkal',
    active_members: 890,
    petitions_logged: 15,
    resolved_petitions: 13,
    resolution_rate_percent: 86.7,
    erp_computerization_status: 'Scheduled',
    audit_grade: 'B',
    kcc_credit_disbursed_lakhs: 140.0
  },
  {
    id: 'soc-013',
    name: 'Sirsi Arecanut & Spice Farmers Co-operative Marketing Society',
    reg_number: 'UK/TSS/1975/12',
    type: 'Horticulture Co-op',
    district: 'Uttara Kannada',
    taluk: 'Sirsi',
    active_members: 2780,
    petitions_logged: 38,
    resolved_petitions: 35,
    resolution_rate_percent: 92.1,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 640.0
  },
  {
    id: 'soc-014',
    name: 'Gadag District Central Co-operative Bank - Betageri Branch',
    reg_number: 'GDG/DCCB/1980/05',
    type: 'DCCB Branch',
    district: 'Gadag',
    taluk: 'Gadag',
    active_members: 4120,
    petitions_logged: 49,
    resolved_petitions: 44,
    resolution_rate_percent: 89.8,
    erp_computerization_status: 'Completed',
    audit_grade: 'A',
    kcc_credit_disbursed_lakhs: 980.0
  }
];
