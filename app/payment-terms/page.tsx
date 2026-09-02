import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Payment Terms & Refund Policy | Student Forge',
  description:
    'Clear and transparent Payment Terms, UPI verification rules, and Refund Policy for Student Forge event registrations.',
};

export default function PaymentTermsPage() {
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
            Student Forge &bull; Payments &amp; Refunds
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Payment Terms &amp; Refund Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#8a8a90] leading-relaxed text-justify">
            Here is a clear, transparent guide to how payments, UPI transaction verifications, ticket deliveries, and refunds work on Student Forge.
          </p>

          <div className="text-[11px] text-[#5a5a64] pt-1">
            Last Updated: September 2026
          </div>
        </div>

        {/* Quick Support Box */}
        <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-[#26262a] text-xs text-[#8a8a90] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>Facing an issue with a payment, UTR verification, or refund?</span>
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
              1. Transparent Pricing
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li><strong className="text-white">Currency:</strong> All event pass prices and registrations are in Indian Rupees (INR - ₹).</li>
              <li><strong className="text-white">All Taxes Included:</strong> The price you see is the final price. We do not add unexpected processing fees or surge charges at checkout.</li>
              <li><strong className="text-white">Discount Coupons:</strong> Valid coupon codes automatically reduce the total amount before you make payment.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              2. How to Pay &amp; Verify Your Booking
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li><strong className="text-white">Supported UPI Apps:</strong> You can pay using Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay, or any bank UPI app.</li>
              <li><strong className="text-white">Submitting Your UTR:</strong> After completing the UPI transfer, enter your 12-digit Bank Reference / UTR Number in the registration form along with your account name.</li>
              <li><strong className="text-white">Verification:</strong> Our system verifies the payment against bank records. Please enter the accurate UTR to avoid delays in pass approval.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              3. Ticket Delivery
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li><strong className="text-white">Instant Digital Pass:</strong> Once confirmed, your ticket pass is immediately available on your Student Forge Dashboard.</li>
              <li><strong className="text-white">Email &amp; PDF Pass:</strong> A high-quality PDF ticket with your unique scannable QR code is also emailed to your verified email address.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              4. Refund &amp; Cancellation Policy
            </h2>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1">
                <span className="font-medium text-white text-xs sm:text-sm">A. Event Cancelled by Organizer (100% Refund)</span>
                <p className="text-xs text-[#8a8a90]">
                  If an event is cancelled without a rescheduled date, all ticket holders automatically receive a 100% full refund credited back within 5 to 7 banking business days.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1">
                <span className="font-medium text-white text-xs sm:text-sm">B. Event Rescheduled (Date or Venue Change)</span>
                <p className="text-xs text-[#8a8a90]">
                  Your pass remains fully valid for the new date. If you cannot attend the new schedule, contact our payment desk within 48 hours of the announcement for a full refund.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1">
                <span className="font-medium text-white text-xs sm:text-sm">C. Duplicate Deductions &amp; Network Glitches</span>
                <p className="text-xs text-[#8a8a90]">
                  If money was deducted more than once due to a banking network timeout, reach out to our payment desk. We will verify the duplicate UTR and process your refund within 24 hours.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[#26262a] flex flex-col gap-1">
                <span className="font-medium text-white text-xs sm:text-sm">D. Individual No-Shows &amp; Ticket Transfers</span>
                <p className="text-xs text-[#8a8a90]">
                  Because venues, materials, and catering are booked upfront, tickets are non-refundable for individual no-shows. However, you may transfer your pass to a friend or classmate by notifying us before the event.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-[#26262a]">
            <h2 className="text-sm sm:text-base font-medium text-white tracking-tight">
              5. Payment Support Desk
            </h2>
            <p className="text-xs text-[#8a8a90]">
              If you have any questions about a transaction, need help with your pass, or want to request a refund:
            </p>
            <div className="flex flex-col gap-1 text-xs text-neutral-300 pt-1">
              <span>Student Forge Technologies Private Limited</span>
              <span>Hyderabad, Telangana, India</span>
              <span>Phone / WhatsApp: <a href="tel:+916304218064" className="hover:text-white">+91 6304218064</a>, <a href="tel:+916309917327" className="hover:text-white">+91 6309917327</a></span>
              <span>Email: <a href="mailto:events.studentforge@gmail.com" className="hover:text-white">events.studentforge@gmail.com</a></span>
            </div>
          </section>

        </div>

      </div>

      <Footer />
    </main>
  );
}
