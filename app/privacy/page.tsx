import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Student Forge',
  description:
    'Clear and simple Privacy Policy explaining how Student Forge protects and handles your personal information.',
};

export default function PrivacyPolicyPage() {
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
            Student Forge &bull; Privacy Policy
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed text-justify">
            Your privacy matters to us. This page explains what information we collect, why we need it, and how we keep it safe in plain, simple language.
          </p>

          <div className="text-[11px] text-[#5a5a64] pt-1">
            Last Updated: September 2026
          </div>
        </div>

        {/* Quick Support Box */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Have a question about your account or personal data?</span>
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
              1. What Information We Collect
            </h2>
            <p>
              We only collect information necessary to issue your tickets and run events smoothly:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li><strong className="text-white">Contact Info:</strong> Your name, email address, phone number, and college/organization.</li>
              <li><strong className="text-white">Payment Details:</strong> Payer name, UPI transaction ID (UTR), and coupon codes used. We never store bank PINs, card CVVs, or bank passwords.</li>
              <li><strong className="text-white">Event Preferences:</strong> Food preferences (Veg/Non-Veg) and attendance check-in timestamps.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Generating your event admission passes with scannable QR codes.</li>
              <li>Sending ticket confirmations, PDFs, venue reminders, and schedule updates.</li>
              <li>Verifying UPI payments against bank transaction records to confirm your booking.</li>
              <li>Preventing spam, bot registrations, and duplicate accounts.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              3. We Never Sell Your Data
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party advertisers or marketing agencies. Your data is only shared with the organizers of the specific event you registered for so they can admit you at the venue.
            </p>
          </section>

          {/* Section 4 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              4. Data Security &amp; Protection
            </h2>
            <p>
              We use industry-standard encryption (TLS/HTTPS) to protect data during transmission and encrypted database storage to safeguard your records against unauthorized access.
            </p>
          </section>

          {/* Section 5 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              5. Your Rights
            </h2>
            <p>
              You have full control over your data. You can request to view, update, or delete your account information at any time by contacting our support team.
            </p>
          </section>

          {/* Section 6 */}
          <section className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              6. Privacy Support &amp; Grievances
            </h2>
            <p className="text-xs text-[#8a8a90]">
              If you have any privacy questions, data requests, or concerns, please reach out to us:
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
