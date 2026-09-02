import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Payment Terms, Pricing & Refund Policy | Student Forge Technologies Private Limited',
  description:
    'Payment Terms, Pricing Structure, UPI Verification Protocols, and Refund & Cancellation Policy of Student Forge Technologies Private Limited compliant with the Consumer Protection Act, 2019, RBI Guidelines, and GST Regulations.',
};

export default function PaymentTermsPage() {
  return (
    <main className="relative min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#26262a]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a]">
            Financial Terms &amp; Consumer Protection &bull; Republic of India
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Payment Terms, Pricing &amp; Refund Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed">
            Statutory commercial terms governing event ticketing, UPI payments, transaction validation, pricing disclosures, and refund mechanisms pursuant to the Consumer Protection Act, 2019, Consumer Protection (E-Commerce) Rules, 2020, and RBI Payment and Settlement Systems Guidelines.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#5a5a64] pt-1">
            <span>Corporate Entity: Student Forge Technologies Private Limited</span>
            <span>&bull;</span>
            <span>Currency: Indian National Rupee (INR - ₹)</span>
          </div>
        </div>

        {/* Support Note */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Facing issues with a payment, double debit, or ticket issuance? Contact our payment desk:</span>
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
              1. Pricing Structure &amp; Tax Disclosures (GST Compliance)
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm">
              <li><strong className="text-neutral-200">Currency:</strong> All ticket amounts, fees, and pass prices on this platform are specified in Indian Rupees (INR - ₹).</li>
              <li><strong className="text-neutral-200">Inclusive Pricing:</strong> The final checkout amount includes all applicable taxes (Central GST, State GST, Integrated GST) unless explicitly stated. No hidden processing surcharges are added at checkout.</li>
              <li><strong className="text-neutral-200">Coupons &amp; Discounts:</strong> Valid promotional discount codes are applied in real time to deduct from the base ticket amount before payment submission.</li>
            </ul>
          </section>

          {/* 2 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              2. Payment Channels &amp; UPI Verification Protocol
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs sm:text-sm">
              <li><strong className="text-neutral-200">Supported Methods:</strong> Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay, and all major Indian banking UPI apps.</li>
              <li><strong className="text-neutral-200">UTR / Reference ID Validation:</strong> Registrants must enter the valid 12-digit Bank UTR / UPI Reference ID and payer account name in the checkout form after payment.</li>
              <li><strong className="text-neutral-200">Verification &amp; Fraud Prevention:</strong> Submitted UTRs are matched against bank credit records. Submitting fabricated or duplicate transaction IDs constitutes fraud under applicable Indian laws and results in immediate cancellation and platform blacklisting.</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              3. Ticket Pass Issuance &amp; Delivery
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm">
              <li><strong className="text-neutral-200">Digital Pass Delivery:</strong> Once approved, an official digital admission pass containing a scannable QR code is generated.</li>
              <li><strong className="text-neutral-200">Email &amp; PDF Pass:</strong> A high-definition PDF pass is automatically sent to the verified email address.</li>
              <li><strong className="text-neutral-200">Dashboard Retrieval:</strong> Passes are accessible at any time under the attendee&apos;s authenticated Dashboard.</li>
            </ul>
          </section>

          {/* 4 */}
          <section className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              4. Refund &amp; Cancellation Policy
            </h2>
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <div>
                <strong className="text-white block mb-0.5">A. Event Cancellation by Organizer (Full Refund):</strong>
                <span className="text-[#8a8a90]">If an event is cancelled without a rescheduled date, all purchasers receive a 100% full refund initiated within 48 hours and credited back within 5 to 7 banking business days.</span>
              </div>
              <div className="pt-2 border-t border-[#26262a]">
                <strong className="text-white block mb-0.5">B. Event Rescheduling (Date or Venue Change):</strong>
                <span className="text-[#8a8a90]">Passes remain valid for the rescheduled date. Attendees unable to attend may request a refund within 48 hours of the reschedule notice.</span>
              </div>
              <div className="pt-2 border-t border-[#26262a]">
                <strong className="text-white block mb-0.5">C. Double Debit / Duplicate Payment Claims:</strong>
                <span className="text-[#8a8a90]">In case of duplicate bank deductions or network timeouts, our payment desk verifies the duplicate UTR and initiates a direct refund within 24 hours.</span>
              </div>
              <div className="pt-2 border-t border-[#26262a]">
                <strong className="text-white block mb-0.5">D. Voluntary Cancellations &amp; No-Shows:</strong>
                <span className="text-[#8a8a90]">Due to upfront venue seating and catering allocations, tickets are non-refundable for individual no-shows unless permitted by specific event terms. Pass transfers to peers are accommodated upon advance notice.</span>
              </div>
            </div>
          </section>

          {/* 5 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              5. Force Majeure
            </h2>
            <p>
              Performance obligations are suspended in the event of Force Majeure circumstances beyond reasonable control (natural disasters, state emergency lockdowns, utility outages). In such cases, events will be rescheduled to the earliest feasible date.
            </p>
          </section>

          {/* 6 */}
          <section className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              6. Payment Support Desk &amp; Inquiries
            </h2>
            <p className="text-xs text-[#8a8a90]">
              For payment assistance, UTR confirmations, or refund requests, contact our dedicated payment desk:
            </p>
            <div className="flex flex-col gap-1 text-xs font-mono text-neutral-300 pt-1">
              <span>Student Forge Technologies Private Limited</span>
              <span>Hyderabad, Telangana – 500081, India</span>
              <span>Helpline: <a href="tel:+916304218064" className="hover:text-white">+91 6304218064</a>, <a href="tel:+916309917327" className="hover:text-white">+91 6309917327</a> (Mon–Sun, 9 AM – 9 PM IST)</span>
              <span>Email: <a href="mailto:events.studentforge@gmail.com" className="hover:text-white">events.studentforge@gmail.com</a></span>
            </div>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
