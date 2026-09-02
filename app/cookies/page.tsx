import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cookies Policy | Student Forge',
  description:
    'Clear and simple Cookies & Local Storage Policy explaining how Student Forge uses essential storage to manage logins, passes, and security.',
};

export default function CookiesPolicyPage() {
  return (
    <main
      className="relative min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased selection:bg-neutral-800 selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Navbar />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#26262a]">
          <span className="text-[11px] uppercase tracking-wider text-[#71717a] font-medium">
            Student Forge &bull; Cookies &amp; Storage Policy
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Cookies &amp; Storage Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed text-justify">
            This policy explains in simple terms how we use cookies and browser storage to keep you signed in, deliver your event passes, and maintain platform security.
          </p>

          <div className="text-[11px] text-[#5a5a64] pt-1">
            Last Updated: September 2026
          </div>
        </div>

        {/* Quick Support Box */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Have questions about how your browser data is stored?</span>
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <a href="tel:+916304218064" className="hover:text-white transition-colors">+91 6304218064</a>
            <span>,</span>
            <a href="tel:+916309917327" className="hover:text-white transition-colors">+91 6309917327</a>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="flex flex-col gap-8 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed pt-2 text-justify">

          {/* Section 1 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              1. What Are Cookies and Local Storage?
            </h2>
            <p>
              Cookies and local storage are small pieces of text stored on your browser when you visit a website. They help the website remember who you are, keep you signed in, and prevent you from having to re-enter your details every time you reload the page.
            </p>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              2. How We Use Them
            </h2>
            <p>
              We only use cookies and storage for practical, essential reasons:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li><strong className="text-white">Keeping You Signed In:</strong> Storing your secure session token so you stay logged into your student or organizer account.</li>
              <li><strong className="text-white">Ticket Passes &amp; Check-In:</strong> Loading your generated ticket passes and QR codes quickly on your device.</li>
              <li><strong className="text-white">Security &amp; Fraud Prevention:</strong> Preventing automated spam bots and protecting your account from unauthorized access.</li>
              <li><strong className="text-white">Remembering Preferences:</strong> Remembering your theme, language, and notification settings.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              3. The Types of Cookies We Use
            </h2>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1">
                <span className="font-medium text-white text-xs sm:text-sm">A. Essential Cookies (Strictly Necessary)</span>
                <p className="text-xs text-[#8a8a90]">
                  These are required for the website to work. They handle authentication, form submissions, and ticket security. You cannot turn these off without breaking the site.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1">
                <span className="font-medium text-white text-xs sm:text-sm">B. Preference Storage</span>
                <p className="text-xs text-[#8a8a90]">
                  Saves your display settings and draft registration info so you do not lose your place if you refresh.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1">
                <span className="font-medium text-white text-xs sm:text-sm">C. Basic Performance Analytics</span>
                <p className="text-xs text-[#8a8a90]">
                  Anonymously measures page load speeds and visitor counts so we can keep the platform fast and reliable. We never track your personal browsing outside Student Forge.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              4. We Do Not Sell Your Data
            </h2>
            <p>
              We do not use third-party advertising cookies or tracking networks. We will never sell, rent, or trade your browser data to advertisers or data brokers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              5. Managing Your Cookies
            </h2>
            <p>
              You can clear or block cookies at any time through your browser settings (Chrome, Safari, Firefox, Edge). Keep in mind that blocking essential cookies will log you out and prevent you from booking or accessing tickets.
            </p>
          </section>

          {/* Section 6 */}
          <section className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              6. Questions &amp; Contact
            </h2>
            <p className="text-xs text-[#8a8a90]">
              If you have any questions regarding our storage practices or technical policies:
            </p>
            <div className="flex flex-col gap-1 text-xs text-neutral-300 pt-1">
              <span>Student Forge Technologies Private Limited</span>
              <span>Hyderabad, Telangana, India</span>
              <span>Phone: <a href="tel:+916304218064" className="hover:text-white">+91 6304218064</a>, <a href="tel:+916309917327" className="hover:text-white">+91 6309917327</a></span>
              <span>Email: <a href="mailto:events.studentforge@gmail.com" className="hover:text-white">events.studentforge@gmail.com</a></span>
            </div>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
