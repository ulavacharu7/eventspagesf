import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Student Forge Technologies Private Limited',
  description:
    'Statutory Privacy Policy of Student Forge Technologies Private Limited compliant with the Digital Personal Data Protection Act, 2023 (DPDPA), Information Technology Act, 2000, and SPDI Rules, 2011.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#26262a]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a]">
            Legal &amp; Regulatory Compliance &bull; Republic of India
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed">
            Statutory privacy notice pursuant to the Digital Personal Data Protection Act, 2023 (DPDPA), the Information Technology Act, 2000 (Section 43A), and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules).
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#5a5a64] pt-1">
            <span>Last Updated: September 2026</span>
            <span>&bull;</span>
            <span>Student Forge Technologies Private Limited</span>
          </div>
        </div>

        {/* Support Note */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Need assistance with privacy or ticketing data? Contact support:</span>
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
            <a href="tel:+916304218064" className="hover:text-white transition-colors">+91 6304218064</a>
            <span>,</span>
            <a href="tel:+916309917327" className="hover:text-white transition-colors">+91 6309917327</a>
          </div>
        </div>

        {/* Policy Body */}
        <div className="flex flex-col gap-8 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed pt-2">

          {/* 1 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              1. Corporate Entity &amp; Data Fiduciary
            </h2>
            <p>
              This portal (<strong className="text-white">events.studentforge.in</strong>) is operated by <strong className="text-white">Student Forge Technologies Private Limited</strong>, an incorporated company based in Hyderabad, Telangana, India. Under the Digital Personal Data Protection Act, 2023 (DPDPA 2023), the Company acts as the Data Fiduciary for personal data collected through this platform. Technical infrastructure and hosting are managed with Studio Redlix.
            </p>
          </section>

          {/* 2 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              2. Categories of Personal Data Collected
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs sm:text-sm">
              <li><strong className="text-neutral-200">Identity &amp; Contact:</strong> Name, verified email address, phone number, college/institution affiliation.</li>
              <li><strong className="text-neutral-200">Payment References:</strong> Payer account name, payment method (UPI), 12-digit Bank UTR / Transaction ID, coupon codes, and discount values. (We do not store card numbers, CVVs, or UPI PINs; transactions are processed through banking networks).</li>
              <li><strong className="text-neutral-200">Event Details:</strong> Dietary options (Veg/Non-Veg) and check-in scan timestamps.</li>
              <li><strong className="text-neutral-200">Technical Logs:</strong> IP addresses and access logs for security and fraud prevention under Section 43A of the IT Act, 2000.</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              3. Purpose and Lawful Basis of Processing
            </h2>
            <p>
              Under Section 4 and 6 of the DPDPA 2023, data is processed based on explicit consent for specified purposes:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm">
              <li>Generating and delivering admission passes with cryptographically unique QR codes.</li>
              <li>Validating payments against bank UTR records to prevent fraud.</li>
              <li>Sending transactional updates, ticket passes, and schedule notices.</li>
              <li>Statutory accounting and tax compliance under Indian laws.</li>
            </ul>
          </section>

          {/* 4 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              4. Data Disclosure &amp; Sharing
            </h2>
            <p>
              We do not sell, monetize, or trade personal data. Data is shared strictly on a need-to-know basis with event organizers for admission management, certified cloud infrastructure providers under data processing terms, and statutory authorities when legally required by Indian judicial orders.
            </p>
          </section>

          {/* 5 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              5. Security and Encryption
            </h2>
            <p>
              In compliance with Rule 8 of the SPDI Rules, 2011, we employ TLS 1.3 encryption in transit, AES-256 database storage encryption, role-based access controls, and digital signature checks on QR entry passes.
            </p>
          </section>

          {/* 6 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              6. Rights of the Data Principal
            </h2>
            <p>
              Under the DPDPA 2023, you hold the right to access a summary of your data, request correction of inaccurate records, request erasure (subject to statutory tax retention limits), nominate a representative, and seek grievance redressal.
            </p>
          </section>

          {/* 7 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              7. Data Retention
            </h2>
            <p>
              Personal data is retained only for as long as necessary for event operations or to satisfy statutory accounting and tax retention periods under the Companies Act, 2013 and GST Act, 2017.
            </p>
          </section>

          {/* 8 */}
          <section className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              8. Grievance Officer &amp; Redressal
            </h2>
            <p className="text-xs text-[#8a8a90]">
              In accordance with the IT Act, 2000 and DPDPA 2023, contact our Grievance Officer for privacy inquiries:
            </p>
            <div className="flex flex-col gap-1 text-xs font-mono text-neutral-300 pt-1">
              <span>Student Forge Technologies Private Limited</span>
              <span>Hyderabad, Telangana – 500081, India</span>
              <span>Helpline: <a href="tel:+916304218064" className="hover:text-white">+91 6304218064</a>, <a href="tel:+916309917327" className="hover:text-white">+91 6309917327</a></span>
              <span>Email: <a href="mailto:info@studentforge.in" className="hover:text-white">info@studentforge.in</a></span>
            </div>
            <p className="text-[11px] text-[#5a5a64] pt-1">
              Statutory timeline: Inquiries acknowledged within 24 hours and addressed within 30 days.
            </p>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
