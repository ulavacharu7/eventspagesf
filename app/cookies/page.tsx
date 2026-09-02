import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cookies Policy | Student Forge Technologies Private Limited',
  description:
    'Cookies and Local Storage Policy of Student Forge Technologies Private Limited explaining the use of session identifiers and storage under Indian regulations.',
};

export default function CookiesPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#26262a]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a]">
            Transparency &amp; Technical Disclosures &bull; Republic of India
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Cookies &amp; Local Storage Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed">
            This policy outlines how Student Forge Technologies Private Limited employs HTTP cookies, HTML5 local storage, and related browser storage mechanisms on events.studentforge.in.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#5a5a64] pt-1">
            <span>Last Updated: September 2026</span>
            <span>&bull;</span>
            <span>Governing Laws: Information Technology Act, 2000 &amp; DPDPA 2023</span>
          </div>
        </div>

        {/* Support Note */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Questions regarding web storage or cookies? Contact support:</span>
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
            <a href="tel:+916304218064" className="hover:text-white transition-colors">+91 6304218064</a>
            <span>,</span>
            <a href="tel:+916309917327" className="hover:text-white transition-colors">+91 6309917327</a>
          </div>
        </div>

        {/* Policy Body */}
        <div className="flex flex-col gap-8 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed pt-2">

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              1. Understanding Cookies &amp; Local Storage
            </h2>
            <p>
              Cookies are small data files stored on your device when you browse websites. Similar web technologies include HTML5 Local Storage and Session Storage. These mechanisms allow the platform to maintain secure user sessions, remember UI preferences, protect against CSRF attacks, and load ticket passes efficiently.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              2. Categories of Storage We Use
            </h2>

            <div className="flex flex-col gap-3 pt-1">
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1.5">
                <span className="font-semibold text-white text-xs sm:text-sm">A. Strictly Necessary / Essential Storage</span>
                <p className="text-xs text-[#8a8a90]">
                  Required for core platform functionality: session tokens, CSRF protection, OTP verification states, and security checks.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1.5">
                <span className="font-semibold text-white text-xs sm:text-sm">B. Functional &amp; Preference Storage</span>
                <p className="text-xs text-[#8a8a90]">
                  Remembers user session info (<code>student_forge_user</code>), dark mode theme preferences, and cookie consent state.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1.5">
                <span className="font-semibold text-white text-xs sm:text-sm">C. Performance &amp; Analytics</span>
                <p className="text-xs text-[#8a8a90]">
                  Aggregated, anonymous metrics via Google Analytics 4 (gtag.js) to measure page load performance and platform uptime.
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              3. Managing &amp; Disabling Cookies
            </h2>
            <p>
              You may manage or disable cookies through your browser settings (Chrome, Safari, Firefox, Edge). Note that disabling essential storage keys may prevent login, checkout, and pass generation from functioning.
            </p>
          </section>

          <section className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h3 className="text-sm font-semibold text-white">Technical Inquiries</h3>
            <p className="text-xs text-[#8a8a90]">
              For technical queries regarding our cookie policies, contact our engineering helpdesk:
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-300 pt-1">
              <span>Helpline: <a href="tel:+916304218064" className="hover:text-white">+91 6304218064</a>, <a href="tel:+916309917327" className="hover:text-white">+91 6309917327</a></span>
              <span>Email: <a href="mailto:info@studentforge.in" className="hover:text-white">info@studentforge.in</a></span>
            </div>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
