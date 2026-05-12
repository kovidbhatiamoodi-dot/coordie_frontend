import { useEffect, useRef, useState } from 'react';

export default function IntroVideoOverlay({ onEnd }) {
  const videoRef = useRef(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    const playPromise = videoRef.current.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
    const fadeTimeoutId = window.setTimeout(() => {
      setIsFading(true);
    }, 2500);

    const timeoutId = window.setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      onEnd();
    }, 3000);
    return () => {
      window.clearTimeout(fadeTimeoutId);
      window.clearTimeout(timeoutId);
    };
  }, [onEnd]);

  return (
    <div className={`intro-video${isFading ? ' intro-video--fade' : ''}`} role="dialog" aria-modal="true">
      <video
        ref={videoRef}
        className="intro-video__media"
        src="/Intro%20Reel%20Cordie.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onEnd}
      />
    </div>
  );
}
