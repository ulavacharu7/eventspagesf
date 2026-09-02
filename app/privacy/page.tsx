import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Student Forge Technologies Private Limited',
  description:
    'Comprehensive Privacy Policy of Student Forge Technologies Private Limited compliant with the Digital Personal Data Protection Act, 2023 (DPDPA), Information Technology Act, 2000, and SPDI Rules, 2011.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#121214] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Subtle Background Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#232329_1px,transparent_1px),linear-gradient(to_bottom,#232329_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 z-10 relative">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3 pb-8 border-b border-[#26262d]">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#a1a1aa]">
            <span>Legal &amp; Regulatory Compliance</span>
            <span>•</span>
            <span>Republic of India</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-tight">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-[#a1a1aa] font-normal leading-relaxed">
            Statutory privacy notice pursuant to the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, the <strong>Information Technology Act, 2000 (Section 43A)</strong>, and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#71717a] pt-2">
            <span>Effective Date: 1st January 2026</span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Version: 2.4 (Statutory Compliant)</span>
          </div>
        </div>

        {/* Support Alert Box */}
        <div className="my-8 p-4 sm:p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-white">Need immediate assistance with ticketing, account, or privacy?</span>
            <span className="text-indigo-300/90 text-xs">Reach our dedicated Grievance &amp; Support Desk directly:</span>
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

        {/* Main Legal Content */}
        <div className="flex flex-col gap-10 text-sm sm:text-[15px] text-[#d4d4d8] leading-relaxed font-normal pt-4">

          {/* Section 1: Data Fiduciary Details */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              1. Corporate Entity &amp; Data Fiduciary Details
            </h2>
            <p>
              This digital platform, located at <strong>events.studentforge.in</strong> (and its associated parent domain <strong>studentforge.in</strong>), is owned, operated, and controlled by <strong>STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED</strong> (&ldquo;Company&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo;, or &ldquo;Our&rdquo;), a company duly incorporated under the Indian Companies Act, 2013, with its registered corporate operations situated in Hyderabad, Telangana, India.
            </p>
            <p>
              For the purposes of the <strong>Digital Personal Data Protection Act, 2023 (DPDPA 2023)</strong> and applicable Indian data jurisprudence, Student Forge Technologies Private Limited acts as the <strong>Data Fiduciary</strong> in respect of all personal data collected through this portal. Portal hosting, engineering, and digital infrastructure services are managed in collaboration with <strong>Studio Redlix</strong>.
            </p>
          </section>

          {/* Section 2: Categories of Data Collected */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              2. Categories of Personal Data Collected
            </h2>
            <p>
              We collect and process only such personal data as is strictly necessary, adequate, and relevant for fulfilling specified event ticketing, admission verification, and account communication purposes:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>Identity &amp; Contact Data:</strong> Full legal name, verified email address, mobile phone number, college/institution affiliation, academic degree, or employer/startup name.
              </li>
              <li>
                <strong>Transaction &amp; Billing Data:</strong> Payment method (UPI, Net Banking), payer account name, 12-digit Unique Transaction Reference (UTR / UPI Txn ID), payment timestamps, coupon codes applied, and discounted amounts. <em>(Note: We do NOT store sensitive card numbers, CVVs, or UPI PINs; all banking processing is handled strictly via RBI-licensed payment aggregators and banking rails).</em>
              </li>
              <li>
                <strong>Event Specific Information:</strong> Dietary preferences (e.g., Veg / Non-Veg options for catering), custom questionnaire responses required by specific event organizers, and check-in / gate scan timestamps.
              </li>
              <li>
                <strong>Technical &amp; Log Metadata:</strong> IP addresses, browser user agent, device operating system, session tokens, and access logs collected for cybersecurity and fraud mitigation under Section 43A of the Information Technology Act, 2000.
              </li>
            </ul>
          </section>

          {/* Section 3: Legal Basis & Purpose of Processing */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              3. Lawful Basis &amp; Purposes of Processing
            </h2>
            <p>
              Under Section 4 and Section 6 of the DPDPA 2023, we process personal data strictly based on <strong>explicit, informed, and unambiguous consent</strong> provided by the Data Principal (User) when creating an account or registering for an event, or for legitimate legal uses:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Facilitating event registration, seat capacity validation, and ticketing operations.</li>
              <li>Generating cryptographically unique admission passes and scannable verification QR codes.</li>
              <li>Verifying payment transactions against bank UTR numbers to prevent fraud and unapproved entry.</li>
              <li>Dispatching mandatory transactional notices, ticket PDFs, schedule updates, or event rescheduling alerts via email and SMS.</li>
              <li>Complying with statutory reporting, accounting, tax audits (GST &amp; Income Tax), and lawful requests from Indian law enforcement authorities.</li>
            </ul>
          </section>

          {/* Section 4: Data Sharing & Third-Party Processors */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              4. Data Disclosure &amp; Third-Party Processing
            </h2>
            <p>
              We maintain a strict non-disclosure policy. <strong>We do NOT sell, rent, monetize, or trade your personal data to any third-party advertisers or marketing agencies.</strong>
            </p>
            <p>
              Your personal information is shared strictly with the following authorized entities on a need-to-know basis:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>Event Organizers &amp; Venue Security:</strong> Attendee name, check-in status, and ticket codes are made accessible to authorized event administrators for gate admission and crowd safety management.
              </li>
              <li>
                <strong>Infrastructure &amp; Communication Providers:</strong> Cloud hosting infrastructure, secure database providers, Redis caching systems, and transactional email gateways (e.g., Resend, SMTP) operating under strict data processing agreements.
              </li>
              <li>
                <strong>Judicial &amp; Statutory Authorities:</strong> When mandated by court subpoenas, warrants, or orders issued by Indian judicial courts, police authorities, or statutory bodies under the Code of Criminal Procedure, 1973 or Bharatiya Nagarik Suraksha Sanhita, 2023.
              </li>
            </ul>
          </section>

          {/* Section 5: Data Security & Storage */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              5. Reasonable Security Practices &amp; Encryption
            </h2>
            <p>
              In strict adherence to Rule 8 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, we implement industry-standard administrative, physical, and technological security controls:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>End-to-end transport layer encryption (TLS 1.3 / HTTPS) for all data in transit.</li>
              <li>AES-256 bit encrypted storage for relational databases and server infrastructure.</li>
              <li>Strict role-based access control (RBAC), multi-factor authentication for administrators, and immutable audit logging.</li>
              <li>Cryptographic digital signing of QR passes to prevent counterfeit ticket duplication.</li>
            </ul>
          </section>

          {/* Section 6: Data Principal Rights */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              6. Rights of the Data Principal (User Rights)
            </h2>
            <p>
              Under Chapter III of the Digital Personal Data Protection Act, 2023, every user residing in India holds the following statutory rights:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>Right to Access Information:</strong> Obtain confirmation whether your personal data is being processed, along with a summary of data categories and processing activities.</li>
              <li><strong>Right to Correction &amp; Updation:</strong> Request immediate correction of inaccurate, incomplete, or outdated personal details.</li>
              <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request deletion of your personal data when it is no longer required for the purpose for which it was collected, subject to statutory retention obligations under Indian tax and corporate laws.</li>
              <li><strong>Right of Grievance Redressal:</strong> Avail expeditious redressal of any data privacy complaints through our designated Grievance Officer.</li>
              <li><strong>Right to Nominate:</strong> Nominate an individual who shall exercise your data rights in the event of death or incapacity.</li>
            </ul>
          </section>

          {/* Section 7: Data Retention Policy */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              7. Data Retention &amp; Disposal
            </h2>
            <p>
              We retain personal data for only such period as is necessary to fulfill the operational ticketing purpose or to comply with applicable statutory retention requirements under the <strong>Companies Act, 2013</strong> and the <strong>Goods and Services Tax (GST) Act, 2017</strong> (which mandate financial transaction record keeping for up to 8 years). Non-financial transient logs and session data are periodically purged every 90 to 180 days.
            </p>
          </section>

          {/* Section 8: Statutory Grievance Redressal Mechanism */}
          <section className="flex flex-col gap-4 p-6 rounded-2xl bg-[#1a1a1e] border border-[#2e2e36]">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#2e2e36] pb-2 flex items-center justify-between">
              <span>8. Statutory Grievance Officer &amp; Dispute Redressal</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              In accordance with the <strong>Information Technology Act, 2000</strong> and Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the <strong>DPDPA 2023</strong>, the contact details of the designated Grievance Officer are set forth below:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#141417] border border-[#26262d]">
                <span className="text-[11px] font-mono text-[#71717a] uppercase">Designated Officer</span>
                <span className="font-bold text-white text-sm">Grievance &amp; Compliance Officer</span>
                <span className="text-[#a1a1aa] text-xs">Student Forge Technologies Pvt. Ltd.</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#141417] border border-[#26262d]">
                <span className="text-[11px] font-mono text-[#71717a] uppercase">Registered Address</span>
                <span className="font-medium text-white text-xs leading-relaxed">
                  Student Forge Technologies Private Limited,<br />
                  Hyderabad, Telangana – 500081, India.
                </span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#141417] border border-[#26262d]">
                <span className="text-[11px] font-mono text-[#71717a] uppercase">Direct Helplines</span>
                <div className="flex flex-col gap-1 font-mono text-xs text-indigo-300">
                  <a href="tel:+916304218064" className="hover:underline flex items-center gap-1.5">
                    📞 +91 6304218064
                  </a>
                  <a href="tel:+916309917327" className="hover:underline flex items-center gap-1.5">
                    📞 +91 6309917327
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#141417] border border-[#26262d]">
                <span className="text-[11px] font-mono text-[#71717a] uppercase">Official Email Inquiries</span>
                <div className="flex flex-col gap-1 font-mono text-xs text-indigo-300">
                  <a href="mailto:info@studentforge.in" className="hover:underline">
                    ✉️ info@studentforge.in
                  </a>
                  <a href="mailto:support@studentforge.in" className="hover:underline">
                    ✉️ support@studentforge.in
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#71717a] pt-1">
              <strong>Statutory Redressal Timeline:</strong> All privacy-related grievances and formal inquiries will be acknowledged within twenty-four (24) hours and conclusively resolved within thirty (30) calendar days from receipt.
            </p>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
