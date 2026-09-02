import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cookies Policy | Student Forge Technologies Private Limited',
  description:
    'Detailed Cookies & Local Storage Policy of Student Forge Technologies Private Limited explaining the use of technical cookies, session identifiers, and browser storage under Indian regulations.',
};

export default function CookiesPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#121214] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Background Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#232329_1px,transparent_1px),linear-gradient(to_bottom,#232329_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 z-10 relative">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3 pb-8 border-b border-[#26262d]">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#a1a1aa]">
            <span>Transparency &amp; Technical Disclosures</span>
            <span>•</span>
            <span>Republic of India</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-tight">
            Cookies &amp; Local Storage Policy
          </h1>

          <p className="text-sm sm:text-base text-[#a1a1aa] font-normal leading-relaxed">
            This policy outlines how <strong>Student Forge Technologies Private Limited</strong> employs HTTP cookies, HTML5 local storage, and related browser storage mechanisms on <strong>events.studentforge.in</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#71717a] pt-2">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Governing Laws: Information Technology Act, 2000 &amp; DPDPA 2023</span>
          </div>
        </div>

        {/* Support Alert Box */}
        <div className="my-8 p-4 sm:p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-white">Questions regarding web technologies or data handling?</span>
            <span className="text-indigo-300/90 text-xs">Reach out directly to our engineering and compliance helpdesk:</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <a href="tel:+916304218064" className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
              +91 6304218064
            </a>
            <a href="tel:+916309917327" className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
              +91 6309917327
            </a>
          </div>
        </div>

        {/* Main Policy Content */}
        <div className="flex flex-col gap-10 text-sm sm:text-[15px] text-[#d4d4d8] leading-relaxed font-normal pt-4">

          {/* Section 1: What are Cookies */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              1. Understanding Cookies and Local Storage
            </h2>
            <p>
              Cookies are small alphanumeric text files placed on your computer, smartphone, or tablet when you browse websites. Similar web technologies include HTML5 Local Storage, Session Storage, and pixel tags. These technologies allow the website to recognize your browser, maintain active login sessions, remember user interface preferences, and protect against automated bot attacks.
            </p>
          </section>

          {/* Section 2: Categories of Cookies */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              2. Categories of Cookies We Use
            </h2>
            <p>
              We categorize the storage identifiers used across our platform into the following distinct functional buckets:
            </p>

            <div className="grid grid-cols-1 gap-4 pt-1">
              
              {/* Category A */}
              <div className="p-4 rounded-xl bg-[#18181c] border border-[#27272e] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">A. Strictly Necessary / Essential Cookies</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Mandatory</span>
                </div>
                <p className="text-xs sm:text-sm text-[#a1a1aa]">
                  These cookies are vital for the core functionality and security of the platform. Without them, you cannot authenticate, sign in, register for events, or access your tickets.
                </p>
                <div className="text-xs font-mono text-[#71717a] pt-1">
                  <strong>Examples:</strong> Session tokens, CSRF protection tokens, OTP authentication states, load balancing route cookies.
                </div>
              </div>

              {/* Category B */}
              <div className="p-4 rounded-xl bg-[#18181c] border border-[#27272e] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">B. Functional &amp; Preference Storage</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Operational</span>
                </div>
                <p className="text-xs sm:text-sm text-[#a1a1aa]">
                  These local storage keys remember your UI preferences, dark mode states, recent event filter choices, and draft ticket selections so you do not need to re-enter them on every visit.
                </p>
                <div className="text-xs font-mono text-[#71717a] pt-1">
                  <strong>Examples:</strong> <code>student_forge_user</code>, <code>event_filters</code>, cookie consent acknowledgment banner flags.
                </div>
              </div>

              {/* Category C */}
              <div className="p-4 rounded-xl bg-[#18181c] border border-[#27272e] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">C. Performance &amp; Analytics (Aggregated)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Statistical</span>
                </div>
                <p className="text-xs sm:text-sm text-[#a1a1aa]">
                  We utilize privacy-respecting Google Analytics 4 (gtag.js) to aggregate anonymous statistics regarding overall visitor volume, most popular events, and page loading speeds to optimize platform reliability. These records are strictly anonymized and aggregated.
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Third-Party Technologies */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              3. Third-Party Integrations
            </h2>
            <p>
              We integrate select trusted third-party providers strictly for operational fulfillment:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>ImageKit &amp; CDN Networks:</strong> Fast, cached delivery of high-resolution event banners, brand logos, and media assets.
              </li>
              <li>
                <strong>Google Analytics (GA4):</strong> Anonymized metrics on browser performance and uptime reliability.
              </li>
              <li>
                <strong>Lottie &amp; Motion Libraries:</strong> Lightweight vector animations for registration confirmation screens.
              </li>
            </ul>
          </section>

          {/* Section 4: How to Manage and Disable Cookies */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              4. Managing &amp; Disabling Cookies
            </h2>
            <p>
              You have the right to accept or decline cookies. Most web browsers automatically accept cookies by default, but you can modify your browser settings to reject non-essential cookies or clear existing storage caches at any time:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs sm:text-sm">
              <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data.</li>
              <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data.</li>
              <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
              <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions.</li>
            </ul>
            <p className="text-xs text-[#a1a1aa] italic pt-1">
              <em>Please Note: If you choose to disable or block strictly necessary session cookies, critical features of the portal (such as signing in, booking tickets, downloading PDF passes, and accessing your organizer dashboard) will not function.</em>
            </p>
          </section>

          {/* Section 5: Legal Contact */}
          <section className="flex flex-col gap-3 p-5 rounded-xl bg-[#17171a] border border-[#27272e]">
            <h3 className="text-base font-bold text-white">Contact Our Technical &amp; Compliance Helpdesk</h3>
            <p className="text-xs text-[#a1a1aa]">
              For any queries concerning our technical data policies, feel free to contact us:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-indigo-300">
              <a href="tel:+916304218064" className="hover:underline">📞 +91 6304218064</a>
              <a href="tel:+916309917327" className="hover:underline">📞 +91 6309917327</a>
              <a href="mailto:info@studentforge.in" className="hover:underline">✉️ info@studentforge.in</a>
            </div>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
