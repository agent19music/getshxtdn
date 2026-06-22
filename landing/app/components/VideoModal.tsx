'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Play, Pause, SpeakerHigh, SpeakerSlash, CornersOut, CornersIn } from '@phosphor-icons/react';

interface VideoModalProps {
  src: string;
  onClose: () => void;
}

export default function VideoModal({ src, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (e.key === 'Escape') { onClose(); return; }
      if (!v) return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (v.paused) { v.play(); setPlaying(true); }
        else { v.pause(); setPlaying(false); }
      }
      if (e.key === 'ArrowRight') { e.preventDefault(); v.currentTime = Math.min(v.currentTime + 5, v.duration); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); v.currentTime = Math.max(v.currentTime - 5, 0); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  }, []);

  const handleEnded = useCallback(() => setPlaying(false), []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Sync fullscreen state with browser (e.g. user presses Esc to exit)
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1c1b1b]/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div ref={containerRef} className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-surface-container-lowest">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-lowest/60 hover:bg-surface-container-lowest/90 transition-colors text-on-surface"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Video */}
        <div
          className="relative w-full bg-black cursor-pointer"
          style={{ aspectRatio: '16 / 9' }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            playsInline
          />

          {/* Centre play overlay when paused */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-surface-container-lowest/90 flex items-center justify-center shadow-lg">
                <Play size={28} weight="fill" className="text-primary translate-x-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div className="px-5 py-4 flex items-center gap-4 bg-surface-container-lowest">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-on-primary hover:opacity-90 transition-opacity shrink-0"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing
              ? <Pause size={16} weight="fill" />
              : <Play size={16} weight="fill" className="translate-x-px" />
            }
          </button>

          {/* Progress bar */}
          <div
            className="flex-1 h-1.5 bg-surface-container-high rounded-full cursor-pointer group relative"
            onClick={handleScrub}
          >
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant shrink-0"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted
              ? <SpeakerSlash size={18} weight="bold" />
              : <SpeakerHigh size={18} weight="bold" />
            }
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant shrink-0"
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen
              ? <CornersIn size={18} weight="bold" />
              : <CornersOut size={18} weight="bold" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
