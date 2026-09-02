import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Payment Terms, Pricing & Refund Policy | Student Forge Technologies Private Limited',
  description:
    'Official Payment Terms, Pricing Structure, UPI Verification Protocols, and Refund & Cancellation Policy of Student Forge Technologies Private Limited compliant with the Consumer Protection Act, 2019, RBI Guidelines, and GST Regulations.',
};

export default function PaymentTermsPage() {
  return (
    <main className="relative min-h-screen bg-[#121214] text-white flex flex-col justify-between antialiased font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Background Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#232329_1px,transparent_1px),linear-gradient(to_bottom,#232329_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 z-10 relative">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3 pb-8 border-b border-[#26262d]">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#a1a1aa]">
            <span>Financial Compliance &amp; Consumer Protection</span>
            <span>•</span>
            <span>Republic of India</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-tight">
            Payment Terms, Pricing &amp; Refund Policy
          </h1>

          <p className="text-sm sm:text-base text-[#a1a1aa] font-normal leading-relaxed">
            Statutory commercial terms governing event ticketing, UPI payments, transaction validation, pricing disclosures, and refund mechanisms pursuant to the <strong>Consumer Protection Act, 2019</strong>, <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, and <strong>Reserve Bank of India (RBI) Payment and Settlement Systems Guidelines</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#71717a] pt-2">
            <span>Corporate Entity: Student Forge Technologies Private Limited</span>
            <span>•</span>
            <span>Currency: Indian National Rupee (INR - ₹)</span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
          </div>
        </div>

        {/* Support Alert Box */}
        <div className="my-8 p-4 sm:p-5 rounded-xl bg-amber-950/25 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-white">Facing issues with a payment, double deduction, or ticket issuance?</span>
            <span className="text-amber-300/90 text-xs">Call our Dedicated Payment Desk for immediate resolution within 1–2 hours:</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <a href="tel:+916304218064" className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors">
              +91 6304218064
            </a>
            <a href="tel:+916309917327" className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors">
              +91 6309917327
            </a>
          </div>
        </div>

        {/* Main Legal Content */}
        <div className="flex flex-col gap-10 text-sm sm:text-[15px] text-[#d4d4d8] leading-relaxed font-normal pt-4">

          {/* Section 1: Commercial & Pricing Disclosures */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              1. Pricing Structure &amp; Tax Disclosures (GST Compliance)
            </h2>
            <p>
              In compliance with Rule 4(11) of the Consumer Protection (E-Commerce) Rules, 2020 and Indian Goods and Services Tax (GST) laws:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>Currency of Transaction:</strong> All ticket prices, pass fees, and service charges displayed on this platform are stated in <strong>Indian Rupees (INR - ₹)</strong>.
              </li>
              <li>
                <strong>Transparent Pricing:</strong> The final checkout amount displayed on the order summary includes all applicable taxes (Central GST, State GST, or Integrated GST) unless explicitly itemized otherwise. There are no hidden platform convenience surcharges or surge fees added at checkout.
              </li>
              <li>
                <strong>Coupon Codes &amp; Promotional Discounts:</strong> When a valid promotional discount or coupon code is redeemed, the discount is calculated in real-time and deducted directly from the payable base ticket price before payment authorization.
              </li>
            </ul>
          </section>

          {/* Section 2: Authorized Payment Methods & UPI Verification */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              2. Authorized Payment Channels &amp; UPI Verification Protocol
            </h2>
            <p>
              To maintain the highest level of security and eliminate intermediary gateway markups for students and creators, payments are processed via official <strong>Unified Payments Interface (UPI)</strong> and direct banking rails:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>Supported UPI Applications:</strong> Google Pay (GPay), PhonePe, Paytm, BHIM UPI, Cred, Amazon Pay, and all major Indian banking UPI applications.
              </li>
              <li>
                <strong>Unique Transaction Reference (UTR) Validation:</strong> Upon completing the UPI transfer to the designated merchant account, the payer is required to submit the official <strong>12-digit Bank UTR / UPI Reference ID</strong> and account name in the checkout form.
              </li>
              <li>
                <strong>Verification &amp; Fraud Prevention:</strong> Our automated accounting system and finance staff verify the entered UTR against the incoming bank credit ledger to ensure authenticity before conferring final admission approval. Any submission of fabricated, altered, or duplicate UTR numbers constitutes fraud under Section 420 of the Indian Penal Code, 1860 / Bharatiya Nyaya Sanhita, 2023, and results in instant cancellation of the pass and platform blacklisting.
              </li>
            </ul>
          </section>

          {/* Section 3: Ticket Issuance & Delivery Guarantee */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              3. Ticket Pass Issuance &amp; Digital Delivery Guarantee
            </h2>
            <p>
              Student Forge guarantees prompt digital delivery of all validly purchased passes:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>Instant Digital Pass:</strong> Immediately upon validation of payment or automated approval, a digital admission pass featuring a tamper-proof scannable QR code and unique alphanumeric ticket identifier is issued.
              </li>
              <li>
                <strong>Email Confirmation &amp; PDF Pass:</strong> A high-definition PDF admission ticket pass is automatically dispatched to the registrant&rsquo;s verified email address.
              </li>
              <li>
                <strong>Dashboard Access:</strong> Registrations and passes are permanently retrievable under the attendee&rsquo;s authenticated Dashboard at <code>events.studentforge.in/dashboard?tab=my-tickets</code>.
              </li>
            </ul>
          </section>

          {/* Section 4: Refund, Cancellation & Rescheduling Policy */}
          <section className="flex flex-col gap-4 p-6 rounded-2xl bg-[#161619] border border-[#2b2b33]">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#2b2b33] pb-2">
              4. Comprehensive Refund &amp; Cancellation Policy
            </h2>

            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-emerald-400">A. Event Cancellation by Organizer (100% Guaranteed Refund):</span>
                <p className="text-[#a1a1aa] leading-relaxed">
                  If an event is cancelled by the organizer or Student Forge Technologies Private Limited and is not rescheduled, all ticket purchasers will receive a <strong>100% full refund</strong> of the ticket amount. Refunds will be initiated within forty-eight (48) hours and credited back to the original source account within 5 to 7 banking business days.
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-[#26262d]">
                <span className="font-bold text-blue-400">B. Event Rescheduling (Date or Venue Change):</span>
                <p className="text-[#a1a1aa] leading-relaxed">
                  In the event of a postponement or change of venue, tickets remain automatically valid for the rescheduled date. If an attendee is unable to attend the rescheduled date, they may request a refund by notifying support within forty-eight (48) hours of the rescheduling notice.
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-[#26262d]">
                <span className="font-bold text-amber-400">C. Double Debit / Duplicate Payment Grievances:</span>
                <p className="text-[#a1a1aa] leading-relaxed">
                  If your bank account was debited multiple times due to a network glitch or session timeout, or if funds were deducted without a ticket pass being generated, our payment desk will verify the duplicate UTRs and initiate a direct refund of the excess debit within <strong>twenty-four (24) hours</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-[#26262d]">
                <span className="font-bold text-rose-400">D. Attendee Voluntary Cancellations &amp; No-Shows:</span>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Due to upfront catering, venue capacity reservations, and attendee kit allocations, tickets are generally non-refundable for personal no-shows unless the specific event organizer terms permit cancellation. However, pass transfers to another verified peer are permitted upon advance written request to support.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Force Majeure */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#26262d] pb-2">
              5. Force Majeure Exclusions
            </h2>
            <p>
              Neither Student Forge Technologies Private Limited nor the event hosts shall be held in breach of their contractual obligations where performance is impeded by circumstances beyond reasonable control (&ldquo;Force Majeure&rdquo;), including acts of God, extreme natural calamities, state government health lockdowns, communal unrest, or municipal utility blackouts. In such instances, events will be rescheduled to the earliest feasible date.
            </p>
          </section>

          {/* Section 6: Payment Nodal Officer & Dispute Desk */}
          <section className="flex flex-col gap-4 p-6 rounded-2xl bg-[#1a1a1e] border border-[#2e2e36]">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-[#2e2e36] pb-2 flex items-center justify-between">
              <span>6. Payment Support Desk &amp; Nodal Grievance Officer</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Fast Response</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              For all payment failures, UTR confirmations, invoice generation, or refund claims, please contact our dedicated financial grievance desk directly:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#141417] border border-[#26262d]">
                <span className="text-[11px] font-mono text-[#71717a] uppercase">Immediate Phone &amp; WhatsApp Helplines</span>
                <div className="flex flex-col gap-1 font-mono text-xs text-amber-300">
                  <a href="tel:+916304218064" className="hover:underline flex items-center gap-1.5 font-bold">
                    📞 +91 6304218064
                  </a>
                  <a href="tel:+916309917327" className="hover:underline flex items-center gap-1.5 font-bold">
                    📞 +91 6309917327
                  </a>
                </div>
                <span className="text-[11px] text-[#71717a] mt-1">Operating Hours: Monday – Sunday, 9:00 AM – 9:00 PM IST</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#141417] border border-[#26262d]">
                <span className="text-[11px] font-mono text-[#71717a] uppercase">Payment Desk Emails</span>
                <div className="flex flex-col gap-1 font-mono text-xs text-amber-300">
                  <a href="mailto:info@studentforge.in" className="hover:underline">
                    ✉️ info@studentforge.in
                  </a>
                  <a href="mailto:payments@studentforge.in" className="hover:underline">
                    ✉️ payments@studentforge.in
                  </a>
                </div>
                <span className="text-[11px] text-[#71717a] mt-1">Guaranteed Ticket &amp; Transaction Response within 2–4 hours</span>
              </div>
            </div>

            <p className="text-xs text-[#71717a] pt-1">
              <strong>Statutory Corporate Office:</strong> Student Forge Technologies Private Limited, Hyderabad, Telangana – 500081, India.
            </p>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
