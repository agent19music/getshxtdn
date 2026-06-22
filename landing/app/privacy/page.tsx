'use client';

import * as React from "react";
import Image from "next/image";

const privacyNavItems = [
  { label: "Home", href: "/" },
  { label: "Hire Me", href: "https://sean.uzskicorp.agency?utm=resume" },
  { label: "Terms", href: "/terms" },
] as const;

const tableOfContents = [
  { href: "#collect", label: "1. Information We Collect" },
  { href: "#use", label: "2. How We Use Information" },
  { href: "#share", label: "3. Sharing Your Information" },
  { href: "#security", label: "4. Information Security" },
  { href: "#cookies", label: "5. Cookies Policy" },
  { href: "#rights", label: "6. Your Privacy Rights" },
  { href: "#contact", label: "7. Contact Us" },
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* TopNavBar */}
      <nav className="w-full top-0 sticky bg-background z-50 border-b border-border">
        <div className="flex justify-between items-center px-margin py-space-md max-w-7xl mx-auto">
          <a href="/">
            <Image
              src="https://pub-8ea5c2fb30814a8ea5a4726bc8a453d3.r2.dev/gsd-logo-light.png"
              alt="GSD logo"
              width={80}
              height={24}
              className="h-6 w-auto"
              priority
            />
          </a>
          <div className="flex items-center gap-space-md">
            {privacyNavItems.map((item) => (
              <a
                key={item.href}
                className="font-body text-body text-secondary hover:text-primary transition-colors duration-200"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto px-margin py-16 w-full">
        <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-secondary mb-12">
          Last updated: April 17, 2026
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="md:col-span-1 md:sticky md:top-24 h-fit">
            <h2 className="text-base font-semibold tracking-tight text-primary mb-4">
              Table of Contents
            </h2>
            <ul className="space-y-2 pl-0 list-none text-sm text-secondary">
              {tableOfContents.map((item) => (
                <li key={item.href}>
                  <a
                    className="hover:text-primary transition-colors hover:underline"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Document Content */}
          <article className="md:col-span-3 space-y-10 text-[15px] leading-[1.75] text-secondary">
            <section id="collect" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                1. Information We Collect
              </h2>
              <p>
                We collect personal information that you voluntarily provide to us when you register for services, request client assistance, or contact us. This may include:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Name, email address, phone number, and physical mail address.</li>
                <li>Payment details and transaction data.</li>
                <li>Project descriptions, credentials, and configuration files you share with us.</li>
              </ul>
            </section>

            <section id="use" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                2. How We Use Information
              </h2>
              <p>
                We use personal information collected via our Services for various business purposes, including to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Provide, deliver, and maintain custom design and development services.</li>
                <li>Process payments, manage accounts, and coordinate billing.</li>
                <li>Send administrative updates, newsletters, or respond to service requests.</li>
                <li>Protect our services and keep our operations secure.</li>
              </ul>
            </section>

            <section id="share" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                3. Sharing Your Information
              </h2>
              <p>
                We do not sell your personal data. We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
              </p>
            </section>

            <section id="security" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                4. Information Security
              </h2>
              <p>
                We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please remember that no electronic transmission over the internet or information storage technology can be guaranteed 100% secure.
              </p>
            </section>

            <section id="cookies" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                5. Cookies Policy
              </h2>
              <p>
                We may use cookies and similar tracking technologies to access or store information. You can choose to accept or decline cookies through your browser settings.
              </p>
            </section>

            <section id="rights" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                6. Your Privacy Rights
              </h2>
              <p>
                Depending on your location, you may have rights to access, change, or delete your personal information. You can submit requests regarding your data by contacting us.
              </p>
            </section>

            <section id="contact" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                7. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a className="text-primary hover:underline font-medium" href="mailto:hello@uzskicorp.agency">
                  hello@uzskicorp.agency
                </a>.
              </p>
            </section>
          </article>
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
              className="h-6 w-auto"
            />
          </div>
          <div className="font-label text-label text-secondary">
            © 2026 GSD. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
