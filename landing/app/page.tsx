'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import VideoModal from './components/VideoModal';

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isDark = false; // Using light theme by default as per Stitch design

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* TopNavBar */}
      <nav className="w-full top-0 sticky bg-background z-50">
        <div className="flex justify-between items-center px-margin py-space-md max-w-7xl mx-auto">
          {/* Logo gone from top navigation */}
          <div />
          <div className="flex items-center gap-space-md">
            <a className="font-body text-body text-secondary hover:text-primary-hover transition-colors duration-200" href="#">Product</a>
            <a
              className="font-body text-body text-secondary hover:text-primary-hover transition-colors duration-200"
              href="https://sean.uzskicorp.agency?utm=resume"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hire Me
            </a>
            <button
              onClick={() => setIsVideoOpen(true)}
              className="font-button text-button bg-primary text-on-primary px-space-md py-space-sm rounded-full hover:bg-primary-hover transition-colors duration-200 cursor-pointer"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center max-w-3xl mx-auto px-margin py-space-3xl md:py-32 w-full">
        {/* Hero Section */}
        <section className="mb-space-3xl">
          {/* Bigger logo above the hero text */}
          <div className="mb-8">
            <Image
              src="https://pub-8ea5c2fb30814a8ea5a4726bc8a453d3.r2.dev/gsd-logo-light.png"
              alt="GSD logo"
              width={160}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>

          {/* Bigger Hero Text */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-on-background mb-space-md tracking-tighter leading-[1.05] font-extrabold">
            Less friction.<br/>More action.
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mb-space-xl max-w-2xl leading-8">
            GSD (Get Shit Done) is the unapologetic mobile app for people who want to stop organizing their tasks and start actually doing them.
          </p>
          <div className="flex flex-col sm:flex-row gap-space-md">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#171717] text-[#F5F5F5] font-button text-button hover:bg-primary-hover transition-colors duration-200 w-full sm:w-auto cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
              Watch Demo
            </button>
            <a
              href="#"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#171717] text-[#F5F5F5] font-button text-button hover:bg-primary-hover transition-colors duration-200 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">android</span>
              Get Experimental APK
            </a>
          </div>
        </section>

        {/* Feature Section (Bento-ish Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Card 1 */}
          <div className="bg-card border border-border rounded-lg p-space-lg transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col h-full">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
            </div>
            <h3 className="font-headline-h3 text-headline-h3 text-on-surface mb-space-sm">Zero Onboarding</h3>
            <p className="font-body text-body text-secondary mt-auto">Jump straight into your work. No setup, no friction.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border rounded-lg p-space-lg transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col h-full">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-primary text-[20px]">push_pin</span>
            </div>
            <h3 className="font-headline-h3 text-headline-h3 text-on-surface mb-space-sm">Frictionless Capture</h3>
            <p className="font-body text-body text-secondary mt-auto">Ideas are fleeting. GSD makes sure they stick.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border rounded-lg p-space-lg transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col h-full md:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-primary text-[20px]">center_focus_strong</span>
            </div>
            <h3 className="font-headline-h3 text-headline-h3 text-on-surface mb-space-sm">Deep Focus</h3>
            <p className="font-body text-body text-secondary mt-auto">A UI that recedes so the work can lead.</p>
          </div>
        </section>

        {/* Uzski Corp Credits */}
        <div
          className={`mt-12 pt-8 border-t text-center transition-all duration-1000 ${
            isDark ? "border-stone-800" : "border-stone-300"
          } ${isVisible
            ? "opacity-100 blur-0 translate-y-0"
            : "opacity-0 blur-sm translate-y-4"
            }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <p className={`text-sm flex items-center justify-center gap-2 flex-wrap ${
            isDark ? "text-stone-400" : "text-stone-600"
          }`}>
            <a
              href="https://uzskicorp.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer flex items-center gap-2"
            >
              A product of Uzski Corp
              <Image
                src="https://pub-0a313ba028f9423cba4b9803d081b5db.r2.dev/app%20ui/uzski-logo-nobg.png"
                alt="Uzski Corp"
                width={40}
                height={40}
                className="inline-block rounded-full"
              />
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-background mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin py-space-lg max-w-7xl mx-auto transition-all duration-200">
          <div className="mb-space-md md:mb-0">
            <Image
              src="https://pub-8ea5c2fb30814a8ea5a4726bc8a453d3.r2.dev/gsd-logo-light.png"
              alt="GSD logo"
              width={80}
              height={24}
              className="h-6 w-auto animate-fade-in"
            />
          </div>
          <div className="flex gap-space-lg mb-space-md md:mb-0">
            <a className="font-label text-label text-secondary hover:text-primary transition-colors" href="/privacy">Privacy</a>
            <a className="font-label text-label text-secondary hover:text-primary transition-colors" href="/terms">Terms</a>
          </div>
          <div className="font-label text-label text-secondary">
            © 2026 GSD. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoOpen && (
        <VideoModal
          src="https://pub-8ea5c2fb30814a8ea5a4726bc8a453d3.r2.dev/gsd-demo.mp4"
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </>
  );
}
