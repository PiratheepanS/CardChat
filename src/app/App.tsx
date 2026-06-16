import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import GeneratedLandingPage, {
  Navbar, MobileNavbar,
  MobileHero, MobileStatsBar, MobileAboutSection, MobileWhyChooseUsSection,
  MobileHowItWorksSection, MobileTestimonialsSection, MobileAppDownloadSection, MobileFooter,
} from '../imports/Frame2147238094';

// Design y-position where scaled content starts on mobile.
// All sections replaced — full design height; scaled container hidden on mobile.
const MOBILE_DESIGN_BASE = 5925;

export default function App() {
  const [layout, setLayout] = useState({ scale: 1, height: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const [mobileHeroStatsHeight,  setMobileHeroStatsHeight]  = useState(0);
  const [mobileAboutHeight,      setMobileAboutHeight]      = useState(0);
  const [mobileWhyHeight,        setMobileWhyHeight]        = useState(0);
  const [mobileHowItWorksHeight, setMobileHowItWorksHeight] = useState(0);

  const mobileHeroStatsRef     = useRef<HTMLDivElement>(null);
  const mobileAboutRef         = useRef<HTMLDivElement>(null);
  const mobileWhyRef           = useRef<HTMLDivElement>(null);
  const mobileHowItWorksRef    = useRef<HTMLDivElement>(null);
  const mobileTestimonialsRef  = useRef<HTMLDivElement>(null);
  const mobileAppDownloadRef   = useRef<HTMLDivElement>(null);

  const DESIGN_WIDTH  = 1920;
  const DESIGN_HEIGHT = 5925;

  useLayoutEffect(() => {
    const updateLayout = () => {
      const vw = window.innerWidth;
      const nextScale = vw / DESIGN_WIDTH;
      setLayout({ scale: nextScale, height: DESIGN_HEIGHT * nextScale });
      setIsMobile(vw < 768);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileHeroStatsHeight(mobileHeroStatsRef.current?.offsetHeight ?? 0);
      setMobileAboutHeight(mobileAboutRef.current?.offsetHeight ?? 0);
      setMobileWhyHeight(mobileWhyRef.current?.offsetHeight ?? 0);
      setMobileHowItWorksHeight(mobileHowItWorksRef.current?.offsetHeight ?? 0);
    }
  }, [isMobile, layout.scale]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const s = layout.scale;

  const mobileNavLinks = [
    { label: 'HOME',          href: '#home',          scrollY: 0 },
    { label: 'ABOUT US',      href: '#about-us',      scrollY: mobileHeroStatsHeight },
    { label: 'WHY CHOOSE US', href: '#why-choose-us', scrollY: mobileHeroStatsHeight + mobileAboutHeight },
    { label: 'HOW IT WORKS',  href: '#how-it-works',  scrollY: mobileHeroStatsHeight + mobileAboutHeight + mobileWhyHeight },
    { label: 'TESTIMONIALS',  href: '#testimonials',  scrollY: mobileHeroStatsHeight + mobileAboutHeight + mobileWhyHeight + mobileHowItWorksHeight },
  ];

  const scaledContentHeight = isMobile ? (DESIGN_HEIGHT - MOBILE_DESIGN_BASE) * s : layout.height;
  const scaledContentOffset = isMobile ? -(MOBILE_DESIGN_BASE * s) : 0;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* Navbar */}
      {isMobile ? (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
          <MobileNavbar links={mobileNavLinks} />
        </div>
      ) : (
        <div style={{ position: 'fixed', top: 0, left: 0, width: DESIGN_WIDTH, transform: `scale(${s})`, transformOrigin: 'top left', zIndex: 1000 }}>
          <Navbar />
        </div>
      )}

      {/* Mobile sections rendered outside the scaled container */}
      {isMobile && (
        <>
          <div ref={mobileHeroStatsRef} style={{ paddingTop: 56 }}>
            <MobileHero />
            <MobileStatsBar />
          </div>
          <div ref={mobileAboutRef}>
            <MobileAboutSection />
          </div>
          <div ref={mobileWhyRef}>
            <MobileWhyChooseUsSection />
          </div>
          <div ref={mobileHowItWorksRef}>
            <MobileHowItWorksSection />
          </div>
          <div ref={mobileTestimonialsRef}>
            <MobileTestimonialsSection />
          </div>
          <div ref={mobileAppDownloadRef}>
            <MobileAppDownloadSection />
          </div>
          <MobileFooter />
        </>
      )}

      {/* Scaled page content — mobile: hero+stats+about+why-choose-us hidden via marginTop */}
      <div style={{ width: '100%', height: scaledContentHeight, overflow: 'hidden' }}>
        <div
          className="relative overflow-visible"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${s})`,
            transformOrigin: 'top left',
            margin: 0,
            marginTop: scaledContentOffset,
          }}
        >
          <GeneratedLandingPage />
        </div>
      </div>

      {/* Scroll to top button */}
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
