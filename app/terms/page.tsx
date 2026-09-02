import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Student Forge',
  description:
    'Clear and simple Terms of Service for Student Forge event attendees, organizers, and community members.',
};

export default function TermsOfServicePage() {
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
            Student Forge &bull; Terms of Service
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed text-justify">
            Welcome to Student Forge. These terms explain clearly how our platform, event registrations, passes, and payments work in simple, plain language.
          </p>

          <div className="text-[11px] text-[#5a5a64] pt-1">
            Last Updated: September 2026
          </div>
        </div>

        {/* Quick Support Box */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Have a question about a ticket, event, or payment?</span>
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <a href="tel:+916304218064" className="hover:text-white transition-colors">+91 6304218064</a>
            <span>,</span>
            <a href="tel:+916309917327" className="hover:text-white transition-colors">+91 6309917327</a>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="flex flex-col gap-8 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed pt-2 text-justify">

          {/* Section 1 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              1. About Student Forge
            </h2>
            <p>
              Student Forge Technologies Private Limited provides a digital platform where students, creators, and organizers discover, host, and register for campus events, meetups, workshops, and hackathons.
            </p>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              2. Account &amp; Registration
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>To register for events or access passes, you need to provide accurate contact information (name, email, and phone).</li>
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>You must be at least 18 years old or have parental/guardian consent to participate.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              3. Tickets &amp; Entry Passes
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Once your registration is confirmed, an official pass containing a unique QR code is generated.</li>
              <li>You must present your digital or printed QR pass at the venue entrance for check-in.</li>
              <li>Each ticket pass is valid for one person only unless a group registration option is explicitly booked.</li>
              <li>Tickets cannot be duplicated or resold for unauthorized profit.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              4. Pricing &amp; Payments
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>All event fees are displayed in Indian Rupees (INR - ₹) and include all applicable taxes.</li>
              <li>Paid events are processed through secure UPI payments. You are required to submit your 12-digit transaction reference ID (UTR) to verify your booking.</li>
              <li>There are no hidden convenience fees added during checkout.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              5. Refunds &amp; Cancellations
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li><strong className="text-white">Event Cancelled:</strong> If an event is cancelled by the organizer without a new date, you will receive a 100% full refund within 5 to 7 business days.</li>
              <li><strong className="text-white">Event Rescheduled:</strong> If the date or venue changes, your pass automatically stays valid for the new date. If you cannot attend, you can contact support within 48 hours for a refund.</li>
              <li><strong className="text-white">Duplicate Payments:</strong> If money was deducted multiple times due to a network glitch, we will verify the UTR and refund the extra amount within 24 hours.</li>
              <li><strong className="text-white">No-Shows:</strong> If you miss an event without prior cancellation, tickets are non-refundable due to upfront venue and seating reservations.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              6. Event Rules &amp; Conduct
            </h2>
            <p>
              We want every attendee to have a safe and welcoming experience:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Please treat all attendees, speakers, and venue staff with respect.</li>
              <li>Harassment, abusive behavior, or damage to venue property is strictly prohibited.</li>
              <li>Event organizers reserve the right to remove any person who disrupts the event or violates safety rules.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              7. Privacy &amp; Data Protection
            </h2>
            <p>
              We respect your privacy. We collect your data solely to issue your tickets, verify your admission, and communicate essential event updates. We never sell your personal information to third parties.
            </p>
          </section>

          {/* Section 8 */}
          <section className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              8. Support &amp; Questions
            </h2>
            <p className="text-xs text-[#8a8a90]">
              If you have any questions, need to transfer a pass, or need help with a payment:
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
