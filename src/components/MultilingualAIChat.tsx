import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Scale, 
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CornerDownRight,
  BookOpen,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, SupportedLanguage, UserProfile } from '../types';
import { TRANSLATIONS, ROLE_SAMPLE_QUESTIONS } from '../i18n/translations';

// Sanitizer to eliminate rogue asterisks, markdown artifacts, raw hashtags, and escaped symbols
function cleanTextForDisplay(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove **bold** markdown
    .replace(/\*(.*?)\*/g, '$1') // remove *italic* markdown
    .replace(/\*{1,3}/g, '') // remove stray asterisks
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .replace(/`+/g, '')
    .replace(/^#{1,6}\s+/gm, '') // remove ### headers
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .trim();
}

function classifyQueryDomain(text: string): 'scheme_query' | 'grievance_process' | 'governance_bylaws' | 'general_cooperative' {
  const normalized = text.toLowerCase();
  
  const grievanceKeywords = [
    'grievance', 'dispute', 'court', 'registrar', 'appeal', 'arcs', 'complain', 'petition', 'fraud', 'irregularity',
    'ದೂರು', 'ವಿವಾದ', 'ಅಪೀಲು', 'ಅರ್ಜಿ', 'ಶೋಷಣೆ',
    'शिकायत', 'विवाद', 'अपील', 'गड़बड़ी', 'धोखाधड़ी', 'ssp problem', 'scholarship problem'
  ];
  
  const bylawsKeywords = [
    'bylaw', 'bye-law', 'bye law', 'rule', 'meeting', 'agm', 'election', 'vote', 'voting', 'quorum', 'clause',
    'ಉಪನಿಯಮ', 'ಬೈಲಾ', 'ಸಭೆ', 'ಚುನಾವಣೆ', 'ಮತ', 'ಕೋರಂ',
    'उपनियम', 'बैठक', 'चुनाव', 'मतदान', 'कोरम'
  ];
  
  const schemeKeywords = [
    'scheme', 'subsidy', 'ssp', 'scholarship', 'loan', 'kcc', 'kisan', 'solar', 'kusum', 'yashaswini', 'insurance', 'pmfby', 'apply', 'portal', 'official link', 'link',
    'ಯೋಜನೆ', 'ಸಹಾಯಧನ', 'ಸಾಲ', 'ವಿಮೆ', 'ಬೆಳೆ ವಿಮೆ', 'ಲಿಂಕ್',
    'योजना', 'अनुदान', 'ऋण', 'लोन', 'बीमा', 'लिंक'
  ];

  if (grievanceKeywords.some(keyword => normalized.includes(keyword))) {
    return 'grievance_process';
  }
  if (bylawsKeywords.some(keyword => normalized.includes(keyword))) {
    return 'governance_bylaws';
  }
  if (schemeKeywords.some(keyword => normalized.includes(keyword))) {
    return 'scheme_query';
  }
  return 'general_cooperative';
}

interface MultilingualAIChatProps {
  language: SupportedLanguage;
  userProfile: UserProfile;
  onNavigateToPetition: () => void;
  isAuthenticated?: boolean;
  onNavigateToLogin?: () => void;
}

export const MultilingualAIChat: React.FC<MultilingualAIChatProps> = ({
  language,
  userProfile,
  onNavigateToPetition,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeDomain, setActiveDomain] = useState<'scheme_query' | 'grievance_process' | 'governance_bylaws' | 'general_cooperative' | null>(null);
  const [memoryLogs, setMemoryLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any active audio and speech synthesis safely
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechActiveId(null);
    setAudioLoadingId(null);
  };

  // Cleanup audio on unmount or language switch
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [language]);

  // Pre-fetch browser speech synthesis voices so they are cached early
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Initialize clean welcome message without asterisks or unwanted symbols
  useEffect(() => {
    let welcome = '';
    const roleLabel = userProfile.role === 'farmer' 
      ? (language === 'kn' ? 'ರೈತ ಸದಸ್ಯ' : language === 'hi' ? 'किसान सदस्य' : 'Farmer Member')
      : userProfile.role === 'dairy_artisan' 
      ? (language === 'kn' ? 'ಹಾಲು ಉತ್ಪಾದಕ' : language === 'hi' ? 'दुग्ध उत्पादक' : 'Dairy Producer')
      : userProfile.role === 'secretary' 
      ? (language === 'kn' ? 'ಸಂಘದ ಕಾರ್ಯದರ್ಶಿ' : language === 'hi' ? 'समिति सचिव' : 'Society Secretary')
      : (language === 'kn' ? 'ನಾಗರಿಕ' : language === 'hi' ? 'नागरिक' : 'Citizen');

    if (language === 'kn') {
      welcome = `ನಮಸ್ಕಾರ ${userProfile.name || 'ಸಹಕಾರಿ ಬಂಧುಗಳೇ'}! ನಾನು ಸಹಾಯ ಸಹಕಾರ ಆಡಳಿತ AI ಸಹಾಯಕ.\n\nನ್ಯಾಯವ್ಯಾಪ್ತಿ: ಕರ್ನಾಟಕ ಸಹಕಾರ ಸಂಘಗಳ ಕಾಯ್ದೆ ೧೯೫೯ • ಪಾತ್ರ: ${roleLabel}.\n\nಕೃಷಿ ಸಾಲ (KCC 0% ಬಡ್ಡಿ), ರಸಗೊಬ್ಬರ ಪಾಲು, ಮತದಾನದ ಹಕ್ಕು, ಬೋನಸ್ ಅಥವಾ ಕುಂದುಕೊರತೆಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.`;
    } else if (language === 'hi') {
      welcome = `नमस्ते ${userProfile.name || 'सहकारी साथी'}! मैं 'सहाय' कानूनी उप-नियम AI सहायक हूँ।\n\nन्यायक्षेत्र: कर्नाटक सहकारी समिति अधिनियम 1959 • भूमिका: ${roleLabel}।\n\nशून्य ब्याज केसीसी ऋण, पैक्स सदस्यता, मतदान अधिकार या दूध बोनस के बारे में कोई भी प्रश्न पूछें।`;
    } else {
      welcome = `Hello ${userProfile.name || 'Member'}! I am Sahaya, your cooperative legal and regulatory advisor.\n\nRole: ${roleLabel} • Jurisdiction: Karnataka Co-operative Societies Act, 1959.\n\nAsk about PACS share capital, KCC 0% crop loans, AGM voting rights, milk fat testing norms, or Section 70 dispute filings.`;
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        content: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Karnataka Co-operative Societies Act, 1959',
            act_or_bylaw: 'KCS Act 1959',
            section_or_clause: 'Section 20 & Section 70',
            excerpt: 'Provisions for open membership and dispute adjudication before the Assistant Registrar of Cooperative Societies.',
            confidence: 'High'
          }
        ],
        evidence_strength: 'Statutory Law'
      }
    ]);
  }, [language, userProfile.role, userProfile.name]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice Speech Recognition
  const toggleVoiceRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (language === 'kn') recognition.lang = 'kn-IN';
      else if (language === 'hi') recognition.lang = 'hi-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Browser speech synthesis fallback with explicit language voice binding
  const fallbackToBrowserSpeech = (cleanText: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      setAudioLoadingId(null);
      setSpeechActiveId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | null = null;

      if (language === 'kn') {
        utterance.lang = 'kn-IN';
        matchedVoice = voices.find(v => 
          v.lang.toLowerCase().includes('kn') || 
          v.name.toLowerCase().includes('kannada')
        ) || null;
      } else if (language === 'hi') {
        utterance.lang = 'hi-IN';
        matchedVoice = voices.find(v => 
          v.lang.toLowerCase().includes('hi') || 
          v.name.toLowerCase().includes('hindi')
        ) || null;
      } else {
        utterance.lang = 'en-IN';
        matchedVoice = voices.find(v => 
          v.lang.toLowerCase().includes('en-in') || 
          v.lang.toLowerCase().includes('en')
        ) || null;
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = 0.95;
      utterance.onstart = () => {
        setAudioLoadingId(null);
        setSpeechActiveId(msgId);
      };
      utterance.onend = () => {
        setSpeechActiveId(null);
        setAudioLoadingId(null);
      };
      utterance.onerror = () => {
        setSpeechActiveId(null);
        setAudioLoadingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Browser speech error:', e);
      setSpeechActiveId(null);
      setAudioLoadingId(null);
    }
  };

  // High-fidelity Multilingual Listen Feature
  // Delivers natural Kannada, Hindi, and English audio via backend TTS with browser synthesis fallback
  const handleReadAloud = async (text: string, msgId: string) => {
    // If currently playing or loading this message, stop it
    if (speechActiveId === msgId || audioLoadingId === msgId) {
      stopAudio();
      return;
    }

    stopAudio();
    setAudioLoadingId(msgId);

    const cleanText = cleanTextForDisplay(text);

    try {
      const res = await fetch('/api/v1/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, language })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audioRef.current = audio;

          audio.onplay = () => {
            setAudioLoadingId(null);
            setSpeechActiveId(msgId);
          };

          audio.onended = () => {
            setSpeechActiveId(null);
            setAudioLoadingId(null);
            audioRef.current = null;
          };

          audio.onerror = () => {
            console.warn('Audio playback error, falling back to local synthesizer');
            fallbackToBrowserSpeech(cleanText, msgId);
          };

          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Backend TTS server error, trying local synthesis fallback:', err);
    }

    // Fallback if backend TTS is unavailable
    fallbackToBrowserSpeech(cleanText, msgId);
  };

  const handleCopy = (text: string, id: string) => {
    const cleanText = cleanTextForDisplay(text);
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const detectedDomain = classifyQueryDomain(query);

    // Logging memory transitions
    if (activeDomain && activeDomain !== detectedDomain) {
      setMemoryLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Topic switched: ${activeDomain} ➔ ${detectedDomain}. Isolated history to prevent leakage.`
      ]);
    } else if (!activeDomain) {
      setMemoryLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Initialized Session Domain: ${detectedDomain}`
      ]);
    }
    setActiveDomain(detectedDomain);

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      domain: detectedDomain
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages
            .filter(msg => !msg.domain || msg.domain === detectedDomain)
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
            })),
          domain: detectedDomain,
          language,
          role: userProfile.role,
          jurisdiction: userProfile.jurisdiction
        })
      });

      if (!response.ok) throw new Error(`Server status ${response.status}`);
      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: cleanTextForDisplay(data.reply || 'Unable to generate response at this time.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        evidence_strength: data.evidence_strength || 'Statutory Law',
        domain: detectedDomain
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: language === 'kn'
          ? 'ಕ್ಷಮಿಸಿ, ತಾಂತ್ರಿಕ ದೋಷ ಕಂಡುಬಂದಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
          : language === 'hi'
          ? 'क्षमा करें, तकनीकी त्रुटि हुई है। कृपया पुनः प्रयास करें।'
          : 'Unable to retrieve statutory citations. Please verify connectivity and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Structured message renderer without unwanted markdown asterisks, raw hashes or strange symbols
  const renderMessageContent = (content: string, isAssistant: boolean) => {
    const cleanContent = cleanTextForDisplay(content);
    const paragraphs = cleanContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    const renderLineWithLinks = (text: string, isAsst: boolean) => {
      const urlRegex = /(https?:\/\/[^\s\)]+)/g;
      const parts = text.split(urlRegex);
      if (parts.length === 1) {
        return text;
      }
      return parts.map((part, index) => {
        if (part.match(urlRegex)) {
          let url = part;
          let suffix = '';
          if (url.endsWith('.') || url.endsWith(',') || url.endsWith(';')) {
            suffix = url.slice(-1);
            url = url.slice(0, -1);
          }
          return (
            <React.Fragment key={index}>
              <button
                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-0.5 font-bold text-emerald-700 hover:text-emerald-800 underline bg-emerald-50/80 px-1 py-0.5 rounded transition-colors text-[11px] sm:text-xs cursor-pointer"
              >
                <span>{url}</span>
                <ExternalLink className="w-3 h-3 inline shrink-0" />
              </button>
              {suffix}
            </React.Fragment>
          );
        }
        return part;
      });
    };

    return (
      <div className="space-y-2.5 leading-relaxed">
        {paragraphs.map((para, pIdx) => {
          const lines = para.split('\n').map(l => l.trim()).filter(Boolean);

          return (
            <div key={pIdx} className="space-y-2">
              {lines.map((line, lIdx) => {
                // Check if line is a numbered item e.g. "1. ", "2. ", "1) "
                const numMatch = line.match(/^(\d+[\.\)])\s*(.*)/);
                if (numMatch) {
                  const numStr = numMatch[1];
                  const bodyText = numMatch[2];
                  const colonSplit = bodyText.match(/^([^:]{2,35}):\s*(.*)/);

                  return (
                    <div key={lIdx} className="flex items-start gap-2.5 my-1.5">
                      <span className={`shrink-0 font-medium text-xs px-1.5 py-0.5 rounded ${
                        isAssistant 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' 
                          : 'bg-slate-800 text-slate-200'
                      }`}>
                        {numStr}
                      </span>
                      <div className="flex-1 text-xs sm:text-sm">
                        {colonSplit ? (
                          <>
                            <span className="font-semibold text-slate-900">{colonSplit[1]}: </span>
                            <span className={isAssistant ? 'text-slate-700 font-medium' : 'text-slate-200'}>
                              {renderLineWithLinks(colonSplit[2], isAssistant)}
                            </span>
                          </>
                        ) : (
                          <span className={isAssistant ? 'text-slate-700 font-medium' : 'text-slate-200'}>
                            {renderLineWithLinks(bodyText, isAssistant)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                // Check if line is a bullet item e.g. "• ", "- ", "* "
                const bulletMatch = line.match(/^[•\-\*]\s*(.*)/);
                if (bulletMatch) {
                  const bodyText = bulletMatch[1];
                  const colonSplit = bodyText.match(/^([^:]{2,35}):\s*(.*)/);

                  return (
                    <div key={lIdx} className="flex items-start gap-2 my-1 pl-1 text-xs sm:text-sm">
                      <span className="text-emerald-600 font-bold leading-none mt-1 shrink-0">•</span>
                      <div className="flex-1">
                        {colonSplit ? (
                          <>
                            <span className="font-semibold text-slate-900">{colonSplit[1]}: </span>
                            <span className={isAssistant ? 'text-slate-700 font-medium' : 'text-slate-200'}>
                              {renderLineWithLinks(colonSplit[2], isAssistant)}
                            </span>
                          </>
                        ) : (
                          <span className={isAssistant ? 'text-slate-700 font-medium' : 'text-slate-200'}>
                            {renderLineWithLinks(bodyText, isAssistant)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                // Standard paragraph / title line
                return (
                  <p key={lIdx} className={`text-xs sm:text-sm ${isAssistant ? 'text-slate-800' : 'text-slate-100'}`}>
                    {renderLineWithLinks(line, isAssistant)}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const sampleQuestions = ROLE_SAMPLE_QUESTIONS[language]?.[userProfile.role] || [];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto px-4 py-4">
      {/* Conversation Memory Manager Dashboard */}
      <div id="memory-manager-dashboard" className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100/60 shadow-3xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              <span>Sahaya Memory Engine</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Active
              </span>
            </h4>
            <p className="text-slate-500 text-[10px]">Real-time query routing & domain-isolated context storage</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Domain:</span>
            {activeDomain ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-emerald-800 bg-emerald-50/80 border border-emerald-100 uppercase tracking-wide text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {activeDomain === 'scheme_query' && 'Government Schemes'}
                {activeDomain === 'grievance_process' && 'Grievances & Appeals'}
                {activeDomain === 'governance_bylaws' && 'Cooperative Bylaws'}
                {activeDomain === 'general_cooperative' && 'General Cooperative'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-slate-400 bg-slate-50 border border-slate-100 text-[10px] uppercase tracking-wide font-semibold">
                Idle
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="text-[10px] text-slate-600 hover:text-emerald-700 hover:border-emerald-200 bg-slate-50 hover:bg-emerald-50 border border-slate-200 px-2 py-1 rounded-lg transition-all cursor-pointer font-semibold"
            >
              {showLogs ? 'Hide Logs' : `Logs (${memoryLogs.length})`}
            </button>

            {activeDomain && (
              <button
                onClick={() => {
                  setActiveDomain(null);
                  setMessages([]);
                  setMemoryLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Session memory and conversation context manually purged.`]);
                }}
                className="text-[10px] text-slate-600 hover:text-rose-600 hover:border-rose-200 bg-slate-50 hover:bg-rose-50 border border-slate-200 px-2 py-1 rounded-lg transition-all cursor-pointer font-semibold"
                title="Purge session memory to clear all context"
              >
                Purge
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Memory Engine Terminal Logs */}
      {showLogs && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-4 text-[10.5px] font-mono text-emerald-400 max-h-36 overflow-y-auto shadow-inner space-y-1.5">
          <div className="flex justify-between items-center text-[9.5px] text-slate-400 uppercase font-semibold pb-1.5 border-b border-slate-800/80 mb-2">
            <span>Memory Engine Transitions Terminal</span>
            <button onClick={() => setShowLogs(false)} className="text-rose-400 hover:text-rose-300 font-bold">✕ Close</button>
          </div>
          {memoryLogs.length === 0 ? (
            <div className="text-slate-500 italic">No transition events recorded yet. Ready for queries...</div>
          ) : (
            memoryLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed border-l-2 border-emerald-500/30 pl-2 text-slate-300">
                <span className="text-emerald-500 font-bold">&gt;&gt;</span> {log}
              </div>
            ))
          )}
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const areSourcesOpen = !!expandedSources[msg.id];
          const isAudioPlaying = speechActiveId === msg.id;
          const isAudioLoading = audioLoadingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Scale className="w-4 h-4 text-emerald-100" />
                </div>
              )}

              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isAssistant
                  ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                  : 'bg-slate-900 text-white shadow-2xs ml-8'
              }`}>
                {/* User Message Header with Domain Classification Tag */}
                {!isAssistant && (
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span>👤 You</span>
                      {msg.domain && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] text-emerald-400 border border-slate-700 font-bold uppercase tracking-wider">
                          {msg.domain === 'scheme_query' && 'Schemes & Portals'}
                          {msg.domain === 'grievance_process' && 'Grievances & Appeals'}
                          {msg.domain === 'governance_bylaws' && 'Cooperative Bylaws'}
                          {msg.domain === 'general_cooperative' && 'General Cooperative'}
                        </span>
                      )}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                )}

                {/* Assistant Message Header with Domain Classification Tag */}
                {isAssistant && (
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 text-xs text-slate-400">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <span>Sahaya Counsel</span>
                      {msg.domain && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-50 text-[9px] text-emerald-700 border border-slate-100 font-bold uppercase tracking-wider">
                          {msg.domain === 'scheme_query' && 'Schemes & Portals'}
                          {msg.domain === 'grievance_process' && 'Grievances & Appeals'}
                          {msg.domain === 'governance_bylaws' && 'Cooperative Bylaws'}
                          {msg.domain === 'general_cooperative' && 'General Cooperative'}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px]">{msg.timestamp}</span>
                  </div>
                )}

                {/* Clean, Formatted Message Content without unwanted characters */}
                {renderMessageContent(msg.content, isAssistant)}

                {/* Collapsible Statutory Citations */}
                {isAssistant && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{msg.sources.length} Statutory Source{msg.sources.length > 1 ? 's' : ''} Cited</span>
                      {areSourcesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {areSourcesOpen && (
                      <div className="mt-2 space-y-2">
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-semibold text-slate-800">{src.title}</span>
                              <span className="text-[10px] text-emerald-700 font-medium">{src.section_or_clause}</span>
                            </div>
                            <p className="text-slate-600 italic">"{src.excerpt}"</p>
                            {src.url && (
                              <div className="mt-2 pt-1.5 border-t border-slate-100/80 flex justify-end">
                                <button
                                  onClick={() => window.open(src.url, '_blank', 'noopener,noreferrer')}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors bg-emerald-50 hover:bg-emerald-100/80 px-2 py-1 rounded cursor-pointer"
                                >
                                  <span>View Official Government Source</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Assistant Action Bar */}
                {isAssistant && (
                  <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReadAloud(msg.content, msg.id)}
                        disabled={isAudioLoading}
                        className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isAudioPlaying 
                            ? 'text-rose-600 font-medium' 
                            : isAudioLoading 
                            ? 'text-emerald-700' 
                            : 'hover:text-slate-700 text-slate-500'
                        }`}
                        title="Listen to statutory counsel"
                      >
                        {isAudioLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                            <span className="text-emerald-700">Loading audio...</span>
                          </>
                        ) : isAudioPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="hover:text-slate-700 flex items-center gap-1 text-slate-500 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={onNavigateToPetition}
                      className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>Draft Grievance</span>
                      <CornerDownRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Scale className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>Consulting statutory acts & bylaws...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && sampleQuestions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-2 font-medium">Suggested inquiries:</p>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors text-left cursor-pointer shadow-2xs"
              >
                {cleanTextForDisplay(q)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="relative mt-2">
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-2xs focus-within:border-slate-400 transition-colors">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isListening ? t.chat_listening : t.chat_placeholder}
            className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1 pr-1">
            <button
              onClick={toggleVoiceRecognition}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-50 text-rose-600 animate-pulse'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                inputValue.trim() && !isLoading
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
