"use client";
/* eslint-disable react/display-name, react/no-unescaped-entities, @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
const makeIcon = (symbol) => ({ className = '', ...props }) => (
  <span className={className} role="img" aria-hidden="true" {...props}>{symbol}</span>
);
const BookOpen = makeIcon('📖'), Presentation = makeIcon('▣'), Download = makeIcon('↓');
const MessageCircle = makeIcon('◌'), Mail = makeIcon('✉'), Clock = makeIcon('◷');
const Calendar = makeIcon('□'), CheckCircle = makeIcon('✓'), BarChart2 = makeIcon('▥');
const Shield = makeIcon('◇'), Cpu = makeIcon('▦'), Users = makeIcon('♧');
const FileText = makeIcon('▤'), ChevronRight = makeIcon('›'), ChevronLeft = makeIcon('‹');
const Award = makeIcon('★'), ExternalLink = makeIcon('↗'), Layers = makeIcon('▱');
const PieChart = makeIcon('◔'), Briefcase = makeIcon('▣'), FileCode = makeIcon('{ }');
const Sparkles = makeIcon('✦'), Play = makeIcon('▶');

export default function Home() {
  const [loadingState, setLoadingState] = useState(true); // true = splash screen active
  const [countdown, setCountdown] = useState(20);
  const [activeTab, setActiveTab] = useState('article'); // 'article' or 'presentation'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dateTime, setDateTime] = useState({ time: '', date: '' });
  const [showFullscreenPhoto, setShowFullscreenPhoto] = useState(false);
  const [isPresentationFullscreen, setIsPresentationFullscreen] = useState(false);
  const [waitingLine, setWaitingLine] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef(null);
  const audioStartedRef = useRef(false);
  const endingAudioRef = useRef(null);

  const waitingLines = [
    "The suspense is strong, but my coffee is stronger.",
    "Twenty seconds later: still not a magician, just dramatic.",
    "Please act surprised. The presentation is doing a tiny little victory dance."
  ];

  const welcomeSparkles = [
    { left: 10, top: 18, size: 8, color: '#fbbf24', delay: '0s', duration: '2.2s' },
    { left: 22, top: 12, size: 10, color: '#60a5fa', delay: '0.4s', duration: '2.7s' },
    { left: 32, top: 22, size: 7, color: '#f472b6', delay: '0.8s', duration: '2.3s' },
    { left: 42, top: 16, size: 9, color: '#34d399', delay: '1.1s', duration: '2.9s' },
    { left: 58, top: 12, size: 11, color: '#facc15', delay: '1.4s', duration: '2.5s' },
    { left: 70, top: 18, size: 8, color: '#a78bfa', delay: '1.8s', duration: '2.8s' },
    { left: 82, top: 20, size: 9, color: '#fca5a5', delay: '0.2s', duration: '2.4s' },
    { left: 90, top: 14, size: 8, color: '#93c5fd', delay: '1.6s', duration: '2.6s' },
    { left: 17, top: 72, size: 9, color: '#f9a8d4', delay: '0.7s', duration: '3s' },
    { left: 26, top: 78, size: 7, color: '#fcd34d', delay: '1.3s', duration: '2.4s' },
    { left: 48, top: 82, size: 10, color: '#7dd3fc', delay: '0.9s', duration: '2.7s' },
    { left: 74, top: 76, size: 8, color: '#86efac', delay: '1.7s', duration: '2.9s' },
    { left: 86, top: 72, size: 9, color: '#c4b5fd', delay: '0.5s', duration: '2.8s' },
    { left: 52, top: 38, size: 12, color: '#fde68a', delay: '0.3s', duration: '3.1s' }
  ];

  const playCuriousOpening = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (audioStartedRef.current) {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    audioStartedRef.current = true;
    const startTime = audioContext.currentTime;
    const melody = [261.63, 329.63, 392, 523.25, 392, 329.63, 440, 523.25];

    const scheduleTone = (frequency, time, duration, type, volume) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.05);
      return oscillator;
    };

    for (let phrase = 0; phrase < 7; phrase += 1) {
      const phraseStart = startTime + phrase * 2.32;
      melody.forEach((frequency, noteIndex) => {
        scheduleTone(frequency, phraseStart + noteIndex * 0.22, 0.3, 'triangle', 0.12);
      });

      scheduleTone(130.81, phraseStart, 0.6, 'sine', 0.07);
      scheduleTone(196, phraseStart + 1, 0.6, 'sine', 0.055);

      const boing = scheduleTone(720, phraseStart + 1.72, 0.3, 'sine', 0.14);
      boing.frequency.exponentialRampToValueAtTime(180, phraseStart + 2.02);
      scheduleTone(90, phraseStart + 1.84, 0.14, 'square', 0.04);
    }
  };

  const enableSound = () => {
    setSoundEnabled(true);
    playCuriousOpening();
  };

  // 20-Second Splash Screen Timer with Countdown
  useEffect(() => {
    if (!loadingState) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setActiveTab('presentation');
          setLoadingState(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loadingState]);

  useEffect(() => {
    if (!loadingState) return;
    const lineTimer = setInterval(() => {
      setWaitingLine((previous) => (previous + 1) % waitingLines.length);
    }, 4000);
    return () => clearInterval(lineTimer);
  }, [loadingState, waitingLines.length]);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsPresentationFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  const togglePresentationFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen toggle failed:', error);
    }
  };

  const handleEndingMusic = () => {
    if (!endingAudioRef.current) {
      endingAudioRef.current = new Audio('/audio/laskar-pelangi.mp3');
      endingAudioRef.current.volume = 0.7;
    }

    endingAudioRef.current.currentTime = 0;
    endingAudioRef.current.play().catch(() => {});
  };

  const stopEndingMusic = () => {
    if (!endingAudioRef.current) return;
    endingAudioRef.current.pause();
    endingAudioRef.current.currentTime = 0;
  };

  // Real-time clock and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const t = {
    bg: 'bg-white text-slate-800',
    card: 'bg-white border-slate-200 text-slate-800 shadow-sm',
    primary: 'bg-slate-900 hover:bg-slate-800 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
    accent: 'text-blue-600',
    border: 'border-slate-200',
    header: 'bg-white border-slate-200',
    tableHeader: 'bg-slate-900 text-white'
  };

  const slides = [
    {
      title: "The Influence of Public Perception on Islamic Banking",
      subtitle: "A Study of the Community in North Cikarang District, Bekasi Regency",
      category: "Research Presentation",
      content: (
        <div className="space-y-6 text-center py-8">
          <div className="inline-block p-4 rounded-full bg-blue-500/10 text-blue-600 mb-2">
            <Shield className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Islamic Banking Adoption Study</h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Exploring how knowledge, trust, and product/service quality influence community interest in Sharia financial products.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">100 Respondents</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">North Cikarang District</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Quantitative Study</span>
          </div>
        </div>
      )
    },
    {
      title: "1. Introduction & Background",
      subtitle: "Contextualizing Islamic Economics in Modern Society",
      category: "Introduction",
      content: (
        <div className="space-y-4 text-left">
          <p className="leading-relaxed text-sm">
            In modern economics, the development of Islamic banking offers an alternative financial system based on fairness, transparency, and the prohibition of usury (riba). However, public perception plays a crucial role in determining whether people choose Islamic financial products over conventional ones.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
              <h4 className="font-semibold text-blue-900 mb-1 text-sm">Key Challenges</h4>
              <p className="text-xs opacity-80">Misconceptions that Islamic banks are identical to conventional banks, limited promotion budgets, and conventional mindsets.</p>
            </div>
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
              <h4 className="font-semibold text-indigo-900 mb-1 text-sm">Research Focus</h4>
              <p className="text-xs opacity-80">Analyzing North Cikarang District, Bekasi Regency regarding knowledge, trust, and service quality impact on consumer interest.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. Research Variables & Framework",
      subtitle: "Independent & Dependent Variables Structure",
      category: "Conceptual Framework",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/60 text-center">
              <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-lg text-blue-900">Knowledge (X1)</h3>
              <p className="text-xs opacity-80 mt-1">Understanding of Islamic banking principles & contracts.</p>
            </div>
            <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/60 text-center">
              <Shield className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
              <h3 className="font-bold text-lg text-indigo-900">Trust (X2)</h3>
              <p className="text-xs opacity-80 mt-1">Confidence in security, authenticity, and transparency.</p>
            </div>
            <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/60 text-center">
              <BarChart2 className="w-8 h-8 mx-auto text-teal-600 mb-2" />
              <h3 className="font-bold text-lg text-teal-900">Products & Services (X3)</h3>
              <p className="text-xs opacity-80 mt-1">Satisfaction with financial products and infrastructure.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 text-white text-center font-medium text-sm">
            Dependent Variable (Y): Interest in Choosing Islamic Banking Products
          </div>
        </div>
      )
    },
    {
      title: "3. Survey Methodology & Likert Scale",
      subtitle: "Quantitative Survey of 100 Respondents in North Cikarang",
      category: "Methodology",
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            This study utilizes a 5-point Likert Scale to measure respondent attitudes and perceptions:
          </p>
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
            <div className="p-3 rounded bg-red-100 text-red-800">SD = 1<br/>Strongly Disagree</div>
            <div className="p-3 rounded bg-orange-100 text-orange-800">D = 2<br/>Disagree</div>
            <div className="p-3 rounded bg-amber-100 text-amber-800">N = 3<br/>Neutral</div>
            <div className="p-3 rounded bg-blue-100 text-blue-800">A = 4<br/>Agree</div>
            <div className="p-3 rounded bg-emerald-100 text-emerald-800">SA = 5<br/>Strongly Agree</div>
          </div>
          <div className="p-4 rounded-xl border bg-blue-50/30">
            <h4 className="font-semibold mb-1 text-sm">Mean Score Arithmetic Formula</h4>
            <p className="font-mono text-xs opacity-80 bg-white p-2 rounded border">
              Mean Score = [ Σ(f × Score) ] / N (Where N = 100 respondents)
            </p>
          </div>
        </div>
      )
    },
    {
      title: "4. Key Findings & Mean Scores",
      subtitle: "Statistical Analysis & Variable Breakdown",
      category: "Results",
      content: (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border bg-white shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-blue-900">Knowledge (X1)</p>
                <p className="text-xs opacity-70">Core differences & contracts</p>
              </div>
              <span className="text-lg font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">3.33</span>
            </div>
            <div className="p-3 rounded-lg border bg-white shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-indigo-900">Trust (X2)</p>
                <p className="text-xs opacity-70">Riba avoidance & security</p>
              </div>
              <span className="text-lg font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg">3.58</span>
            </div>
            <div className="p-3 rounded-lg border bg-white shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-teal-900">Products & Services (X3)</p>
                <p className="text-xs opacity-70">Variety & digital accessibility</p>
              </div>
              <span className="text-lg font-bold text-teal-600 px-3 py-1 bg-teal-50 rounded-lg">3.34</span>
            </div>
            <div className="p-3 rounded-lg border bg-white shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-emerald-900">Interest in Choosing (Y)</p>
                <p className="text-xs opacity-70">Intention & preference</p>
              </div>
              <span className="text-lg font-bold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-lg">3.38</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-900 text-white text-xs text-center font-medium">
            Regression Result: R² = 0.68 (Knowledge, Trust, & Services simultaneously explain 68% of community interest)
          </div>
        </div>
      )
    },
    {
      title: "5. Detailed Islamic Contracts in Practice",
      subtitle: "Mudharabah, Musyarakah, and Murabahah in Action",
      category: "Application",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-white shadow-sm space-y-1">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">Mudharabah</span>
            <p className="font-semibold">Profit-Sharing Partnership</p>
            <p className="opacity-80">Bank provides IDR 50M capital for a coffee shop; profits shared under 60:40 ratio; financial losses absorbed by bank.</p>
          </div>
          <div className="p-3 rounded-lg border bg-white shadow-sm space-y-1">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">Musyarakah</span>
            <p className="font-semibold">Joint Venture Partnership</p>
            <p className="opacity-80">Siti (40%/IDR 100M) and Bank (60%/IDR 150M) co-own property; profits & losses split strictly by capital ratio.</p>
          </div>
          <div className="p-3 rounded-lg border bg-white shadow-sm space-y-1">
            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 font-bold">Murabahah</span>
            <p className="font-semibold">Cost-Plus Financing</p>
            <p className="opacity-80">Bank buys motorcycle at IDR 20M and sells to Ani at IDR 23M (transparent IDR 3M margin) in 2-year installments.</p>
          </div>
        </div>
      )
    },
    {
      title: "6. Conclusion & Recommendations",
      subtitle: "Summary of Study Outcomes",
      category: "Conclusion",
      content: (
        <div className="space-y-4 text-left text-sm">
          <p className="leading-relaxed">
            Public perception (Knowledge, Trust, Service Quality) significantly influences community interest in choosing Islamic banking products in North Cikarang District, accounting for 68% of variance in adoption interest.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border bg-blue-50/50">
              <h5 className="font-bold text-blue-900 mb-1">For Institutions</h5>
              <p className="text-xs opacity-80">Focus socialization on competitive edges and transparent products.</p>
            </div>
            <div className="p-3 rounded-lg border bg-indigo-50/50">
              <h5 className="font-bold text-indigo-900 mb-1">For Researchers</h5>
              <p className="text-xs opacity-80">Expand geographic scope and integrate additional variables.</p>
            </div>
            <div className="p-3 rounded-lg border bg-teal-50/50">
              <h5 className="font-bold text-teal-900 mb-1">For Community</h5>
              <p className="text-xs opacity-80">Increase financial literacy and participation in Sharia banking.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Keep pedaling, even when the road feels funny and hard—success is waiting beyond the struggle.",
      subtitle: "Life is like a rusty bicycle: noisy, shaky, and sometimes embarrassing, but if you keep riding, you still reach the destination.",
      category: "Closing Message",
      content: (
        <div className="flex items-center justify-center min-h-70">
          <div className="max-w-4xl text-center space-y-6 py-4">
            <div className="text-5xl sm:text-6xl">🚲</div>
            <p className="text-lg sm:text-2xl font-semibold leading-relaxed text-slate-800">
              “Life is like a rusty bicycle: noisy, shaky, and sometimes embarrassing, but if you keep riding, you still reach the destination. So don’t stop when the road feels funny and hard—keep pedaling, because success is waiting beyond the struggle.”
            </p>
            <p className="text-sm sm:text-base font-bold text-slate-700">Author: “Aji Waluyo”</p>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (activeTab !== 'presentation' || currentSlide !== slides.length - 1) return undefined;

    const timeoutId = setTimeout(() => {
      handleEndingMusic();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [activeTab, currentSlide, slides.length]);

  const downloadDocFile = () => {
    const title = "The Influence of Public Perception on Islamic Banking Toward the Interest in Choosing Islamic Banking Products";
    const subtitle = "(A Study of the Community in North Cikarang District, Bekasi Regency)";
    
    const fullArticleContent = `
================================================================================
${title.toUpperCase()}
${subtitle}
Published by Ajovi_article Studio
Contact: ajiw6836@gmail.com | WhatsApp: 085606119969
================================================================================

1. INTRODUCTION
In modern economics, the development of Islamic banking offers an alternative financial system based on fairness, transparency, and the prohibition of usury (riba). However, public perception plays a crucial role in determining whether people choose Islamic financial products over conventional ones. In many Muslim-majority areas, public perception is often shaped by the misconception that Islamic banks are no different from conventional banks.

This issue is largely driven by factors such as limited promotion budgets, developing banking infrastructure, and human resources that occasionally carry conventional banking mindsets into Islamic institutions. Focusing on North Cikarang District in Bekasi Regency, this study explores how public perceptions—specifically regarding knowledge, trust, and product/service quality—influence the community's interest in choosing Islamic banking products.

2. RESEARCH VARIABLES AND CONCEPTUAL FRAMEWORK
To better understand how these factors relate to one another, the conceptual framework illustrates the relationship between the independent variables (Knowledge X1, Trust X2, and Products & Services X3) and the dependent variable (Interest in Choosing Islamic Banking Products Y).

3. QUANTITATIVE RESEARCH METHODOLOGY & SURVEY INSTRUMENTS
To measure consumer behavior and test the hypotheses, this study uses a quantitative survey methodology. Data was collected from 100 respondents in North Cikarang District using purposive sampling.

Likert Scale & Scoring:
SD = Strongly Disagree (1) | D = Disagree (2) | N = Neutral (3) | A = Agree (4) | SA = Strongly Agree (5)

Variable X1: Knowledge
- Indicator 1: I understand core difference between Islamic banking (profit-sharing) and conventional banking (interest/riba). [SD: 5, D: 15, N: 20, A: 45, SA: 15 | Mean: 3.50]
- Indicator 2: I am familiar with Islamic financial contracts such as mudharabah, musyarakah, and murabahah. [SD: 8, D: 22, N: 25, A: 35, SA: 10 | Mean: 3.17]
Average Variable Knowledge (X1): 3.33

Variable X2: Trust
- Indicator 1: I believe that Islamic banks strictly avoid usury (riba) in all transactions. [SD: 3, D: 10, N: 22, A: 50, SA: 15 | Mean: 3.64]
- Indicator 2: I feel secure entrusting my savings and financial assets to Islamic institutions. [SD: 4, D: 12, N: 24, A: 48, SA: 12 | Mean: 3.52]
Average Variable Trust (X2): 3.58

Variable X3: Product and Services
- Indicator 1: Islamic banks offer a sufficient variety of financing and savings products. [SD: 6, D: 14, N: 30, A: 40, SA: 10 | Mean: 3.34]
- Indicator 2: Digital banking facilities and branch accessibility in North Cikarang are convenient. [SD: 5, D: 18, N: 25, A: 42, SA: 10 | Mean: 3.34]
Average Variable Products & Services (X3): 3.34

Variable Y: Interest in Choosing
- Indicator 1: I have a strong personal interest in opening an account or using products at an Islamic bank. [SD: 4, D: 12, N: 28, A: 46, SA: 10 | Mean: 3.46]
- Indicator 2: I intend to choose Islamic financing schemes (like murabahah or mudharabah) for future capital needs. [SD: 6, D: 16, N: 30, A: 38, SA: 10 | Mean: 3.30]
Average Variable Interest (Y): 3.38

4. FINDINGS, STATISTICAL RESULTS, AND DETAILED ISLAMIC CONTRACT EXAMPLES
Statistical Regression Result (R² = 0.68):
Knowledge (X1), Trust (X2), and Products & Services (X3) simultaneously explain 68% of the community's Interest (Y), while the remaining 32% is influenced by other factors not examined in this study.

DETAILED PRACTICAL EXAMPLES OF CORE ISLAMIC CONTRACTS:

A. Mudharabah (Profit-Sharing Partnership) Contract:
- Conceptual Description: A trust-based partnership contract where one party (shahibul mal / capital provider, typically the Islamic bank) provides 100% of the financial capital, and the other party (mudharib / entrepreneur) contributes management expertise, labor, and operational oversight. Profits generated from the enterprise are distributed according to a pre-agreed percentage ratio (e.g., 60% for the entrepreneur and 40% for the bank). In the event of a genuine business loss not caused by negligence or breach of contract, the financial loss is entirely borne by the capital provider (the bank), while the entrepreneur loses their time and effort.
- Real-World Case Example in North Cikarang: Budi wishes to establish a modern coffee shop in North Cikarang. He applies for funding at an Islamic bank. The bank evaluates the business plan and agrees to provide IDR 50,000,000 under a Mudharabah contract with an agreed 60:40 profit-sharing ratio (60% to Budi, 40% to the bank). During a peak month, the coffee shop generates a net profit of IDR 5,000,000. According to the contract, Budi receives IDR 3,000,000 and the Islamic bank receives IDR 2,000,000. If the business encounters unforeseen market downturns resulting in a financial loss, Budi does not repay principal debt with guaranteed interest; instead, the bank absorbs the monetary loss.

B. Musyarakah (Joint Venture Partnership) Contract:
- Conceptual Description: A partnership agreement where two or more parties combine their capital assets, properties, or specialized skills to fund a commercial enterprise, project, or acquisition. All participating partners contribute capital to the venture and share in the operational management (or delegate it). Profits are distributed among partners according to pre-agreed ratios (which do not necessarily have to match capital proportions), whereas financial losses are distributed strictly in exact proportion to each partner's respective capital contribution percentage.
- Real-World Case Example in North Cikarang: Siti and an Islamic financial institution decide to co-own a commercial shophouse in North Cikarang for retail business. Siti contributes IDR 100,000,000 (representing a 40% equity share), while the Islamic bank provides IDR 150,000,000 (representing a 60% equity share). Total capital equals IDR 250,000,000. Rental income and operational profits are divided according to agreed operational terms, while any future property value depreciation or losses are apportioned strictly on their 40% to 60% capital contribution shares.

C. Murabahah (Cost-Plus Financing) Contract:
- Conceptual Description: A transparent sale-and-purchase transaction where the customer specifies an item they need, and requests the Islamic bank to purchase it directly from a verified supplier. The bank takes legal ownership/title of the asset and then resells it to the customer at the original purchase cost plus an explicit, mutually agreed profit margin (mark-up). The customer reimburses the bank through fixed installments over an agreed tenure. The key characteristic is full transparency regarding the bank's acquisition cost and profit margin, with no compounding interest penalties for late payments.
- Real-World Case Example in North Cikarang: Ani needs a motorcycle for her daily commuting needs in North Cikarang. Instead of taking a conventional interest-bearing loan, she approaches an Islamic bank for Murabahah financing. The bank purchases the motorcycle directly from the dealership for IDR 20,000,000 (cost price). The bank then sells the motorcycle to Ani for IDR 23,000,000 (incorporating a transparent, fixed profit margin of IDR 3,000,000). Ani agrees to pay this total amount in equal monthly installments over a period of two years. Throughout the contract tenure, the installment amount remains fixed and transparent, regardless of market rate fluctuations.

5. CONCLUSION AND RECOMMENDATIONS
Conclusion: Public perception—driven by knowledge, trust, and service quality—significantly influences community interest in choosing Islamic banking products in North Cikarang District.
Recommendations:
- For Islamic Banking Institutions: Focus socialization on competitive edges and transparent products.
- For Future Researchers: Expand geographic scope and integrate additional variables.
- For the Community: Increase financial literacy and participation in Sharia banking.

6. REFERENCES AND RESOURCES
1. Study Documentation and Institutional Research Guidelines (2026).
2. Karim, Adiwarman. (2020). Bank Islam: Analisis Fiqih dan Keuangan. Jakarta: RajaGrafindo Persada.
3. Riani, Fitria Sapta. (2019). Pengaruh Persepsi Masyarakat Tentang Perbankan Syariah Terhadap Minat Memilih Produk Bank Syariah. Undergraduate Thesis.
4. Sugiyono. (2021). Metode Penelitian Kuantitatif, Kualitatif, dan R&D. Bandung: Alfabeta.
5. Likert, Rensis. (1932). A Technique for the Measurement of Attitudes. Archives of Psychology.
6. Siregar, Syofian. (2017). Statistika Parametrik untuk Penelitian Kuantitatif. Jakarta: Bumi Aksara.
7. Antonio, Muhammad Syafi'i. (2021). Bank Syariah dari Teori ke Praktik. Jakarta: Gema Insani.
    `;

    const escapeHtml = (value) => value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const formattedArticleContent = fullArticleContent
      .trim()
      .split('\n')
      .map((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine || /^=+$/.test(trimmedLine)) return '';
        if (trimmedLine === title.toUpperCase()) return `<h1>${escapeHtml(trimmedLine)}</h1>`;
        if (trimmedLine === subtitle) return `<p class="subtitle">${escapeHtml(trimmedLine)}</p>`;
        if (trimmedLine.startsWith('Published by ')) return `<p class="meta">${escapeHtml(trimmedLine)}</p>`;
        if (/^\d+\.\s/.test(trimmedLine)) return `<h2>${escapeHtml(trimmedLine)}</h2>`;
        if (/^[A-Z]\.\s/.test(trimmedLine)) return `<h3>${escapeHtml(trimmedLine)}</h3>`;
        if (trimmedLine.startsWith('- ')) return `<p class="bullet">${escapeHtml(trimmedLine)}</p>`;
        return `<p>${escapeHtml(trimmedLine)}</p>`;
      })
      .join('');

    const documentHtml = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${escapeHtml(title)}</title>
          <style>
            @page { size: A4; margin: 2.54cm; }
            body { color: #111827; font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.55; margin: 0; }
            h1 { font-size: 25pt; line-height: 1.15; text-align: center; margin: 0 0 10pt; font-weight: 700; }
            h2 { font-size: 16pt; line-height: 1.25; margin: 22pt 0 8pt; font-weight: 700; }
            h3 { font-size: 13pt; line-height: 1.3; margin: 15pt 0 5pt; font-weight: 700; }
            p { margin: 0 0 9pt; text-align: justify; }
            .subtitle { text-align: center; font-size: 13pt; font-style: italic; margin-bottom: 8pt; }
            .meta { text-align: center; font-size: 10pt; color: #374151; margin-bottom: 24pt; }
            .bullet { padding-left: 18pt; text-indent: -12pt; }
          </style>
        </head>
        <body>${formattedArticleContent}</body>
      </html>`;

    const blob = new Blob([documentHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Ajovi_article_Complete_Research.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loadingState) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (countdown / 20) * circumference;

    return (
      <div className="welcome-screen fixed inset-0 z-50 bg-slate-950 text-slate-900 flex flex-col items-center justify-center p-0">
        {/* Full screen photo background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/photo-profil.jpeg"
            alt="Ajovi_article Fullscreen Photo" 
            className="w-full h-full object-cover object-center"
          />
          <div className="welcome-overlay absolute inset-0 bg-white/55" />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <style jsx>{`
              @keyframes welcomeTwinkle {
                0% { opacity: 0; transform: scale(0.4) translateY(0px); }
                18% { opacity: 1; }
                52% { opacity: 1; }
                100% { opacity: 0; transform: scale(2.1) translateY(-20px); }
              }

              @keyframes welcomePulse {
                0% { opacity: 0; transform: scale(0.7); }
                18% { opacity: 1; }
                55% { opacity: 0.75; }
                100% { opacity: 0; transform: scale(2.2); }
              }

              @keyframes welcomeBloom {
                0% { opacity: 0; transform: scale(0.75) blur(10px); }
                25% { opacity: 0.9; }
                60% { opacity: 0.6; }
                100% { opacity: 0; transform: scale(1.45) blur(18px); }
              }

              @keyframes welcomeFloat {
                0% { transform: translate3d(0, 12px, 0) scale(0.95); opacity: 0; }
                25% { opacity: 1; }
                100% { transform: translate3d(0, -20px, 0) scale(1.12); opacity: 0; }
              }

              @keyframes spotlightSweep {
                0% { transform: translateX(-18%) translateY(-8%) scale(0.8); opacity: 0; }
                20% { opacity: 0.9; }
                50% { opacity: 0.75; }
                100% { transform: translateX(22%) translateY(10%) scale(1.25); opacity: 0; }
              }

              .welcome-stage {
                position: absolute;
                inset: 0;
                animation: welcomeBloom 2.6s ease-out forwards;
              }

              .welcome-center-glow {
                position: absolute;
                left: 50%;
                top: 50%;
                width: 280px;
                height: 280px;
                transform: translate(-50%, -50%);
                border-radius: 9999px;
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.25) 18%, rgba(59,130,246,0.22) 32%, rgba(251,191,36,0.1) 52%, transparent 72%);
                filter: blur(12px);
                animation: welcomePulse 2.8s ease-out forwards;
              }

              .welcome-spotlight {
                position: absolute;
                left: 15%;
                top: 8%;
                width: 68%;
                height: 72%;
                background: linear-gradient(110deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.22) 26%, rgba(255,255,255,0.06) 42%, transparent 62%);
                filter: blur(18px);
                transform: rotate(-7deg);
                animation: spotlightSweep 3s ease-out forwards;
              }

              .welcome-spark {
                position: absolute;
                border-radius: 9999px;
                box-shadow: 0 0 12px currentColor;
                animation-name: welcomeTwinkle;
                animation-timing-function: ease-out;
                animation-fill-mode: both;
              }

              .welcome-burst {
                position: absolute;
                border-radius: 9999px;
                animation-name: welcomePulse;
                animation-timing-function: ease-out;
                animation-fill-mode: both;
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.18) 25%, transparent 70%);
              }

              .welcome-float {
                position: absolute;
                border-radius: 9999px;
                background: rgba(255,255,255,0.8);
                box-shadow: 0 0 10px rgba(255,255,255,0.7);
                animation: welcomeFloat 2.8s ease-out forwards;
              }

              @media (max-width: 640px) {
                .welcome-screen {
                  background: #0f172a;
                }

                .welcome-overlay {
                  background: rgba(15, 23, 42, 0.28);
                }

                .welcome-panel {
                  width: min(82vw, 18rem);
                  max-width: none;
                  max-height: 68dvh;
                  overflow-y: auto;
                  padding: 0.8rem;
                  margin: 0;
                  gap: 0.55rem;
                  background: rgba(255, 255, 255, 0.74);
                  border-color: rgba(255, 255, 255, 0.72);
                  backdrop-filter: blur(8px);
                  -webkit-backdrop-filter: blur(8px);
                }

                .welcome-panel > div:first-child h1 {
                  font-size: clamp(1.1rem, 5vw, 1.35rem);
                }

                .welcome-panel > div:nth-child(2) {
                  width: clamp(4.5rem, 22vw, 5.5rem);
                  height: clamp(4.5rem, 22vw, 5.5rem);
                }

                .welcome-panel > div:nth-child(2) svg {
                  width: 100%;
                  height: 100%;
                }

                .welcome-panel > div:nth-child(2) span:first-child {
                  font-size: 1.5rem;
                }

                .welcome-panel > div:last-child p {
                  font-size: 0.7rem;
                  line-height: 1.25;
                }

                .welcome-panel > div:last-child button {
                  padding: 0.6rem 0.75rem;
                  font-size: 0.7rem;
                }
              }

              @media (max-width: 380px) {
                .welcome-panel {
                  width: min(76vw, 15rem);
                  max-width: none;
                  max-height: 62dvh;
                  padding: 0.65rem;
                }

                .welcome-panel > div:nth-child(2) {
                  width: 4.25rem;
                  height: 4.25rem;
                }

                .welcome-panel > div:nth-child(2) span:first-child {
                  font-size: 1.25rem;
                }
              }
            `}</style>

            <div className="welcome-stage" />
            <div className="welcome-center-glow" />
            <div className="welcome-spotlight" />

            {Array.from({ length: 18 }).map((_, index) => (
              <span
                key={`float-${index}`}
                className="welcome-float"
                style={{
                  left: `${10 + (index * 5) % 80}%`,
                  top: `${15 + (index * 7) % 65}%`,
                  width: `${2 + (index % 4)}px`,
                  height: `${2 + (index % 4)}px`,
                  animationDelay: `${(index % 7) * 0.18}s`,
                  opacity: 0.6,
                  background: ['#fef3c7', '#bfdbfe', '#f9a8d4', '#bbf7d0', '#ddd6fe'][index % 5]
                }}
              />
            ))}

            {welcomeSparkles.map((spark, index) => (
              <div key={`spark-${index}`}>
                <span
                  className="welcome-spark"
                  style={{
                    left: `${spark.left}%`,
                    top: `${spark.top}%`,
                    width: `${spark.size}px`,
                    height: `${spark.size}px`,
                    color: spark.color,
                    backgroundColor: spark.color,
                    animationDuration: spark.duration,
                    animationDelay: spark.delay
                  }}
                />
                <span
                  className="welcome-burst"
                  style={{
                    left: `calc(${spark.left}% - 24px)`,
                    top: `calc(${spark.top}% - 24px)`,
                    width: `${spark.size * 5}px`,
                    height: `${spark.size * 5}px`,
                    animationDuration: spark.duration,
                    animationDelay: spark.delay
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="welcome-panel absolute bottom-4 right-4 z-10 flex flex-col items-center justify-center p-5 sm:p-8 bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl shadow-2xl max-w-sm w-[calc(100%-2rem)] text-center space-y-4 sm:space-y-6">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Ajovi_article Studio</h1>
            <p className="text-xs text-blue-600 mt-1 uppercase tracking-widest font-semibold">Research & Presentation Platform</p>
          </div>

          {/* Circular Countdown Timer */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center my-1 sm:my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-slate-200"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-blue-400 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{countdown}s</span>
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold">Remaining</span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <p className="min-h-10 text-sm font-medium italic text-slate-600 flex items-center justify-center">
              &ldquo;{waitingLines[waitingLine]}&rdquo;
            </p>
            {!soundEnabled && (
              <button
                type="button"
                onClick={enableSound}
                className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
              >
                Proceed and let the suspense unfold 
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${t.bg} flex flex-col font-sans`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${t.header} shadow-sm backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0" onClick={() => setShowFullscreenPhoto(true)} title="Click to view full screen photo">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-400 shadow-md">
              <img src="/photo-profil.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg leading-tight flex items-center gap-1.5 truncate">
                <span>Ajovi_article</span>
                <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
              </h1>
              <p className="text-[10px] sm:text-xs opacity-70 truncate">Research & Presentation Studio</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-xs opacity-80">
            <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 text-blue-700">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateTime.date}</span>
            </div>
            <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 text-blue-700">
              <Clock className="w-3.5 h-3.5" />
              <span>{dateTime.time}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://wa.me/6285606119969"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href="mailto:ajiw6836@gmail.com"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </header>

      {/* Navigation Tabs and Download .DOC button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6 pb-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex w-full sm:w-auto p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('article')}
            className={`flex-1 sm:flex-none justify-center flex items-center space-x-2 px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'article' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Article View</span>
          </button>
          <button
            onClick={() => setActiveTab('presentation')}
            className={`flex-1 sm:flex-none justify-center flex items-center space-x-2 px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'presentation' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>PowerPoint Deck</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {activeTab === 'presentation' && (
            <button
              type="button"
              onClick={togglePresentationFullscreen}
              className="flex-1 sm:flex-none justify-center flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg transition-all hover:bg-slate-800"
            >
              <span>{isPresentationFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
          )}
          <button
            onClick={downloadDocFile}
            className={`flex-1 sm:flex-none justify-center flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-xl ${t.primary} text-xs font-semibold shadow-lg transition-all`}
          >
            <Download className="w-4 h-4" />
            <span>Download Complete Research (.DOC)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={
        activeTab === 'presentation'
          ? 'w-full max-w-[100vw] px-2 sm:px-4 lg:px-6 py-6 flex-1'
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full'
      }>
        {activeTab === 'article' ? (
          <article className={`p-6 sm:p-12 rounded-2xl border ${t.card} space-y-8`}>
            
            {/* Title Block */}
            <div className="border-b pb-8 border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Islamic Banking</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">North Cikarang Case Study</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Quantitative Research</span>
                </div>
                <button
                  onClick={() => setShowFullscreenPhoto(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center space-x-1 shadow hover:bg-blue-700 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                  <span>View Full Photo</span>
                </button>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                The Influence of Public Perception on Islamic Banking Toward the Interest in Choosing Islamic Banking Products
              </h1>
              <p className="text-base sm:text-lg italic opacity-80">
                (A Study of the Community in North Cikarang District, Bekasi Regency)
              </p>
              <div className="flex flex-wrap items-center justify-between pt-2 text-xs opacity-70 gap-2">
                <span>Published by <strong>Ajovi_article Studio</strong></span>
                <span>Contact: ajiw6836@gmail.com | WA: 085606119969</span>
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <span>1. Introduction</span>
              </h2>
              <p className="leading-relaxed">
                In modern economics, the development of Islamic banking offers an alternative financial system based on fairness, transparency, and the prohibition of usury (riba). However, public perception plays a crucial role in determining whether people choose Islamic financial products over conventional ones. In many Muslim-majority areas, public perception is often shaped by the misconception that Islamic banks are no different from conventional banks.
              </p>
              <p className="leading-relaxed">
                This issue is largely driven by factors such as limited promotion budgets, developing banking infrastructure, and human resources that occasionally carry conventional banking mindsets into Islamic institutions. Focusing on North Cikarang District in Bekasi Regency, this study explores how public perceptions—specifically regarding knowledge, trust, and product/service quality—influence the community's interest in choosing Islamic banking products.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <span>2. Research Variables and Conceptual Framework</span>
              </h2>
              <p className="leading-relaxed">
                To better understand how these factors relate to one another, the conceptual framework illustrates the relationship between the independent variables (representing Public Perception consisting of Knowledge, Trust, and Products & Services) and the dependent variable (representing the Interest in Choosing Islamic Banking Products).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border bg-blue-50/40 border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-1">Knowledge (X1)</h4>
                  <p className="text-sm opacity-80">Measures community understanding of Islamic financial concepts and profit-sharing principles.</p>
                </div>
                <div className="p-4 rounded-xl border bg-indigo-50/40 border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-1">Trust (X2)</h4>
                  <p className="text-sm opacity-80">Measures confidence in security, authenticity, and strict avoidance of usury.</p>
                </div>
                <div className="p-4 rounded-xl border bg-teal-50/40 border-teal-100">
                  <h4 className="font-bold text-teal-900 mb-1">Products & Services (X3)</h4>
                  <p className="text-sm opacity-80">Measures satisfaction with product variety, digital facilities, and staff hospitality.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <span>3. Quantitative Research Methodology & Survey Instruments</span>
              </h2>
              <p className="leading-relaxed">
                To measure consumer behavior and test hypotheses, this study uses a quantitative survey methodology. Data was collected from 100 respondents in North Cikarang District using purposive sampling.
              </p>
              
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border space-y-2">
                <h4 className="font-bold text-sm">Understanding the Likert Scale & Scoring Method</h4>
                <p className="text-sm opacity-80">
                  SD = Strongly Disagree (1) | D = Disagree (2) | N = Neutral (3) | A = Agree (4) | SA = Strongly Agree (5)
                </p>
              </div>

              {/* Knowledge Variable Table */}
              <div className="space-y-2">
                <h3 className="font-semibold text-md text-blue-700 dark:text-blue-400">Variable X1: Knowledge</h3>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className={t.tableHeader}>
                        <th className="p-3">No</th>
                        <th className="p-3">Statement Indicator</th>
                        <th className="p-3 text-center">SD</th>
                        <th className="p-3 text-center">D</th>
                        <th className="p-3 text-center">N</th>
                        <th className="p-3 text-center">A</th>
                        <th className="p-3 text-center">SA</th>
                        <th className="p-3 text-center font-bold">Mean</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="p-3 font-semibold">1</td>
                        <td className="p-3">I understand core difference between Islamic banking (profit-sharing) and conventional banking (interest/riba).</td>
                        <td className="p-3 text-center">5</td>
                        <td className="p-3 text-center">15</td>
                        <td className="p-3 text-center">20</td>
                        <td className="p-3 text-center">45</td>
                        <td className="p-3 text-center">15</td>
                        <td className="p-3 text-center font-bold text-blue-600">3.50</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">2</td>
                        <td className="p-3">I am familiar with Islamic financial contracts such as mudharabah, musyarakah, and murabahah.</td>
                        <td className="p-3 text-center">8</td>
                        <td className="p-3 text-center">22</td>
                        <td className="p-3 text-center">25</td>
                        <td className="p-3 text-center">35</td>
                        <td className="p-3 text-center">10</td>
                        <td className="p-3 text-center font-bold text-blue-600">3.17</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trust Variable Table */}
              <div className="space-y-2">
                <h3 className="font-semibold text-md text-indigo-700 dark:text-indigo-400">Variable X2: Trust</h3>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className={t.tableHeader}>
                        <th className="p-3">No</th>
                        <th className="p-3">Statement Indicator</th>
                        <th className="p-3 text-center">SD</th>
                        <th className="p-3 text-center">D</th>
                        <th className="p-3 text-center">N</th>
                        <th className="p-3 text-center">A</th>
                        <th className="p-3 text-center">SA</th>
                        <th className="p-3 text-center font-bold">Mean</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="p-3 font-semibold">1</td>
                        <td className="p-3">I believe that Islamic banks strictly avoid usury (riba) in all transactions.</td>
                        <td className="p-3 text-center">3</td>
                        <td className="p-3 text-center">10</td>
                        <td className="p-3 text-center">22</td>
                        <td className="p-3 text-center">50</td>
                        <td className="p-3 text-center">15</td>
                        <td className="p-3 text-center font-bold text-indigo-600">3.64</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">2</td>
                        <td className="p-3">I feel secure entrusting my savings and financial assets to Islamic institutions.</td>
                        <td className="p-3 text-center">4</td>
                        <td className="p-3 text-center">12</td>
                        <td className="p-3 text-center">24</td>
                        <td className="p-3 text-center">48</td>
                        <td className="p-3 text-center">12</td>
                        <td className="p-3 text-center font-bold text-indigo-600">3.52</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product and Services Variable Table */}
              <div className="space-y-2">
                <h3 className="font-semibold text-md text-teal-700 dark:text-teal-400">Variable X3: Product and Services</h3>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className={t.tableHeader}>
                        <th className="p-3">No</th>
                        <th className="p-3">Statement Indicator</th>
                        <th className="p-3 text-center">SD</th>
                        <th className="p-3 text-center">D</th>
                        <th className="p-3 text-center">N</th>
                        <th className="p-3 text-center">A</th>
                        <th className="p-3 text-center">SA</th>
                        <th className="p-3 text-center font-bold">Mean</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="p-3 font-semibold">1</td>
                        <td className="p-3">Islamic banks offer a sufficient variety of financing and savings products.</td>
                        <td className="p-3 text-center">6</td>
                        <td className="p-3 text-center">14</td>
                        <td className="p-3 text-center">30</td>
                        <td className="p-3 text-center">40</td>
                        <td className="p-3 text-center">10</td>
                        <td className="p-3 text-center font-bold text-teal-600">3.34</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">2</td>
                        <td className="p-3">Digital banking facilities and branch accessibility in North Cikarang are convenient and reliable.
</td>
                        <td className="p-3 text-center">5</td>
                        <td className="p-3 text-center">18</td>
                        <td className="p-3 text-center">25</td>
                        <td className="p-3 text-center">42</td>
                        <td className="p-3 text-center">10</td>
                        <td className="p-3 text-center font-bold text-teal-600">3.34</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interest Variable Table */}
              <div className="space-y-2">
                <h3 className="font-semibold text-md text-emerald-700 dark:text-emerald-400">Variable Y: Interest in Choosing</h3>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className={t.tableHeader}>
                        <th className="p-3">No</th>
                        <th className="p-3">Statement Indicator</th>
                        <th className="p-3 text-center">SD</th>
                        <th className="p-3 text-center">D</th>
                        <th className="p-3 text-center">N</th>
                        <th className="p-3 text-center">A</th>
                        <th className="p-3 text-center">SA</th>
                        <th className="p-3 text-center font-bold">Mean</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="p-3 font-semibold">1</td>
                        <td className="p-3">I have a strong personal interest in opening an account or using products at an Islamic bank.</td>
                        <td className="p-3 text-center">4</td>
                        <td className="p-3 text-center">12</td>
                        <td className="p-3 text-center">28</td>
                        <td className="p-3 text-center">46</td>
                        <td className="p-3 text-center">10</td>
                        <td className="p-3 text-center font-bold text-emerald-600">3.46</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">2</td>
                        <td className="p-3">I intend to choose Islamic financing schemes (like murabahah or mudharabah) for future capital needs.</td>
                        <td className="p-3 text-center">6</td>
                        <td className="p-3 text-center">16</td>
                        <td className="p-3 text-center">30</td>
                        <td className="p-3 text-center">38</td>
                        <td className="p-3 text-center">10</td>
                        <td className="p-3 text-center font-bold text-emerald-600">3.30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 4 with Detailed Contract Explanations */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <span>4. Findings, Statistical Results, and Detailed Islamic Contracts</span>
              </h2>
              <div className="p-5 rounded-xl border bg-blue-50/50 space-y-3">
                <h4 className="font-bold text-blue-900">Statistical Regression Result (R² = 0.68)</h4>
                <p className="text-sm leading-relaxed">
                  Knowledge (X1), Trust (X2), and Products & Services (X3) simultaneously explain <strong>68%</strong> of the community's Interest (Y), while the remaining 32% is influenced by other factors not examined in this study.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <h3 className="font-bold text-lg">Detailed Practical Examples & Conceptual Descriptions of Core Islamic Contracts</h3>
                
                {/* Mudharabah Detail Card */}
                <div className="p-5 rounded-xl border bg-white dark:bg-slate-800 shadow-sm space-y-3 border-l-4 border-l-blue-600">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Mudharabah Contract</span>
                    <span className="text-xs opacity-70 font-semibold">Profit-Sharing Partnership</span>
                  </div>
                  <h4 className="font-bold text-base text-blue-900 dark:text-blue-300">1. Mudharabah (Profit-Sharing Partnership)</h4>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    <strong>Conceptual Description:</strong> A trust-based partnership contract where one party (shahibul mal / capital provider, typically the Islamic bank) provides 100% of the financial capital, and the other party (mudharib / entrepreneur) contributes management expertise, labor, and operational oversight. Profits generated from the enterprise are distributed according to a pre-agreed percentage ratio (e.g., 60% for the entrepreneur and 40% for the bank). In the event of a genuine business loss not caused by negligence or breach of contract, the financial loss is entirely borne by the capital provider (the bank), while the entrepreneur loses their time and effort.
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 bg-blue-50/50 dark:bg-slate-900/50 p-3 rounded-lg border">
                    <strong>Real-World Case Example in North Cikarang:</strong> Budi wishes to establish a modern coffee shop in North Cikarang. He applies for funding at an Islamic bank. The bank evaluates the business plan and agrees to provide IDR 50,000,000 under a Mudharabah contract with an agreed 60:40 profit-sharing ratio (60% to Budi, 40% to the bank). During a peak month, the coffee shop generates a net profit of IDR 5,000,000. According to the contract, Budi receives IDR 3,000,000 and the Islamic bank receives IDR 2,000,000. If the business encounters unforeseen market downturns resulting in a financial loss, Budi does not repay principal debt with guaranteed interest; instead, the bank absorbs the monetary loss.
                  </p>
                </div>

                {/* Musyarakah Detail Card */}
                <div className="p-5 rounded-xl border bg-white dark:bg-slate-800 shadow-sm space-y-3 border-l-4 border-l-indigo-600">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">Musyarakah Contract</span>
                    <span className="text-xs opacity-70 font-semibold">Joint Venture Partnership</span>
                  </div>
                  <h4 className="font-bold text-base text-indigo-900 dark:text-indigo-300">2. Musyarakah (Joint Venture Partnership)</h4>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    <strong>Conceptual Description:</strong> A partnership agreement where two or more parties combine their capital assets, properties, or specialized skills to fund a commercial enterprise, project, or acquisition. All participating partners contribute capital to the venture and share in the operational management (or delegate it). Profits are distributed among partners according to pre-agreed ratios (which do not necessarily have to match capital proportions), whereas financial losses are distributed strictly in exact proportion to each partner's respective capital contribution percentage.
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 bg-indigo-50/50 dark:bg-slate-900/50 p-3 rounded-lg border">
                    <strong>Real-World Case Example in North Cikarang:</strong> Siti and an Islamic financial institution decide to co-own a commercial shophouse in North Cikarang for retail business. Siti contributes IDR 100,000,000 (representing a 40% equity share), while the Islamic bank provides IDR 150,000,000 (representing a 60% equity share). Total capital equals IDR 250,000,000. Rental income and operational profits are divided according to agreed operational terms, while any future property value depreciation or losses are apportioned strictly on their 40% to 60% capital contribution shares.
                  </p>
                </div>

                {/* Murabahah Detail Card */}
                <div className="p-5 rounded-xl border bg-white dark:bg-slate-800 shadow-sm space-y-3 border-l-4 border-l-teal-600">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700">Murabahah Contract</span>
                    <span className="text-xs opacity-70 font-semibold">Cost-Plus Financing</span>
                  </div>
                  <h4 className="font-bold text-base text-teal-900 dark:text-teal-300">3. Murabahah (Cost-Plus Financing)</h4>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    <strong>Conceptual Description:</strong> A transparent sale-and-purchase transaction where the customer specifies an item they need, and requests the Islamic bank to purchase it directly from a verified supplier. The bank takes legal ownership/title of the asset and then resells it to the customer at the original purchase cost plus an explicit, mutually agreed profit margin (mark-up). The customer reimburses the bank through fixed installments over an agreed tenure. The key characteristic is full transparency regarding the bank's acquisition cost and profit margin, with no compounding interest penalties for late payments.
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 bg-teal-50/50 dark:bg-slate-900/50 p-3 rounded-lg border">
                    <strong>Real-World Case Example in North Cikarang:</strong> Ani needs a motorcycle for her daily commuting needs in North Cikarang. Instead of taking a conventional interest-bearing loan, she approaches an Islamic bank for Murabahah financing. The bank purchases the motorcycle directly from the dealership for IDR 20,000,000 (cost price). The bank then sells the motorcycle to Ani for IDR 23,000,000 (incorporating a transparent, fixed profit margin of IDR 3,000,000). Ani agrees to pay this total amount in equal monthly installments over a period of two years. Throughout the contract tenure, the installment amount remains fixed and transparent, regardless of market rate fluctuations.
                  </p>
                </div>

              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <span>5. Conclusion and Recommendations</span>
              </h2>
              <p className="leading-relaxed">
                Public perception—driven by knowledge, trust, and service quality—significantly influences community interest in choosing Islamic banking products in North Cikarang District. Mean scores averaging above the 3.00 midpoint demonstrate solid community trust and moderate knowledge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border bg-blue-50/50">
                  <h5 className="font-bold text-blue-900 mb-1">For Islamic Banking</h5>
                  <p className="text-xs opacity-80">Focus socialization on competitive edges and transparent products to dispel public doubts.</p>
                </div>
                <div className="p-4 rounded-xl border bg-indigo-50/50">
                  <h5 className="font-bold text-indigo-900 mb-1">For Future Researchers</h5>
                  <p className="text-xs opacity-80">Expand scope to broader communities and incorporate additional variables.</p>
                </div>
                <div className="p-4 rounded-xl border bg-teal-50/50">
                  <h5 className="font-bold text-teal-900 mb-1">For the Community</h5>
                  <p className="text-xs opacity-80">Seek out more information regarding Islamic banking and increase Sharia product participation.</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 border-t pt-6">
              <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">6. References and Resources</h2>
              <ul className="text-xs opacity-80 space-y-1.5 list-disc pl-5">
                <li>Study Documentation and Institutional Research Guidelines (2026).</li>
                <li>Karim, Adiwarman. (2020). Bank Islam: Analisis Fiqih dan Keuangan. Jakarta: RajaGrafindo Persada.</li>
                <li>Riani, Fitria Sapta. (2019). Pengaruh Persepsi Masyarakat Tentang Perbankan Syariah Terhadap Minat Memilih Produk Bank Syariah. Undergraduate Thesis.</li>
                <li>Sugiyono. (2021). Metode Penelitian Kuantitatif, Kualitatif, dan R&D. Bandung: Alfabeta.</li>
                <li>Likert, Rensis. (1932). A Technique for the Measurement of Attitudes. Archives of Psychology.</li>
                <li>Siregar, Syofian. (2017). Statistika Parametrik untuk Penelitian Kuantitatif. Jakarta: Bumi Aksara.</li>
                <li>Antonio, Muhammad Syafi'i. (2021). Bank Syariah dari Teori ke Praktik. Jakarta: Gema Insani.</li>
              </ul>
            </section>

          </article>
        ) : (
          
          /* Presentation View */
          <div className={`w-full max-w-[1700px] mx-auto p-6 sm:p-8 lg:p-10 rounded-2xl border border-slate-200 bg-white text-slate-800 flex flex-col justify-between min-h-[calc(100vh-200px)] shadow-sm ${isPresentationFullscreen ? 'sm:p-10 lg:p-12' : ''}`}>
            <style jsx>{`
              @keyframes presentationEnter {
                0% {
                  opacity: 0;
                  transform: translateX(40px) scale(0.97);
                  filter: blur(5px);
                }
                35% {
                  opacity: 0.85;
                }
                100% {
                  opacity: 1;
                  transform: translateX(0) scale(1);
                  filter: blur(0);
                }
              }

              @keyframes presentationLeaveLeft {
                0% {
                  opacity: 1;
                  transform: translateX(0) scale(1);
                }
                100% {
                  opacity: 0;
                  transform: translateX(-42px) scale(0.97);
                }
              }

              @keyframes presentationLeaveRight {
                0% {
                  opacity: 1;
                  transform: translateX(0) scale(1);
                }
                100% {
                  opacity: 0;
                  transform: translateX(42px) scale(0.97);
                }
              }

              @keyframes titleReveal {
                0% {
                  opacity: 0;
                  transform: translateY(16px);
                  filter: blur(6px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                  filter: blur(0);
                }
              }

              @keyframes titleShine {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }

              .presentation-card {
                animation: presentationEnter 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                background: linear-gradient(135deg, rgba(255,255,255,0.62), rgba(191,219,254,0.18), rgba(255,255,255,0.52));
                border: 1px solid rgba(148, 163, 184, 0.25);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-radius: 1.75rem;
                padding: 2rem;
                box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.7);
              }

              .presentation-title {
                animation: titleReveal 0.5s ease-out;
                background: linear-gradient(90deg, #0f172a 0%, #2563eb 28%, #0f172a 52%, #2563eb 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                animation: titleReveal 0.5s ease-out, titleShine 2.2s ease-in-out 0.3s 1;
                letter-spacing: -0.03em;
              }

              .presentation-subtitle {
                animation: titleReveal 0.7s ease-out;
                color: rgba(15, 23, 42, 0.72);
              }

              .presentation-header {
                background: rgba(255,255,255,0.38);
                border: 1px solid rgba(148,163,184,0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 1rem;
                padding: 0.9rem 1rem;
              }

              .presentation-content-box {
                background: rgba(255,255,255,0.34);
                border: 1px solid rgba(148,163,184,0.18);
                border-radius: 1.15rem;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
              }

              .nav-glow {
                background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
                color: white;
                border: 1px solid rgba(59, 130, 246, 0.4);
                box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                font-weight: 700;
                letter-spacing: 0.01em;
              }

              .nav-glow:hover:not(:disabled) {
                box-shadow: 0 0 24px rgba(59, 130, 246, 0.35);
                transform: translateY(-1px);
              }

              .nav-glow:disabled {
                opacity: 0.45;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
              }

              @media (max-width: 640px) {
                .presentation-card {
                  padding: 1rem;
                  border-radius: 1.15rem;
                }

                .presentation-header {
                  padding: 0.7rem;
                }

                .presentation-title {
                  font-size: 1.35rem;
                  line-height: 1.25;
                }

                .presentation-content-box {
                  padding: 0.75rem;
                  border-radius: 0.9rem;
                }

                .presentation-content-box h2 {
                  font-size: 1.25rem;
                }

                .presentation-content-box .grid-cols-5 {
                  grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .presentation-content-box .grid-cols-5 > :last-child {
                  grid-column: 1 / -1;
                }

                .presentation-navigation {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 0.65rem;
                  padding-top: 1rem;
                  margin-top: 1rem;
                }

                .presentation-navigation .nav-glow {
                  justify-content: center;
                  min-width: 0;
                  padding: 0.65rem 0.55rem;
                  font-size: 0.75rem;
                }

                .presentation-navigation .slide-dots {
                  grid-column: 1 / -1;
                  grid-row: 1;
                  justify-content: center;
                  min-height: 1.25rem;
                }

                .presentation-navigation .previous-slide {
                  grid-column: 1;
                  grid-row: 2;
                }

                .presentation-navigation .next-slide {
                  grid-column: 2;
                  grid-row: 2;
                }
              }
            `}</style>

            <div key={currentSlide} className="space-y-6 presentation-card relative">
              <div className="presentation-header flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                    Slide {currentSlide + 1} of {slides.length}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {slides[currentSlide].category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="presentation-title text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {slides[currentSlide].title}
                </h2>
                <p className="presentation-subtitle text-sm sm:text-base">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              <div className="presentation-content-box pt-4 p-4 sm:p-5">
                {slides[currentSlide].content}
              </div>

              {currentSlide === slides.length - 1 && (
                <div className="absolute right-5 bottom-5">
                  <button
                    type="button"
                    onClick={stopEndingMusic}
                    aria-label="Stop song"
                    title="Stop song"
                    className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg transition-all flex items-center justify-center"
                  >
                    <span aria-hidden="true">■</span>
                  </button>
                </div>
              )}

            </div>

            {/* Slide Navigation Controls */}
            <div className="presentation-navigation pt-8 border-t flex items-center justify-between mt-8">
              <button
                onClick={() => {
                  const nextSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
                  const slideRoot = document.querySelector('[key="currentSlide"]');
                  if (slideRoot) {
                    slideRoot.style.animation = 'presentationLeaveLeft 0.35s ease-in forwards';
                    setTimeout(() => setCurrentSlide(nextSlide), 180);
                  } else {
                    setCurrentSlide(nextSlide);
                  }
                }}
                className="previous-slide nav-glow flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              <div className="slide-dots flex space-x-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === index ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={currentSlide >= slides.length - 1}
                onClick={() => {
                  if (currentSlide >= slides.length - 1) return;
                  const nextSlide = currentSlide + 1;
                  const slideRoot = document.querySelector('[key="currentSlide"]');
                  if (slideRoot) {
                    slideRoot.style.animation = 'presentationLeaveRight 0.35s ease-in forwards';
                    setTimeout(() => setCurrentSlide(nextSlide), 180);
                  } else {
                    setCurrentSlide(nextSlide);
                  }
                }}
                className="next-slide nav-glow flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </main>

      {/* Fullscreen Photo Modal / Lightbox */}
      {showFullscreenPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setShowFullscreenPhoto(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold backdrop-blur-md transition-all border border-white/20"
            >
              ✕ Close Fullscreen
            </button>
          </div>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img 
              src="/photo-profil.jpeg"
              alt="Ajovi_article Fullscreen View" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
          <p className="text-white/80 text-xs mt-4">Ajovi_article Studio • Fullscreen View</p>
        </div>
      )}

      {/* Footer */}
      <footer className={`border-t mt-12 py-8 ${t.header} text-center text-xs opacity-80`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Ajovi_article Studio • North Cikarang District, Bekasi Regency</p>
          <div className="flex items-center space-x-4">
            <a href="https://wa.me/6285606119969" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 font-semibold">
              WhatsApp: 085606119969
            </a>
            <span>•</span>
            <a href="mailto:ajiw6836@gmail.com" className="hover:underline text-blue-600 font-semibold">
              Email: ajiw6836@gmail.com
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

