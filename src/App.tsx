import { useState, useEffect, useRef } from 'react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import { ArrowRight, X, Check, ChevronLeft, ChevronRight, Plus, Minus, Phone, MapPin, Globe, Megaphone, Sparkles, BarChart3 } from 'lucide-react';

// 3D Carousel Steps config
const zoomSteps = [
  { pw: 150, g1: 160, g2: 280, gh: 400, sh: 380 },
  { pw: 180, g1: 200, g2: 350, gh: 500, sh: 440 },
  { pw: 220, g1: 240, g2: 420, gh: 600, sh: 500 },
  { pw: 260, g1: 280, g2: 490, gh: 700, sh: 560 },
  { pw: 300, g1: 320, g2: 560, gh: 800, sh: 620 }
];

const posConfig = {
  center: { txMult: 0, rotY: 0, scale: 1, opacity: 1, gapKey: '' as const },
  left1: { txMult: -1, rotY: 28, scale: 0.82, opacity: 0.95, gapKey: 'g1' as const },
  right1: { txMult: 1, rotY: -28, scale: 0.82, opacity: 0.95, gapKey: 'g1' as const },
  left2: { txMult: -1, rotY: 45, scale: 0.64, opacity: 0.50, gapKey: 'g2' as const },
  right2: { txMult: 1, rotY: -45, scale: 0.64, opacity: 0.50, gapKey: 'g2' as const }
};

const brandLogos = [
  "https://m.media-amazon.com/images/G/31/smartcommerce/v2/tran-logo-1.png",
  "https://m.media-amazon.com/images/G/31/smartcommerce/v2/tran-logo-5.png",
  "https://m.media-amazon.com/images/G/31/smartcommerce/v2/tran-logo-4.png",
  "https://m.media-amazon.com/images/G/31/smartcommerce/website/newish2.png",
  "https://m.media-amazon.com/images/G/31/smartcommerce/v2/tran-logo-2.png",
  "https://m.media-amazon.com/images/G/31/smartcommerce/website/Klipsh_v2.png",
  "https://m.media-amazon.com/images/G/31/smartcommerce/v2/arayna_bg.png"
];

function App() {
  // Preloader state variables
  const [loading, setLoading] = useState(true);
  const [preloaderText, setPreloaderText] = useState("Shopify");
  const [bracketsOut, setBracketsOut] = useState(false);
  const [preloaderFade, setPreloaderFade] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Typing animation states
  const [typedText, setTypedText] = useState('');
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // 3D Carousel state variables
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(2);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const autoPlayRef = useRef<(() => void) | null>(null);

  // Sticky scroll section state variable
  const [activeStickyCard, setActiveStickyCard] = useState(0);

  // Form state variables
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Preloader Animation Cycle
  useEffect(() => {
    if (!loading) return;
    const words = ["Shopify", "Scale", "Succeed"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
      setPreloaderText(words[currentIndex]);
    }, 900);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setPreloaderText("Shopno eCommerce");
      setBracketsOut(true);

      const fadeTimer = setTimeout(() => {
        setPreloaderFade(true);

        const closeTimer = setTimeout(() => {
          setLoading(false);
          document.body.style.overflow = '';

          // Auto trigger contact modal after 1.5 seconds
          setTimeout(() => {
            setShowModal(true);
          }, 1500);
        }, 600);

        return () => clearTimeout(closeTimer);
      }, 1300);

      return () => clearTimeout(fadeTimer);
    }, 3200);

    document.body.style.overflow = 'hidden';

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loading]);



  // Sticky Scroll highlights tracker
  useEffect(() => {
    const handleScroll = () => {
      const cardElements = document.querySelectorAll('.sticky-scroll-card');
      if (cardElements.length === 0) return;

      let closestIndex = 0;
      let minDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      cardElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveStickyCard(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing Animation logic
  useEffect(() => {
    if (loading) return;

    const words = ["Your D2C Brand", "Your Shopify Store", "Your Sales Revenue", "Your Category"];
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      if (!isDeleting) {
        setTypedText(fullText.substring(0, typedText.length + 1));
        setTypingSpeed(100);

        if (typedText === fullText) {
          setIsDeleting(true);
          setTypingSpeed(2000); // Hold for 2 seconds
        }
      } else {
        setTypedText(fullText.substring(0, typedText.length - 1));
        setTypingSpeed(50);

        if (typedText === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setTypingSpeed(500); // Brief pause before typing next word
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed, loading]);

  // Scroll Reveal Observer hook
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
      });

      document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, [loading]);

  // 3D Carousel Autoplay management
  const handleCarouselNext = () => {
    setActiveCarouselIndex(prev => (prev + 1) % 5);
  };

  const handleCarouselPrev = () => {
    setActiveCarouselIndex(prev => (prev - 1 + 5) % 5);
  };

  useEffect(() => {
    autoPlayRef.current = handleCarouselNext;
  });

  useEffect(() => {
    if (isCarouselHovered) return;
    const play = () => {
      if (autoPlayRef.current) autoPlayRef.current();
    };
    const interval = setInterval(play, 4000);
    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  // Modal open/close scroll locking
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else if (!loading) {
      document.body.style.overflow = '';
    }
  }, [showModal, loading]);

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formEmail.trim() || !formPhone.trim() || !formCompany.trim() || !formCity.trim()) {
      setFormStatus("Please fill in all required fields.");
      setFormSuccess(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setFormStatus("Please enter a valid email address.");
      setFormSuccess(false);
      return;
    }

    const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
    if (!phoneRegex.test(formPhone)) {
      setFormStatus("Please enter a valid contact number.");
      setFormSuccess(false);
      return;
    }

    setSubmitting(true);
    setFormStatus("Redirecting to WhatsApp...");
    setFormSuccess(true);

    const waMessage = `*New Inquiry from Shopno Landing Page*\n\n` +
                      `• *Name*: ${formName.trim()}\n` +
                      `• *Email*: ${formEmail.trim()}\n` +
                      `• *Mobile*: ${formPhone.trim()}\n` +
                      `• *Company*: ${formCompany.trim()}\n` +
                      `• *City*: ${formCity.trim()}\n` +
                      `• *Message*: ${formMessage.trim() || 'No message provided.'}`;

    const targetPhone = "917016268071";
    const encodedText = encodeURIComponent(waMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      setFormStatus("Message initiated on WhatsApp! Thank you.");

      // Reset fields
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormCompany("");
      setFormCity("");
      setFormMessage("");
      setSubmitting(false);

      setTimeout(() => {
        setShowModal(false);
        setFormStatus("");
      }, 2000);
    }, 1200);
  };

  // 3D Carousel Card Render Logic
  const getCarouselOffset = (cardIndex: number) => {
    let offset = cardIndex - activeCarouselIndex;
    while (offset > 2) offset -= 5;
    while (offset < -2) offset += 5;
    return offset;
  };

  const renderPhoneCards = () => {
    const s = zoomSteps[zoomLevel];

    return [0, 1, 2, 3, 4].map(idx => {
      const offset = getCarouselOffset(idx);
      let pos: keyof typeof posConfig = 'center';

      if (offset === -1) pos = 'left1';
      else if (offset === 1) pos = 'right1';
      else if (offset === -2) pos = 'left2';
      else if (offset === 2) pos = 'right2';

      const cfg = posConfig[pos];
      const gapVal = cfg.gapKey ? s[cfg.gapKey] : 0;
      const tx = cfg.txMult * gapVal;

      const isCenter = pos === 'center';

      return (
        <div
          key={idx}
          onClick={() => {
            if (!isCenter) {
              setActiveCarouselIndex(idx);
            }
          }}
          className="absolute left-1/2 top-1/2 transition-all duration-700 ease-out cursor-pointer select-none"
          style={{
            width: `${s.pw}px`,
            transform: `translateX(calc(-50% + ${tx}px)) translateY(-50%) rotateY(${cfg.rotY}deg) scale(${cfg.scale})`,
            opacity: cfg.opacity,
            zIndex: isCenter ? 30 : idx === 1 || idx === 3 ? 20 : 10,
          }}
        >
          <div
            className={`relative rounded-[32px] overflow-hidden bg-black border-4 transition-all duration-700 ${
              isCenter
                ? 'border-yellow-400/40 shadow-[0_0_0_1px_rgba(255,196,0,0.4),0_30px_70px_rgba(0,0,0,0.4),0_0_40px_rgba(255,196,0,0.15)]'
                : 'border-gray-800 shadow-lg'
            }`}
            style={{ width: `${s.pw}px` }}
          >
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-8 h-1 bg-gray-800 rounded-full" />
            </div>

            {/* Screen */}
            <div className="aspect-[9/19.5] w-full overflow-hidden bg-gray-900 pt-6">
              <img
                src={`/images/tm-622-screen-0${idx + 1}.jpg`}
                alt={`Shopify Screen ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-[#ffc400] selection:text-gray-950 relative">
      
      {/* ── PRELOADER OVERLAY ── */}
      {loading && (
        <div 
          className={`fixed inset-0 w-full h-full bg-[#141414] z-[9999] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            preloaderFade ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex items-center justify-center gap-4 text-white font-bold text-xl sm:text-3xl font-heading">
            <span 
              className="text-[#ffc400] text-4xl sm:text-5xl font-light transition-transform duration-700"
              style={{ transform: bracketsOut ? 'translateX(-30px)' : 'translateX(0)' }}
            >
              [
            </span>
            <span className="min-w-[140px] sm:min-w-[200px] text-center tracking-tight transition-all duration-300">
              {preloaderText}
            </span>
            <span 
              className="text-[#ffc400] text-4xl sm:text-5xl font-light transition-transform duration-700"
              style={{ transform: bracketsOut ? 'translateX(30px)' : 'translateX(0)' }}
            >
              ]
            </span>
          </div>
        </div>
      )}

      {/* ── SECTION 1: HERO (Full viewport height) ── */}
      <section className="relative z-50 w-full min-h-screen flex flex-col justify-between bg-[#141414] border-b border-white/10">
        
        {/* WebGL Animated Shader Background */}
        <div className="absolute inset-0 z-10 pointer-events-none w-full h-full overflow-hidden">
          <Shader className="w-full h-full">
            <Swirl colorA="#141414" colorB="#1c1d1f" detail={1.7} />
            <ChromaFlow 
              baseColor="#141414" 
              downColor="#ffc400" 
              leftColor="#ffc400" 
              rightColor="#ffc400" 
              upColor="#ffc400" 
              momentum={13} 
              radius={3.5} 
            />
            <FlutedGlass 
              aberration={0.61} 
              angle={31} 
              frequency={8} 
              highlight={0.12} 
              highlightSoftness={0} 
              lightAngle={-90} 
              refraction={4} 
              shape="rounded" 
              softness={1} 
              speed={0.15} 
            />
            <FilmGrain strength={0.05} />
          </Shader>
        </div>

        {/* Sleek Minimalist Header Logo + Single Contact Button */}
        <header className="w-full z-20 relative p-4 sm:p-6 max-w-[1440px] mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center hover:opacity-85 transition-opacity">
            <img 
              src="https://shopnoecommerce.com/assets/website/images/logo/new_shopno_logo.png" 
              alt="Shopno eCommerce" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </a>
          <button 
            onClick={() => setShowModal(true)}
            className="text-[16px] sm:text-[18px] font-semibold text-white hover:text-[#ffc400] transition-colors focus:outline-none"
          >
            Contact Us
          </button>
        </header>

        {/* Hero Content */}
        <div className="flex-1" />
        <div className="w-full z-20 relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          
          {/* Left Hero Side: Shopify dashboard workspace */}
          <div className="lg:col-span-5 flex justify-center scroll-reveal">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1c1d1f]/40 backdrop-blur shadow-[0_30px_70px_rgba(0,0,0,0.5),0_0_50px_rgba(255,196,0,0.15)] max-w-md lg:max-w-full transition-transform duration-500 hover:-translate-y-1.5">
              <img 
                src="/images/shopify_hero_dashboard.png" 
                alt="Shopify Dashboard Campaign storefront workspace" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Hero Side: Copy + CTA button */}
          <div className="lg:col-span-7 flex flex-col items-start text-left lg:pl-6 scroll-reveal reveal-delay-1">
            <span className="text-[13px] sm:text-[14px] text-[#ffc400] font-bold tracking-widest uppercase mb-4">
              Shopno eCommerce
            </span>
            <h1 className="text-white font-semibold leading-[1.08] tracking-[-0.03em] text-[2.2rem] sm:text-[3.5rem] xl:text-[4.6rem] max-w-[850px] mb-8 font-heading">
              Launch, Scale & Grow <br className="hidden sm:block" />
              <span className="text-[#ffc400] border-r-2 border-[#ffc400] pr-1.5 font-bold min-h-[1.1em] inline-block animate-pulse">
                {typedText || "..."}
              </span>
              <br className="hidden sm:block" />
              On Shopify
            </h1>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setShowModal(true)}
                className="group relative flex items-center justify-between sm:justify-start bg-[#ffc400] hover:bg-[#e0ad00] text-gray-950 rounded-full pl-6 pr-1.5 py-1.5 transition-colors duration-300 shadow-lg font-bold"
              >
                <div className="overflow-hidden h-[20px] relative text-[13px] sm:text-[14px] font-bold leading-[20px] mr-4">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                    <span>Get Free Shopify Audit</span>
                    <span>Get Free Shopify Audit</span>
                  </div>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-gray-950 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 rotate-0">
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* Transition arrow from Hero to Solutions */}
        <img 
          src="/images/ticketbud/line-arrow-3.png" 
          className="arrow-connector-animated"
          style={{ bottom: '-45px', right: '15%', width: '180px' }} 
          alt="Hero to Solutions connector" 
        />
      </section>

      {/* ── SECTION 2: SOLUTIONS (Dark Cement Background) ── */}
      <section id="solutions" className="relative z-40 bg-[#1c1d1f] py-20 sm:py-28 w-full border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Solutions Banner Image */}
          <div className="lg:col-span-6 flex justify-center scroll-reveal">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-transform duration-500 max-w-xl lg:max-w-full">
              <img 
                src="/images/shopify_solutions_banner.png" 
                alt="Shopify Campaign Modern D2C Store Flatlay" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Column: Copy Info */}
          <div className="lg:col-span-6 flex flex-col items-start scroll-reveal reveal-delay-1">
            <div className="bg-[#ffc400]/10 border border-[#ffc400]/30 text-[#ffc400] rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-6">
              Conversion-Driven Architecture
            </div>
            <h2 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-6 font-heading">
              Custom-Engineered Shopify Solutions
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 font-body">
              Every line of code is structured to maximize campaign performance. We design seamless checkout loops, high-speed themes, and custom apps that turn marketing traffic into recurring business revenue.
            </p>
            <ul className="space-y-4 w-full">
              {[
                { title: "Accelerated Purchase Loops", desc: "Setup lightning-fast UPI, credit card, and custom payment splits." },
                { title: "Automated Campaign Flows", desc: "Integrated post-purchase email & WhatsApp flows to reduce cart drop-offs." },
                { title: "Surat's Premier Theme Experts", desc: "Personalized storefront styling mapped to your exact catalog parameters." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#ffc400]/10 flex items-center justify-center text-[#ffc400] mt-1">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base font-heading">{item.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm font-body">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Transition arrow from Solutions to Benefit Intro */}
        <img 
          src="/images/ticketbud/line-arrow-8.png" 
          className="arrow-connector-animated"
          style={{ bottom: '-55px', left: '12%', width: '160px', transform: 'scaleX(-1)' }} 
          alt="Solutions to Benefit Intro connector" 
        />
      </section>

      {/* ── SECTION 3: BENEFIT INTRO GRID ── */}
      <section id="intro" className="relative z-30 bg-[#141414] py-20 w-full border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <div className="scroll-reveal">
            <h2 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight max-w-[900px] mx-auto mb-4 font-heading">
              Empowering D2C Brands with Next-Gen Shopify Engineering
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-[700px] mx-auto mb-16 font-body">
              Shopno eCommerce combines expert development with growth marketing to scale your online revenues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { stat: "95+ Speed Score", title: "Latency Elimination", desc: "Optimized themes and codebases to eliminate page latency and bounce rates." },
              { stat: "Custom Apps & Sync", title: "Logistics Integration", desc: "Custom Shopify app development, automated ERP feeds, and local logistics integrations." },
              { stat: "Full-Funnel CRO", title: "Checkout Workflows", desc: "High-conversion express checkout workflows and analytics tracking loops." }
            ].map((card, i) => (
              <div 
                key={i} 
                className={`bg-[#1c1d1f] border border-white/10 rounded-2xl p-8 flex flex-col items-start text-left shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:border-[#ffc400]/30 transition-all duration-300 scroll-reveal ${
                  i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''
                }`}
              >
                <span className="text-[#ffc400] text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                  {card.stat}
                </span>
                <h3 className="text-white font-semibold text-lg mb-2 font-heading">{card.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-body">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Transition arrow from Benefit Intro to Sticky Scale */}
        <img 
          src="/images/ticketbud/line-arrow-9.png" 
          className="arrow-connector-animated"
          style={{ bottom: '-55px', right: '12%', width: '160px' }} 
          alt="Benefit Intro to Sticky Scale connector" 
        />
      </section>

      {/* ── SECTION 4: STICKY SCALE SECTION ── */}
      <section id="sticky-scale" className="relative z-20 bg-[#1c1d1f] py-20 sm:py-28 w-full border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Sticky Sidebar Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit scroll-reveal">
            <div className="bg-[#141414] text-white rounded-2xl p-8 sm:p-10 border border-[#ffc400]/20 shadow-2xl relative overflow-hidden">
              {/* Highlight Background Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ffc400]/5 rounded-full blur-[80px]" />
              
              <div className="bg-[#ffc400]/10 border border-[#ffc400]/30 text-[#ffc400] rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-6 w-fit font-heading">
                Shopify D2C Growth
              </div>
              <h2 className="text-white font-semibold text-3xl sm:text-4xl leading-tight tracking-tight mb-6 font-heading">
                Scale Your Shopify Sales Efficiently
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-body">
                Maximize your campaign ROI and optimize conversions. We design high-performing Shopify stores that turn digital marketing clicks into loyal customers, powered by custom-tailored layouts and marketing automation.
              </p>
            </div>
          </div>

          {/* Right Scrolling Content Column (Premium Transparent Scrolling Cards) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {[
              {
                img: "/images/campaign_built_in_tools.png",
                title: "All-in-One Shopify Setup",
                desc: "Your product catalogs, responsive custom layouts, analytics triggers, and SEO foundations set up natively, designed to launch your business instantly."
              },
              {
                img: "/images/campaign_checkout_trust.png",
                title: "Frictionless Buying Flow",
                desc: "Shopify's world-class checkout flow reduces cart abandonment and checkout friction, allowing customers to buy in seconds."
              },
              {
                img: "/images/campaign_page_builder.png",
                title: "Custom-Crafted Themes",
                desc: "Stunning drag-and-drop custom themes structured by Shopno eCommerce experts to reflect your unique brand identity and catalog structure."
              }
            ].map((card, i) => (
              <div 
                key={i} 
                className={`sticky-scroll-card transition-all duration-500 ease-in-out ${
                  activeStickyCard === i 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-30 translate-y-4'
                }`}
                style={{ marginBottom: i === 2 ? '0' : '8rem' }}
              >
                <div className="w-full h-[300px] flex items-center justify-start mb-8 overflow-hidden bg-transparent">
                  <img 
                    src={card.img} 
                    alt={card.title} 
                    className="h-full w-auto object-contain transition-transform duration-700 ease-out hover:scale-[1.02]" 
                  />
                </div>
                <h3 className="text-white font-bold text-2xl mb-4 font-heading">{card.title}</h3>
                <p className="text-white/70 text-base leading-relaxed font-body">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 5: BRAND LOGOS MARQUEE ── */}
      <section className="relative z-15 w-full overflow-hidden bg-[#141414] py-16 border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto text-center mb-8 scroll-reveal">
          <h4 className="text-[12px] sm:text-[13px] uppercase tracking-[0.15em] text-gray-400 font-bold px-4">
            Trusted by Growing D2C Brands Across India
          </h4>
        </div>
        <div className="relative w-full overflow-hidden flex scroll-reveal reveal-delay-1">
          <div className="animate-marquee flex gap-12 sm:gap-20 items-center whitespace-nowrap">
            {brandLogos.map((src, i) => (
              <img 
                key={`l1-${i}`} 
                src={src} 
                alt="Brand Logo" 
                className="h-8 sm:h-11 object-contain marquee-logo" 
              />
            ))}
            {brandLogos.map((src, i) => (
              <img 
                key={`l2-${i}`} 
                src={src} 
                alt="Brand Logo" 
                className="h-8 sm:h-11 object-contain marquee-logo" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: 3D MOBILE APP CAROUSEL ── */}
      <section id="screens" className="relative z-10 bg-[#1c1d1f] py-20 sm:py-24 border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center mb-10 scroll-reveal">
          <div className="bg-[#ffc400]/10 border border-[#ffc400]/30 text-[#ffc400] rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4 w-fit mx-auto font-heading">
            Shopify Mobile Interface
          </div>
          <h2 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-4 font-heading">
            Your Shopify dashboard, <span className="text-[#ffc400]">in your pocket</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-[600px] mx-auto font-body">
            Monitor visitor traffic, analyze conversion rates, process live orders, and coordinate shipping logs in real-time with the Shopify mobile app.
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-3 mb-8 relative z-20 scroll-reveal reveal-delay-1">
          <button 
            disabled={zoomLevel === 0}
            onClick={() => setZoomLevel(prev => Math.max(0, prev - 1))}
            className="w-9 h-9 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-white font-bold transition-all hover:bg-white hover:text-gray-950 disabled:opacity-30"
          >
            <Minus size={14} />
          </button>
          
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map(idx => (
              <button 
                key={idx}
                onClick={() => setZoomLevel(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  zoomLevel === idx ? 'bg-[#ffc400] scale-125' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button 
            disabled={zoomLevel === 4}
            onClick={() => setZoomLevel(prev => Math.min(4, prev + 1))}
            className="w-9 h-9 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-white font-bold transition-all hover:bg-white hover:text-gray-950 disabled:opacity-30"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* 3D Stage Container */}
        <div 
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
          className="relative w-full flex items-center justify-center mx-auto transition-all duration-500 overflow-hidden scroll-reveal reveal-delay-2"
          style={{ 
            height: `${zoomSteps[zoomLevel].sh}px`,
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {renderPhoneCards()}
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center justify-center gap-6 mt-8 relative z-20 scroll-reveal reveal-delay-3">
          <button 
            onClick={handleCarouselPrev}
            className="w-12 h-12 rounded-full border border-white/10 bg-[#141414] hover:bg-white hover:text-gray-950 flex items-center justify-center transition-all duration-300 shadow-lg text-white"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2.5 items-center">
            {[0, 1, 2, 3, 4].map(idx => (
              <button 
                key={idx}
                onClick={() => setActiveCarouselIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeCarouselIndex === idx ? 'bg-[#ffc400] w-7' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={handleCarouselNext}
            className="w-12 h-12 rounded-full border border-white/10 bg-[#141414] hover:bg-white hover:text-gray-950 flex items-center justify-center transition-all duration-300 shadow-lg text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-12" />
        {/* Transition arrow from Carousel to Growth Services */}
        <img 
          src="/images/ticketbud/line-arrow-15.png" 
          className="arrow-connector-animated"
          style={{ bottom: '-35px', left: '15%', width: '150px' }} 
          alt="Carousel to Growth Services connector" 
        />
      </section>

      {/* ── SECTION 7: SHOPIFY GROWTH SERVICES GRID ── */}
      <section id="features" className="relative z-9 bg-[#141414] py-20 sm:py-28 w-full border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center mb-16 scroll-reveal">
          <h2 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-4 font-heading">
            One Agency. All the Shopify Growth Services You Need.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-[800px] mx-auto font-body">
            Streamline your retail operations without sacrificing capability. Shopno eCommerce integrates all the vital features to run and scale your Shopify store.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          {/* Card 1: Payments */}
          <div className="lg:col-span-5 border border-white/10 bg-[#1c1d1f] rounded-2xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl hover:border-[#ffc400]/40 transition-all duration-300 group scroll-reveal">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 font-heading">Multiple Payment Options</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-body">
                Seamless integration of India's favorite payment gateways—UPI, credit/debit cards, Net Banking, and wallet links—directly into your Shopify checkout.
              </p>
            </div>
            <div className="flex justify-center pt-4 transform group-hover:scale-105 transition-transform duration-500">
              <img src="https://m.media-amazon.com/images/G/31/smartcommerce/v2/payments_v2.png" alt="Multiple payment options" className="max-h-[160px] sm:max-h-[200px] object-contain" />
            </div>
          </div>

          {/* Card 2: Checkout (With premium blurred glass overlay body) */}
          <div 
            className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[440px] bg-cover bg-center border border-white/10 shadow-2xl transition-all duration-300 flex flex-col justify-end p-4 sm:p-6 group scroll-reveal reveal-delay-1"
            style={{ backgroundImage: `url('https://m.media-amazon.com/images/G/31/smartcommerce/v2/built-in_checkout_v2._SL1280_FMpng_.png')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="relative z-20 w-full flex justify-start">
              <div className="bg-[#141517]/90 p-6 sm:p-8 rounded-xl border border-white/10 backdrop-blur-md max-w-[380px] text-left w-full shadow-2xl transition-transform duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white font-heading">Accelerated Shopify Checkout</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-body">
                  High-conversion express checkout configurations optimized for mobile screens, keeping buying friction at an absolute minimum.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Shipping (With premium blurred glass overlay body) */}
          <div 
            className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[440px] bg-cover bg-center border border-white/10 shadow-2xl transition-all duration-300 flex flex-col justify-end p-4 sm:p-6 group scroll-reveal"
            style={{ backgroundImage: `url('https://m.media-amazon.com/images/G/31/smartcommerce/v2/integrated-section-3._SL1280_FMpng_.png')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="relative z-20 w-full flex justify-start">
              <div className="bg-[#141517]/90 p-6 sm:p-8 rounded-xl border border-white/10 backdrop-blur-md max-w-[380px] text-left w-full shadow-2xl transition-transform duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white font-heading">Integrated Shipping & Logistics</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-body">
                  Connect your store with top local and international shipping aggregators (Shiprocket, Delhivery) for automated labels and lower shipping rates.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Inventory */}
          <div className="lg:col-span-5 border border-white/10 bg-[#1c1d1f] rounded-2xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl hover:border-[#ffc400]/40 transition-all duration-300 group scroll-reveal reveal-delay-1">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 font-heading">Order & Inventory Management</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-body">
                Synchronize stock levels, track bulk orders, and manage customer returns seamlessly with Shopify's robust native backend administrative dashboard.
              </p>
            </div>
            <div className="flex justify-center pt-4 transform group-hover:scale-105 transition-transform duration-500">
              <img src="https://m.media-amazon.com/images/G/31/smartcommerce/v2/integrated-section-4.png" alt="Inventory Management" className="max-h-[160px] sm:max-h-[200px] object-contain" />
            </div>
          </div>
        </div>
        {/* Transition arrow from Growth Services to Powerful Features */}
        <img 
          src="/images/ticketbud/line-arrow-9.png" 
          className="arrow-connector-animated"
          style={{ bottom: '-40px', right: '20%', width: '160px', transform: 'rotate(45deg)' }} 
          alt="Growth Services to Powerful Features connector" 
        />
      </section>

      {/* ── SECTION 7.5: POWERFUL FEATURES (Dark Theme / Gold Accents) ── */}
      <section className="relative z-8 features-dark-bg py-20 w-full border-t border-b border-white/5">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative">
          
          <div className="relative bg-[#1c1d1f]/60 backdrop-blur-md border border-[#ffc400]/25 shadow-2xl rounded-[24px] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Top-Left Dotted Arrow and Included label */}
            <div className="included-badge-container">
              <span className="handwritten-font block text-[#ffc400]">Included</span>
              <img 
                src="/images/ticketbud/line-arrow-3.png" 
                className="w-16 h-auto opacity-95 -mt-2 ml-4 transform rotate-[10deg] gold-filter" 
                alt="Included arrow" 
              />
            </div>

            {/* Left side text */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <h2 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-6">
                Powerful{' '}
                <span className="header-scribble-container text-[#ffc400]">
                  Features
                  <svg className="header-scribble-svg" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,8 Q50,2 100,8" stroke="#ffc400" strokeWidth="2.5" fill="none" />
                  </svg>
                </span>
              </h2>
              
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 font-sans">
                Shopno eCommerce offers an extensive list of custom-designed tools to make your Shopify store launch easier and your marketing campaigns successful.
              </p>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-sans">
                All our premium features, theme upgrades, checkout loops, and marketing automations are included in our campaign plans for everyone to use.
              </p>

              <button 
                onClick={() => setShowModal(true)}
                className="group inline-flex items-center gap-2 font-heading font-extrabold text-[#ffc400] hover:text-[#e0ad00] transition-colors text-base"
              >
                More Features <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Right side 2x3 grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Custom Store Page Builder", desc: "Build tailored landing pages and marketing funnels in minutes." },
                { title: "Custom Registration Forms & Checkout", desc: "Collect customer data, customized checkout parameters, and order notes." },
                { title: "Promotional Discount & Access Codes", desc: "Deploy high-conversion discount triggers, referral codes, and VIP tier passes." },
                { title: "Timed Entry & Booking Calendars", desc: "Set up timed reservation loops, service booking pages, and availability grids." },
                { title: "Send Invites & WhatsApp Loops", desc: "Re-engage abandoned checkouts and coordinate automated post-purchase updates." },
                { title: "Add-on Products & Upsell Offers", desc: "Maximize purchase value with dynamic cross-sell bundles at checkout." }
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#141414]/80 border border-white/5 rounded-[16px] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-[#ffc400]/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#ffc400] flex items-center justify-center text-gray-950 mb-4 group-hover:scale-110 transition-transform">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base mb-2 font-heading">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm font-sans leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
        {/* Transition arrow from Powerful Features to Testimonials */}
        <img 
          src="/images/ticketbud/line-arrow-8.png" 
          className="arrow-connector-animated"
          style={{ bottom: '-55px', left: '20%', width: '160px' }} 
          alt="Powerful Features to Testimonials connector" 
        />
      </section>

      {/* ── SECTION 8: TESTIMONIALS (Truke & Stratum Masonry) ── */}
      <section id="testimonials" className="relative z-7 bg-[#1c1d1f] py-20 sm:py-28 w-full border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-16 scroll-reveal">
            <div className="bg-[#ffc400]/10 border border-[#ffc400]/30 text-[#ffc400] rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4 w-fit mx-auto font-heading">
              Client Feedback
            </div>
            <h2 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-4 font-heading">
              What Our Customers Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Testimonial Column */}
            <div className="flex flex-col gap-8">
              {/* Quote 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden scroll-reveal hover:translate-y-[-4px] transition-transform duration-300">
                <div className="w-1.5 h-12 bg-[#ffc400] absolute top-10 left-0" />
                <p className="text-white italic text-base sm:text-lg leading-relaxed mb-6 font-body">
                  “Shopno eCommerce has been more than just a developer; they are a strategic partner in our growth journey. Their comprehensive Shopify theme optimization has empowered us to scale our audio brand effortlessly.”
                </p>
                <div className="font-bold text-white text-sm sm:text-base font-heading">
                  Pankaj
                </div>
                <div className="text-xs sm:text-sm text-[#a1a1a6]">
                  Founder · Truke.in
                </div>
              </div>

              {/* Workspace image */}
              <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:scale-[1.01] transition-transform duration-500 scroll-reveal reveal-delay-1">
                <img 
                  src="/images/testimonial_workspace.png" 
                  alt="D2C Online Store Merchant packing Shopify packages" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>

            {/* Right Testimonial Column */}
            <div className="flex flex-col gap-8">
              {/* Sculpture image */}
              <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:scale-[1.01] transition-transform duration-500 scroll-reveal">
                <img 
                  src="/images/testimonial_sculpture.png" 
                  alt="Shopify Store Shipping Logistics tracking tablet" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>

              {/* Quote 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden scroll-reveal hover:translate-y-[-4px] transition-transform duration-300 reveal-delay-1">
                <div className="w-1.5 h-12 bg-[#ffc400] absolute top-10 left-0" />
                <p className="text-white italic text-base sm:text-lg leading-relaxed mb-6 font-body">
                  “Their custom Shopify designs and marketing automations transformed our store's checkout speed and conversion rates. We consolidated our plugin stacks and saw an immediate sales boost.”
                </p>
                <div className="font-bold text-white text-sm sm:text-base font-heading">
                  Jane Doe
                </div>
                <div className="text-xs sm:text-sm text-[#a1a1a6]">
                  Head of Operations · Stratum D2C
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* Transition arrow from Testimonials to Campaign Journey */}
        <img 
          src="/images/ticketbud/line-arrow-3.png" 
          className="arrow-connector-animated"
          style={{ bottom: '-45px', left: '15%', width: '180px', transform: 'scaleX(-1)' }} 
          alt="Testimonials to Campaign Journey connector" 
        />
      </section>

      {/* ── SECTION 9: HOW IT WORKS (3D Flipping Cards with Connected Arrows) ── */}
      <section id="journey" className="relative z-6 page-section hiw-section-wrapper bg-[#141414] border-b border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative">
          <span className="section-badge text-[#ffc400]">Our Process</span>
          
          <h2 className="section-title text-white" style={{ marginBottom: '16px' }}>
            <span className="header-scribble-container text-white">
              How It Works
              <svg className="header-scribble-svg" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,8 Q50,2 100,8" stroke="#ffc400" strokeWidth="2.5" fill="none" />
              </svg>
            </span>
          </h2>
          
          <p className="section-subtitle text-gray-400" style={{ maxWidth: '640px', margin: '0 auto 12px auto' }}>
            From plan selection to campaign scaling, here is how we work with you to build and grow your D2C brand.
          </p>
          <p className="text-gray-300 font-semibold mb-8">
            Your journey to Shopify scale, step-by-step:
          </p>

          <div className="hiw-step-row-container">
            <div className="hiw-columns-grid-4">
              {/* Step 1 */}
              <div className="hiw-step-item">
                <div className="hiw-icon-container">
                  <Globe size={20} />
                </div>
                {/* Dotted Arrow 8 leading to Step 2 */}
                <img src="/images/ticketbud/line-arrow-8.png" className="arrow-connector-animated" style={{ top: '-20px', left: '60%', width: '85%', zIndex: 1 , rotate: '-10deg' }} alt="" />
                
                {/* 3D Flip Card */}
                <div className="flip-card">
                  <div className="flip-card-inner">
                    {/* Front Face: Image */}
                    <div className="flip-card-front relative select-none">
                      <img src="/images/journey_audit_strategy.png" alt="Plan & Audit" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />
                      <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                        <span className="text-[#ffc400] text-[10px] font-extrabold tracking-wider uppercase">PHASE 01</span>
                        <h4 className="text-white font-bold text-sm sm:text-base font-heading">Plan & Audit</h4>
                      </div>
                    </div>
                    {/* Back Face: Ticket Stub Content */}
                    <div className="flip-card-back">
                      <div className="shopno-ticket-stub">
                        <span className="text-[#ffc400] text-xs font-extrabold font-heading mb-1 tracking-wider">PHASE 01</span>
                        <h4 className="text-white font-extrabold text-sm sm:text-base text-center font-heading">
                          Plan & Audit
                        </h4>
                        <div className="ticket-dashed-divider"></div>
                        <ul className="text-[11px] text-gray-400 space-y-1.5 text-left list-disc list-inside font-sans w-full">
                          <li>Select Growth Plan</li>
                          <li>In-Depth Store Audit</li>
                          <li>Wireframe Blueprints</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="hiw-step-item">
                <div className="hiw-icon-container">
                  <Sparkles size={20} />
                </div>
                {/* Dotted Arrow 9 leading to Step 3 */}
                <img src="/images/ticketbud/line-arrow-9.png" className="arrow-connector-animated" style={{ top: '35px', left: '60%', width: '85%', zIndex: 1 , rotate: '5deg' }} alt="" />
                
                {/* 3D Flip Card */}
                <div className="flip-card">
                  <div className="flip-card-inner">
                    {/* Front Face: Image */}
                    <div className="flip-card-front relative select-none">
                      <img src="/images/journey_theme_engineering.png" alt="Custom Theme Design" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />
                      <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                        <span className="text-[#ffc400] text-[10px] font-extrabold tracking-wider uppercase">PHASE 02</span>
                        <h4 className="text-white font-bold text-sm sm:text-base font-heading">Theme Design</h4>
                      </div>
                    </div>
                    {/* Back Face: Ticket Stub Content */}
                    <div className="flip-card-back">
                      <div className="shopno-ticket-stub">
                        <span className="text-[#ffc400] text-xs font-extrabold font-heading mb-1 tracking-wider">PHASE 02</span>
                        <h4 className="text-white font-extrabold text-sm sm:text-base text-center font-heading">
                          Theme Design
                        </h4>
                        <div className="ticket-dashed-divider"></div>
                        <ul className="text-[11px] text-gray-400 space-y-1.5 text-left list-disc list-inside font-sans w-full">
                          <li>Custom Liquid Styles</li>
                          <li>Speed Engineering (95+)</li>
                          <li>Mobile Checkout Overrides</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="hiw-step-item">
                <div className="hiw-icon-container">
                  <Megaphone size={20} />
                </div>
                {/* Dotted Arrow 8 leading to Step 4 */}
                <img src="/images/ticketbud/line-arrow-8.png" className="arrow-connector-animated" style={{ top: '10px', left: '62%', width: '85%', zIndex: 1 , rotate: '180deg' }} alt="" />
                
                {/* 3D Flip Card */}
                <div className="flip-card">
                  <div className="flip-card-inner">
                    {/* Front Face: Image */}
                    <div className="flip-card-front relative select-none">
                      <img src="/images/journey_marketing_syncs.png" alt="Marketing Sync" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />
                      <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                        <span className="text-[#ffc400] text-[10px] font-extrabold tracking-wider uppercase">PHASE 03</span>
                        <h4 className="text-white font-bold text-sm sm:text-base font-heading">Marketing Sync</h4>
                      </div>
                    </div>
                    {/* Back Face: Ticket Stub Content */}
                    <div className="flip-card-back">
                      <div className="shopno-ticket-stub">
                        <span className="text-[#ffc400] text-xs font-extrabold font-heading mb-1 tracking-wider">PHASE 03</span>
                        <h4 className="text-white font-extrabold text-sm sm:text-base text-center font-heading">
                          Marketing Sync
                        </h4>
                        <div className="ticket-dashed-divider"></div>
                        <ul className="text-[11px] text-gray-400 space-y-1.5 text-left list-disc list-inside font-sans w-full">
                          <li>Gateway & Logistics Integration</li>
                          <li>Pixel & Analytics Syncs</li>
                          <li>Abandoned Cart Flows</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="hiw-step-item">
                <div className="hiw-icon-container">
                  <BarChart3 size={20} />
                </div>
                
                {/* 3D Flip Card */}
                <div className="flip-card">
                  <div className="flip-card-inner">
                    {/* Front Face: Image */}
                    <div className="flip-card-front relative select-none">
                      <img src="/images/journey_launch_scale.png" alt="Launch & Grow" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />
                      <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                        <span className="text-[#ffc400] text-[10px] font-extrabold tracking-wider uppercase">PHASE 04</span>
                        <h4 className="text-white font-bold text-sm sm:text-base font-heading">Launch & Grow</h4>
                      </div>
                    </div>
                    {/* Back Face: Ticket Stub Content */}
                    <div className="flip-card-back">
                      <div className="shopno-ticket-stub">
                        <span className="text-[#ffc400] text-xs font-extrabold font-heading mb-1 tracking-wider">PHASE 04</span>
                        <h4 className="text-white font-extrabold text-sm sm:text-base text-center font-heading">
                          Launch & Grow
                        </h4>
                        <div className="ticket-dashed-divider"></div>
                        <ul className="text-[11px] text-gray-400 space-y-1.5 text-left list-disc list-inside font-sans w-full">
                          <li>Live Store Go-Live Check</li>
                          <li>Scale Traffic & Ad Loops</li>
                          <li>ROAS Optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: SAAS FOOTER (Light Grey Footer Style) ── */}
      <footer className="relative z-5 bg-[#141414] pt-20 pb-8 w-full border-t border-white/10 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            
            {/* Left Footer: Brand Info and Navigation links */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-10 scroll-reveal">
              <div className="flex flex-col items-start">
                <a href="#" className="mb-6 hover:opacity-80 transition-opacity">
                  <img 
                    src="https://shopnoecommerce.com/assets/website/images/logo/new_shopno_logo.png" 
                    alt="Shopno eCommerce" 
                    className="h-12 w-auto object-contain"
                  />
                </a>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-[500px] mb-6 font-body">
                  Scale your D2C brand with Surat's leading Shopify development and marketing agency. Custom store configurations, high speed optimization, and optimized campaign loops.
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="group relative flex items-center bg-[#ffc400] hover:bg-[#e0ad00] text-gray-950 font-bold rounded-full pl-5 pr-1.5 py-1.5 transition-colors duration-300 shadow-lg"
                >
                  <div className="overflow-hidden h-[20px] relative text-[13px] font-bold leading-[20px] mr-3">
                    <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                      <span>Schedule Call</span>
                      <span>Schedule Call</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-950 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 rotate-0">
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </div>
                </button>
              </div>

              {/* 3 Nav columns */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-4 font-body">
                <div className="flex flex-col items-start">
                  <h4 className="text-xs uppercase tracking-widest font-extrabold text-white mb-4 font-heading">Solutions</h4>
                  <a href="#solutions" className="text-sm text-gray-400 hover:text-[#ffc400] mb-2.5 transition-colors">Custom Themes</a>
                  <a href="#sticky-scale" className="text-sm text-gray-400 hover:text-[#ffc400] mb-2.5 transition-colors">CRO Optimization</a>
                  <a href="#features" className="text-sm text-gray-400 hover:text-[#ffc400] mb-2.5 transition-colors">App Integrations</a>
                  <a href="#intro" className="text-sm text-gray-400 hover:text-[#ffc400] transition-colors">Speed Scaling</a>
                </div>
                <div className="flex flex-col items-start">
                  <h4 className="text-xs uppercase tracking-widest font-extrabold text-white mb-4 font-heading">Company</h4>
                  <a href="#solutions" className="text-sm text-gray-400 hover:text-[#ffc400] mb-2.5 transition-colors">Why Shopno</a>
                  <a href="#journey" className="text-sm text-gray-400 hover:text-[#ffc400] mb-2.5 transition-colors">Our Process</a>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#ffc400] transition-colors">Client Stories</a>
                </div>
                <div className="flex flex-col items-start">
                  <h4 className="text-xs uppercase tracking-widest font-extrabold text-white mb-4 font-heading">Social Hubs</h4>
                  <a href="https://www.instagram.com/shopno.in/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#ffc400] mb-2.5 transition-colors">Instagram</a>
                  <a href="https://www.linkedin.com/company/shopnoindia/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#ffc400] mb-2.5 transition-colors">LinkedIn</a>
                  <a href="https://www.facebook.com/shopno.in/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#ffc400] transition-colors">Facebook</a>
                </div>
              </div>
            </div>

            {/* Right Footer: Illustration */}
            <div className="lg:col-span-4 flex flex-col justify-end scroll-reveal reveal-delay-1">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[16/10] bg-[#1c1d1f]">
                <img 
                  src="/images/footer_banner.png" 
                  alt="Shopify Fulfillment Warehouse and sales analytics tablet" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

          {/* Bottom Copyright bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium font-body">
            <p>&copy; 2026 Shopno eCommerce PVT. LTD. All rights reserved. Surat, India.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#ffc400] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#ffc400] transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ── LEAD GENERATION FORM MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 w-full h-full bg-black/70 backdrop-blur-md z-[2000] flex items-center justify-center p-4 animate-fade-in">
          {/* Dismiss Click-Out zone */}
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-[#1c1d1f] border border-white/10 text-white rounded-2xl w-full max-w-4xl p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#ffc400] transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form */}
              <div className="md:col-span-7 flex flex-col">
                <div className="mb-6 flex flex-col items-start">
                  <img 
                    src="https://shopnoecommerce.com/assets/website/images/logo/new_shopno_logo.png" 
                    alt="Shopno eCommerce" 
                    className="h-10 w-auto object-contain mb-4"
                  />
                  <h2 className="text-white font-semibold text-2xl tracking-tight mb-1 font-heading">Let's scale your brand together</h2>
                  <p className="text-gray-400 text-sm font-body">Send a direct inquiry below to connect on WhatsApp.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 font-body">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-white/80 font-bold font-heading" htmlFor="mName">Name</label>
                      <input 
                        type="text" 
                        id="mName" 
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-white/10 bg-[#141414] focus:border-[#ffc400] focus:bg-[#141414] text-white rounded outline-none transition-all text-sm"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-white/80 font-bold font-heading" htmlFor="mEmail">Email Address</label>
                      <input 
                        type="email" 
                        id="mEmail" 
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-white/10 bg-[#141414] focus:border-[#ffc400] focus:bg-[#141414] text-white rounded outline-none transition-all text-sm"
                        placeholder="Your Email"
                      />
                    </div>
                  </div>

                  {/* Phone and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-white/80 font-bold font-heading" htmlFor="mPhone">Mobile No.</label>
                      <input 
                        type="tel" 
                        id="mPhone" 
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-white/10 bg-[#141414] focus:border-[#ffc400] focus:bg-[#141414] text-white rounded outline-none transition-all text-sm"
                        placeholder="Your Mobile Number"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-white/80 font-bold font-heading" htmlFor="mCompany">Company Name</label>
                      <input 
                        type="text" 
                        id="mCompany" 
                        required
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-white/10 bg-[#141414] focus:border-[#ffc400] focus:bg-[#141414] text-white rounded outline-none transition-all text-sm"
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-white/80 font-bold font-heading" htmlFor="mCity">City</label>
                    <input 
                      type="text" 
                      id="mCity" 
                      required
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-white/10 bg-[#141414] focus:border-[#ffc400] focus:bg-[#141414] text-white rounded outline-none transition-all text-sm"
                      placeholder="Your City"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-white/80 font-bold font-heading" htmlFor="mMessage">Message</label>
                    <textarea 
                      id="mMessage" 
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-white/10 bg-[#141414] focus:border-[#ffc400] focus:bg-[#141414] text-white rounded outline-none transition-all text-sm resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3 bg-[#ffc400] hover:bg-[#e0ad00] text-gray-950 font-bold rounded shadow-lg focus:outline-none transition-colors duration-300 disabled:opacity-50 text-sm"
                  >
                    {submitting ? "Redirecting..." : "Send Message via WhatsApp"}
                  </button>

                  {formStatus && (
                    <p className={`text-xs text-center font-semibold ${
                      formSuccess ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formStatus}
                    </p>
                  )}
                </form>
              </div>

              {/* Right Column: Info / Image */}
              <div className="md:col-span-5 flex flex-col gap-6 md:pl-4">
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#141414] aspect-video md:aspect-[4/3]">
                  <img 
                    src="/images/contact_manager.png" 
                    alt="Shopno eCommerce client manager illustration" 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 font-body">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffc400]/10 border border-[#ffc400]/20 flex items-center justify-center text-[#ffc400] flex-shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-sm font-heading">Phone Number</h5>
                      <a href="tel:+917016268071" className="text-gray-400 text-xs sm:text-sm hover:text-[#ffc400] transition-colors">+91 70162 68071</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffc400]/10 border border-[#ffc400]/20 flex items-center justify-center text-[#ffc400] flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-sm font-heading">Headquarters</h5>
                      <p className="text-gray-400 text-xs sm:text-sm">Surat, Gujarat, India</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING WHATSAPP ICON ── */}
      <a 
        href="https://api.whatsapp.com/send?phone=917016268071" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-[999] bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse effect circles */}
        <span className="animate-ping absolute inset-0 rounded-full bg-[#25D366] opacity-75 pointer-events-none" />
        
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.461h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

    </div>
  );
}

export default App;

