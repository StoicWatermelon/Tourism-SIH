import React, { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import gsap from 'gsap';

// Optional React Router Link import with graceful fallback to native anchor tags
let LinkComponent: React.ComponentType<{ to: string; className?: string; children?: React.ReactNode; 'aria-label'?: string }> = ({ to, className, children, ...rest }) => (
  <a href={to} className={className} {...rest}>{children}</a>
);

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rr = require('react-router-dom');
  if (rr && rr.Link) {
    LinkComponent = rr.Link;
  }
} catch {
  // Native link fallback when running outside react-router context
}

export interface HomeProps {
  onExploreClick?: () => void;
  videoSrc?: string;
}

export const Home: React.FC<HomeProps> = ({
  onExploreClick,
  videoSrc = "./src/assets/upscaled-video.mp4"
}) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const bottomBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Initial GSAP mount entrance transitions
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    }

    if (bottomBlockRef.current) {
      gsap.fromTo(
        bottomBlockRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.35, ease: 'power3.out' }
      );
    }

    // 2. GSAP Mouse parallax with lerp loop on requestAnimationFrame
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 20;
      targetY = ((e.clientY - cy) / cy) * 20;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (videoContainerRef.current) {
        gsap.set(videoContainerRef.current, {
          x: currentX,
          y: currentY,
          force3D: true
        });
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.playbackRate = 1.25;
  };

  return (
    <div
      className="min-h-screen bg-black text-white overflow-x-hidden relative select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Cinematic Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/40 border-b border-white/10">
        <LinkComponent to="/" className="flex items-center gap-2 text-white no-underline">
          <span className="text-xl font-bold tracking-wider">
            BHARAT <span className="text-[#e9c46a] font-extrabold">EXPLORE</span>
          </span>
        </LinkComponent>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <LinkComponent to="/" className="text-white border-b-2 border-white pb-0.5 transition-colors">
            Home
          </LinkComponent>
          <LinkComponent to="/explore" className="text-white/70 hover:text-white transition-colors">
            Destinations
          </LinkComponent>
          <LinkComponent to="/circuits" className="text-white/70 hover:text-white transition-colors">
            Portals
          </LinkComponent>
          <LinkComponent to="/map" className="text-white/70 hover:text-white transition-colors">
            State Map
          </LinkComponent>
          <LinkComponent to="/planner" className="text-white/70 hover:text-white transition-colors">
            Itinerary
          </LinkComponent>
          <LinkComponent to="/ai" className="text-white/70 hover:text-white transition-colors">
            Bharat AI
          </LinkComponent>
          <LinkComponent to="/responsible" className="text-white/70 hover:text-white transition-colors">
            Eco Travel
          </LinkComponent>
          <LinkComponent to="/culture" className="text-white/70 hover:text-white transition-colors">
            Culture
          </LinkComponent>
          <LinkComponent to="/food" className="text-white/70 hover:text-white transition-colors">
            Cuisine
          </LinkComponent>
        </nav>

        <div className="flex items-center gap-3">
          <LinkComponent
            to="/login"
            className="text-xs font-semibold px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 transition-all text-white no-underline"
          >
            Sign In
          </LinkComponent>
        </div>
      </header>

      {/* Video Background Layer with Scale and Parallax Container */}
      <div
        ref={videoContainerRef}
        className="fixed inset-0 z-0 w-full h-full scale-[1.08] origin-center pointer-events-none"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover"
        />
        {/* Cinematic dark gradient vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/85" />
      </div>

      {/* Fixed Hero Typography */}
      <div
        ref={heroTextRef}
        className="fixed top-[120px] left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
      >
        <h1
          className="font-normal m-0 p-0"
          style={{
            fontSize: 'clamp(40px, 5.4vw, 72px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <span className="block text-white font-medium drop-shadow-md">
            Venture without edges.
          </span>
          <span className="block text-[rgba(255,255,255,0.55)] font-normal mt-1 drop-shadow-sm">
            Uncover with keen instinct.
          </span>
        </h1>
      </div>

      {/* Fixed Bottom Block */}
      <div
        ref={bottomBlockRef}
        className="fixed bottom-14 left-0 right-0 z-20 flex flex-col items-center gap-6 px-4 text-center"
      >
        {/* Atmospheric Smart Itinerary Subtext */}
        <p className="max-w-[620px] text-[15px] leading-relaxed m-0">
          <span className="text-white">
            Our smart itineraries shape around you — your rhythm, your vibe, your hunger for adventure.
          </span>
          <span className="text-white/55">
            {' '}Each getaway is tailored, seamless, and wholly yours.
          </span>
        </p>

        {/* Action Button */}
        <div>
          <LinkComponent
            to="/planner"
            className="inline-block bg-white text-black text-[15px] font-medium rounded-full px-8 py-3.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)] active:scale-[0.97] cursor-pointer no-underline"
          >
            Plan my escape today
          </LinkComponent>
        </div>

        {/* Security / Zero-Leak Badge Row */}
        <div className="flex items-center gap-2">
          <Lock size={13} strokeWidth={1.5} className="text-white/70" />
          <span className="text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase">
            SECURE BY DESIGN. ZERO DATA LEAKS.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
