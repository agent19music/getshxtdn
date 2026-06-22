'use client';

import * as React from "react";
import Image from "next/image";

const termsNavItems = [
  { label: "Home", href: "/" },
  { label: "Hire Me", href: "https://sean.uzskicorp.agency?utm=resume" },
  { label: "Privacy", href: "/privacy" },
] as const;

const tableOfContents = [
  { href: "#agreement", label: "1. Agreement To Our Legal Terms" },
  { href: "#services", label: "2. Our Services" },
  { href: "#process", label: "3. Project Process" },
  { href: "#ip", label: "4. Intellectual Property Rights" },
  { href: "#userreps", label: "5. User Representations" },
  { href: "#purchases", label: "6. Purchases And Payment" },
  { href: "#refunds", label: "7. Refund Policy" },
  { href: "#prohibited", label: "8. Prohibited Activities" },
  { href: "#privacy", label: "9. Privacy Policy" },
  { href: "#confidentiality", label: "10. Confidentiality" },
  { href: "#contact", label: "11. Contact Us" },
] as const;

export default function TermsPage() {
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
            {termsNavItems.map((item) => (
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
          Terms of Service
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
            <section id="agreement" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                1. Agreement To Our Legal Terms
              </h2>
              <p>
                We are Uzski Corp ("Company," "we," "us," or "our"), a company registered in Kenya at Ralph Bunche Rd, Nairobi, Nairobi County 00100.
              </p>
              <p>
                We operate the website{" "}
                <a
                  className="text-primary hover:underline font-medium"
                  href="https://uzskicorp.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://uzskicorp.agency
                </a>{" "}
                (the "Site"), as well as any other related products and services that refer or link to these legal terms (collectively, the "Services").
              </p>
              <p>
                These Legal Terms constitute a legally binding agreement made between you and Uzski Corp. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms.
              </p>
            </section>

            <section id="services" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                2. Our Services
              </h2>
              <p>
                Uzski Corp provides creative design and software development services. Our offerings include but are not limited to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Web application development (Next.js, React)</li>
                <li>Mobile application development (React Native, Expo)</li>
                <li>UI/UX design and brand identity</li>
                <li>Custom API and backend development</li>
              </ul>
            </section>

            <section id="process" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                3. Project Process
              </h2>
              <p>
                Our engagement process involves Discovery, Proposal, Agreement, Development, and Delivery. Revisions are limited to the scope defined in individual project proposals.
              </p>
            </section>

            <section id="ip" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                4. Intellectual Property Rights
              </h2>
              <p>
                For client work: upon full payment, you receive full ownership rights to all custom work created specifically for your project. We retain portfolio presentation rights unless agreed otherwise in writing.
              </p>
            </section>

            <section id="userreps" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                5. User Representations
              </h2>
              <p>
                By using the Services, you represent that you have legal capacity, you are not a minor, and you will comply with applicable laws.
              </p>
            </section>

            <section id="purchases" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                6. Purchases And Payment
              </h2>
              <p>
                For custom projects, we structure payments typically on a 30% advance deposit and remaining milestones as agreed. Final deliverables are delivered upon clearance of the remaining balance.
              </p>
            </section>

            <section id="refunds" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                7. Refund Policy
              </h2>
              <p>
                Due to the custom nature of our creative and development services, all advance payments and milestone payments are final and non-refundable.
              </p>
            </section>

            <section id="prohibited" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                8. Prohibited Activities
              </h2>
              <p>
                You may not use the services to scrape data, defraud users, attempt reverse engineering of our platform, or upload malicious files.
              </p>
            </section>

            <section id="privacy" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                9. Privacy Policy
              </h2>
              <p>
                We process your data according to our Privacy Policy. By utilizing the Services, you agree to these terms.
              </p>
            </section>

            <section id="confidentiality" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                10. Confidentiality
              </h2>
              <p>
                We treat all project information as confidential. We will not share your business secrets or proprietary data with third parties.
              </p>
            </section>

            <section id="contact" className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">
                11. Contact Us
              </h2>
              <p>
                If you have any questions about these Legal Terms, please contact us at{" "}
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
