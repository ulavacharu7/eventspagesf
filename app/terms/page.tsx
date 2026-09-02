import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Student Forge Technologies Private Limited',
  description:
    'Terms of Service and Event Ticketing Agreement of Student Forge Technologies Private Limited compliant with the Indian Contract Act, 1872 and Information Technology Act, 2000.',
};

export default function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#26262a]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a]">
            Legal Agreement &amp; User Contract &bull; Republic of India
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed">
            Statutory terms and conditions forming a legally binding agreement under the Indian Contract Act, 1872 and the Information Technology Act, 2000 between you (User / Attendee) and Student Forge Technologies Private Limited.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#5a5a64] pt-1">
            <span>Jurisdiction: Hyderabad, Telangana, India</span>
            <span>&bull;</span>
            <span>Last Updated: September 2026</span>
          </div>
        </div>

        {/* Support Note */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Questions concerning our terms or user agreement? Contact support:</span>
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
              1. Acceptance of Terms &amp; Capacity
            </h2>
            <p>
              By accessing, browsing, creating an account, or registering for events via events.studentforge.in, you enter into a legally binding agreement with Student Forge Technologies Private Limited. You represent that you are at least 18 years of age or possess legal guardian consent under Section 11 of the Indian Contract Act, 1872.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              2. Platform Role &amp; Ticketing Service
            </h2>
            <p>
              Student Forge provides digital ticketing infrastructure for campus meetups, tech workshops, conferences, and student hackathons. Individual event hosts and organizers are responsible for venue logistics, scheduling, and on-site management.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              3. Venue Code of Conduct &amp; Admission Rules
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm">
              <li><strong className="text-neutral-200">Valid Pass Required:</strong> Attendees must present a valid Student Forge QR ticket pass along with valid photo ID at venue entry gates.</li>
              <li><strong className="text-neutral-200">Prohibited Conduct:</strong> Disruptive behavior, harassment, and possession of illegal substances are strictly prohibited. Organizers reserve the right to deny admission or remove violators without refund.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              4. Intellectual Property
            </h2>
            <p>
              All software, brand identifiers (Student Forge, INCEPT), designs, logos, and portal source code are the proprietary intellectual property of Student Forge Technologies Private Limited and Studio Redlix, protected under the Copyright Act, 1957 and Trade Marks Act, 1999.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              5. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permissible under Indian law, the Company shall not be liable for indirect, incidental, or consequential damages resulting from event cancellations, personal property loss at venues, or banking network delays.
            </p>
          </section>

          <section className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              6. Governing Law &amp; Jurisdiction
            </h2>
            <p className="text-xs text-[#8a8a90]">
              These Terms and any dispute arising hereunder shall be governed exclusively by the laws of the Republic of India. The courts situated in Hyderabad, Telangana, India shall have sole and exclusive jurisdiction over all proceedings.
            </p>
            <div className="flex flex-col gap-1 text-xs font-mono text-neutral-300 pt-1">
              <span>Support: <a href="tel:+916304218064" className="hover:text-white">+91 6304218064</a>, <a href="tel:+916309917327" className="hover:text-white">+91 6309917327</a></span>
              <span>Email: <a href="mailto:info@studentforge.in" className="hover:text-white">info@studentforge.in</a></span>
            </div>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
