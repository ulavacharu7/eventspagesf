import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Student Forge Technologies Private Limited',
  description:
    'Terms of Service and Event Ticketing Agreement of Student Forge Technologies Private Limited compliant with the Indian Contract Act, 1872, Information Technology Act, 2000, and Indian consumer jurisprudence.',
};

export default function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen bg-[#121214] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Subtle Background Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#232329_1px,transparent_1px),linear-gradient(to_bottom,#232329_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 z-10 relative">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3 pb-8 border-b border-[#26262d]">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#a1a1aa]">
            <span>Legal Agreement &amp; User Contract</span>
            <span>•</span>
            <span>Republic of India</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-tight">
            Terms of Service
          </h1>

          <p className="text-sm sm:text-base text-[#a1a1aa] font-normal leading-relaxed">
            Statutory terms and conditions forming a legally binding agreement under the <strong>Indian Contract Act, 1872</strong> and the <strong>Information Technology Act, 2000</strong> between you (&ldquo;User&rdquo; or &ldquo;Attendee&rdquo;) and <strong>Student Forge Technologies Private Limited</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#71717a] pt-2">
            <span>Jurisdiction: Hyderabad, Telangana, India</span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
          </div>
        </div>

        {/* Support Alert Box */}
        <div className="my-8 p-4 sm:p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-white">Need help or clarification on our terms, tickets, or policies?</span>
            <span className="text-indigo-300/90 text-xs">Reach out to our customer support &amp; legal helpline:</span>
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

        {/* Main Content */}
        <div className="flex flex-col gap-10 text-sm sm:text-[15px] text-[#d4d4d8] leading-relaxed font-normal pt-4">

          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              1. Acceptance of Terms &amp; Contractual Capacity
            </h2>
            <p>
              By accessing, browsing, creating an account on, or registering for events via <strong>events.studentforge.in</strong> (the &ldquo;Platform&rdquo;), you enter into a legally enforceable agreement with <strong>Student Forge Technologies Private Limited</strong>.
            </p>
            <p>
              You represent and warrant that you are at least 18 years of age and possess full legal capacity to enter into a contract under Section 11 of the Indian Contract Act, 1872. If you are registering on behalf of a minor student or an educational institution, you warrant that you hold authorized guardian or institutional authority to bind such parties.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              2. Platform Role &amp; Ticketing Service
            </h2>
            <p>
              Student Forge provides technological infrastructure for publishing, discovering, booking, and verifying campus workshops, tech conferences, hackathons, and networking meetups. Unless explicitly designated as a Student Forge flagship production, individual event logistics, speaker rosters, and venue facilities are organized by respective event hosts.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              3. Venue Code of Conduct &amp; Admission Rules
            </h2>
            <p>
              All event attendees are required to abide by professional standards of conduct:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>Valid Pass Mandatory:</strong> Every attendee must present an official Student Forge digital or printed QR pass at the entrance gate alongside a valid government/college photo identity proof.
              </li>
              <li>
                <strong>Prohibited Substances &amp; Conduct:</strong> Possession of hazardous materials, illegal substances, or weapons, or engaging in harassment, discrimination, or disorderly conduct is strictly prohibited and will result in immediate expulsion without refund and potential police reporting.
              </li>
              <li>
                <strong>Organizer Right to Refuse Admission:</strong> Event hosts and security personnel reserve the reasonable right to deny entry to individuals who violate safety protocols or display aggressive or intoxicating behavior.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              4. Intellectual Property Rights
            </h2>
            <p>
              All proprietary algorithms, brand emblems, trade names (&ldquo;Student Forge&rdquo;, &ldquo;INCEPT&rdquo;), UI/UX designs, source code, and promotional media on this portal are the exclusive intellectual property of Student Forge Technologies Private Limited and Studio Redlix, protected under the <strong>Copyright Act, 1957</strong> and the <strong>Trade Marks Act, 1999</strong>. Unauthorized scraping, copying, reverse-engineering, or commercial reproduction is strictly prohibited.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              5. Limitation of Liability &amp; Indemnity
            </h2>
            <p>
              To the maximum extent permissible under Indian law, Student Forge Technologies Private Limited shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from event cancellations, personal property loss at third-party venues, or network payment latency. You agree to defend, indemnify, and hold harmless the Company, its directors, officers, and technical operators from any third-party claims arising out of your breach of these Terms or applicable laws.
            </p>
          </section>

          <section className="flex flex-col gap-3 p-6 rounded-2xl bg-[#161619] border border-[#2b2b33]">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#2b2b33] pb-2">
              6. Governing Law &amp; Exclusive Jurisdiction
            </h2>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              These Terms, transactions, and any dispute or claim arising out of or in connection with them shall be governed by, construed, and interpreted in accordance with the <strong>laws of the Republic of India</strong>. The civil and commercial courts situated exclusively in <strong>Hyderabad, Telangana, India</strong> shall have sole and exclusive jurisdiction over all disputes.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-indigo-300 pt-2">
              <span>Support Lines: +91 6304218064 / +91 6309917327</span>
              <span>•</span>
              <span>Official Email: info@studentforge.in</span>
            </div>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
