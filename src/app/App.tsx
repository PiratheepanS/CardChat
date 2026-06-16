import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import GeneratedLandingPage, {
  Navbar, MobileNavbar,
  MobileHero, MobileStatsBar, MobileAboutSection, MobileWhyChooseUsSection,
  MobileHowItWorksSection, MobileTestimonialsSection, MobileAppDownloadSection, MobileFooter,
} from '../imports/Frame2147238094';

const DESIGN_WIDTH   = 1920;
const DESIGN_HEIGHT  = 5925;
const HERO_END       = 1080;  // desktop hero ends at y=1080
const SIDE_PADDING   = 375;   // desktop left/right section padding
const TABLET_MARGIN  = 48;    // visible left/right margin on tablet

export default function App() {
  const [layout, setLayout]               = useState({ scale: 1, height: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile]           = useState(() => window.innerWidth < 768);
  const [isTablet, setIsTablet]           = useState(() => window.innerWidth >= 768 && window.innerWidth < 1024);

  const [mobileHeroHeight,       setMobileHeroHeight]       = useState(0);
  const [mobileStatsHeight,      setMobileStatsHeight]      = useState(0);
  const [mobileAboutHeight,      setMobileAboutHeight]      = useState(0);
  const [mobileWhyHeight,        setMobileWhyHeight]        = useState(0);
  const [mobileHowItWorksHeight, setMobileHowItWorksHeight] = useState(0);

  const mobileHeroRef         = useRef<HTMLDivElement>(null);
  const mobileStatsRef        = useRef<HTMLDivElement>(null);
  const mobileAboutRef        = useRef<HTMLDivElement>(null);
  const mobileWhyRef          = useRef<HTMLDivElement>(null);
  const mobileHowItWorksRef   = useRef<HTMLDivElement>(null);
  const mobileTestimonialsRef = useRef<HTMLDivElement>(null);
  const mobileAppDownloadRef  = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setLayout({ scale: vw / DESIGN_WIDTH, height: DESIGN_HEIGHT * (vw / DESIGN_WIDTH) });
      setIsMobile(vw < 768);
      setIsTablet(vw >= 768 && vw < 1024);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (isMobile || isTablet) setMobileHeroHeight(mobileHeroRef.current?.offsetHeight ?? 0);
    if (isMobile) {
      setMobileStatsHeight(mobileStatsRef.current?.offsetHeight ?? 0);
      setMobileAboutHeight(mobileAboutRef.current?.offsetHeight ?? 0);
      setMobileWhyHeight(mobileWhyRef.current?.offsetHeight ?? 0);
      setMobileHowItWorksHeight(mobileHowItWorksRef.current?.offsetHeight ?? 0);
    }
  }, [isMobile, isTablet, layout.scale]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const s = layout.scale; // vw / 1920

  // Tablet: scale so content (1170px) fills viewport minus 48px margins on each side.
  // transform: scale(cs) translateX(-375px) shifts design side padding off-screen.
  const contentScale = isTablet
    ? (s * DESIGN_WIDTH - 2 * TABLET_MARGIN) / (DESIGN_WIDTH - 2 * SIDE_PADDING) // (vw - 96) / 1170
    : s;

  const heroStatsHeight = mobileHeroHeight + mobileStatsHeight;

  const navLinks = isMobile ? [
    { label: 'HOME',          href: '#home',          scrollY: 0 },
    { label: 'ABOUT US',      href: '#about-us',      scrollY: heroStatsHeight },
    { label: 'WHY CHOOSE US', href: '#why-choose-us', scrollY: heroStatsHeight + mobileAboutHeight },
    { label: 'HOW IT WORKS',  href: '#how-it-works',  scrollY: heroStatsHeight + mobileAboutHeight + mobileWhyHeight },
    { label: 'TESTIMONIALS',  href: '#testimonials',  scrollY: heroStatsHeight + mobileAboutHeight + mobileWhyHeight + mobileHowItWorksHeight },
  ] : [
    // Tablet: hero replaced, rest is desktop content scaled by contentScale
    { label: 'HOME',          href: '#home',          scrollY: 0 },
    { label: 'ABOUT US',      href: '#about-us',      scrollY: mobileHeroHeight + (1275 - HERO_END) * contentScale },
    { label: 'WHY CHOOSE US', href: '#why-choose-us', scrollY: mobileHeroHeight + (2135 - HERO_END) * contentScale },
    { label: 'HOW IT WORKS',  href: '#how-it-works',  scrollY: mobileHeroHeight + (3215 - HERO_END) * contentScale },
    { label: 'TESTIMONIALS',  href: '#testimonials',  scrollY: mobileHeroHeight + (3795 - HERO_END) * contentScale },
  ];

  // Scaled container dimensions
  const scaledHeight = isTablet
    ? (DESIGN_HEIGHT - HERO_END) * contentScale
    : layout.height;
  const scaledMarginTop = isTablet
    ? -(HERO_END * contentScale)
    : 0;
  const scaledTransform = isTablet
    ? `scale(${contentScale}) translateX(-${SIDE_PADDING}px)`
    : `scale(${s})`;

  const showMobileNav = isMobile || isTablet;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* Navbar */}
      {showMobileNav ? (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
          <MobileNavbar links={navLinks} />
        </div>
      ) : (
        <div style={{ position: 'fixed', top: 0, left: 0, width: DESIGN_WIDTH, transform: `scale(${s})`, transformOrigin: 'top left', zIndex: 1000 }}>
          <Navbar />
        </div>
      )}

      {/* Hero — tablet + mobile */}
      {showMobileNav && (
        <div ref={mobileHeroRef} style={{ paddingTop: 56 }}>
          <MobileHero />
        </div>
      )}

      {/* Mobile-only sections */}
      {isMobile && (
        <>
          <div ref={mobileStatsRef}><MobileStatsBar /></div>
          <div ref={mobileAboutRef}><MobileAboutSection /></div>
          <div ref={mobileWhyRef}><MobileWhyChooseUsSection /></div>
          <div ref={mobileHowItWorksRef}><MobileHowItWorksSection /></div>
          <div ref={mobileTestimonialsRef}><MobileTestimonialsSection /></div>
          <div ref={mobileAppDownloadRef}><MobileAppDownloadSection /></div>
          <MobileFooter />
        </>
      )}

      {/* Scaled desktop content — hidden on mobile, content-width-scaled on tablet */}
      {!isMobile && (
        <div style={{ width: '100%', height: scaledHeight, overflow: 'hidden', boxSizing: 'border-box', paddingLeft: isTablet ? TABLET_MARGIN : 0, paddingRight: isTablet ? TABLET_MARGIN : 0 }}>
          <div
            className="relative overflow-visible"
            style={{
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              transform: scaledTransform,
              transformOrigin: 'top left',
              marginTop: scaledMarginTop,
            }}
          >
            <GeneratedLandingPage />
          </div>
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000, width: 48, height: 48, borderRadius: '50%', backgroundColor: '#00946c', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 15V5M10 5L5 10M10 5L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
