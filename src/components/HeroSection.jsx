import { useEffect, useState } from 'react';

export default function HeroSection({ onRegisterClick }) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 720px)').matches);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY || 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // On desktop: -140px base offset (matches CSS). On mobile: 0 offset, let flex centering handle position.
  const baseOffset = isMobile ? 0 : -140;
  const speed = isMobile ? 0.4 : 0.3;
  const headingParallax = {
    transform: `translateY(${baseOffset + scrollY * speed}px)`,
  };

  return (
    <section id="hero" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__noise" />
      </div>

      <div className="hero__content hero__content--heading" style={headingParallax}>
        <p className="hero__mobile-desc">
        It is not just a fest, but an emotion an expression of euphoria, with a footfall of over 154,000 students from more than 7,000 colleges. Started in 1971, it has attracted people from all over the globe ever since. Mood Indigo has lived through decades of musical and cultural change, not only keeping up with the times but also setting new standards for cultural festivals each year. Now, we are back with the 56th edition.
        </p>
        <div className="hero__top-logo">
          <img src="/MItoplogo.png" alt="Mood Indigo" />
        </div>
        <img
          className="hero__heading-image"
          src="/Coordinator_portal_heading.png"
          alt="Coordinator Portal"
        />
      </div>

      <div className="hero__parallax" aria-hidden="true">
        <img src="/PROD_WITH_PEOPLE.png" alt="" />
      </div>
    </section>
  );
}
