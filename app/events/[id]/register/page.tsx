'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EventData } from '@/lib/eventsStore';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { ShinyButton } from '@/components/ui/shiny-button';
import { AntiMetalButton } from '@/components/ui/anti-metal-button';
import { 
  GoArrowLeft, GoCalendar, GoLocation, GoCheck, 
  GoPerson, GoMail, GoDeviceMobile, GoTag, GoClock,
  GoPlus, GoX, GoCopy
} from 'react-icons/go';
import { DotmSquare5 } from '@/components/ui/dotm-square-5';
import { isEventCompleted } from '@/lib/utils';
import { CopyCode } from '@/components/ui/copy-code-button';

const isEventFree = (price: string) => {
  const clean = price.trim().toLowerCase();
  return clean === 'free' || clean === '0' || clean === '0.00' || clean === 'free entry';
};

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', placeholder: '98765 43210' },
  { code: '+1', country: 'US', placeholder: '(555) 000-0000' },
  { code: '+44', country: 'GB', placeholder: '7911 123456' },
  { code: '+1', country: 'CA', placeholder: '(555) 000-0000' },
  { code: '+61', country: 'AU', placeholder: '412 345 678' },
  { code: '+65', country: 'SG', placeholder: '8123 4567' },
  { code: '+971', country: 'AE', placeholder: '50 123 4567' },
  { code: '+49', country: 'DE', placeholder: '151 12345678' },
  { code: '+33', country: 'FR', placeholder: '6 12 34 56 78' },
  { code: '+81', country: 'JP', placeholder: '90 1234 5678' },
  { code: '+86', country: 'CN', placeholder: '139 1234 5678' },
  { code: '+55', country: 'BR', placeholder: '11 91234-5678' },
  { code: '+27', country: 'ZA', placeholder: '82 123 4567' },
  { code: '+234', country: 'NG', placeholder: '802 123 4567' },
  { code: '+60', country: 'MY', placeholder: '12-345 6789' },
  { code: '+92', country: 'PK', placeholder: '300 1234567' },
  { code: '+880', country: 'BD', placeholder: '1712-345678' },
  { code: '+977', country: 'NP', placeholder: '984-1234567' },
  { code: '+94', country: 'LK', placeholder: '71 234 5678' },
];

const CountryFlagIcon = ({ country }: { country: string }) => {
  switch (country) {
    case 'IN':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#f93" d="0 0h640v160H0z"/>
          <path fill="#fff" d="0 160h640v160H0z"/>
          <path fill="#128807" d="0 320h640v160H0z"/>
          <circle cx="320" cy="240" r="50" fill="none" stroke="#000080" strokeWidth="8"/>
        </svg>
      );
    case 'US':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#bd3d44" d="0 0h640v480H0z"/>
          <path fill="#fff" stroke="#fff" strokeWidth="37" d="0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
          <path fill="#192f5d" d="0 0h256v258H0z"/>
        </svg>
      );
    case 'GB':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#012169" d="0 0h640v480H0z"/>
          <path stroke="#fff" strokeWidth="60" d="m0 0 640 480M0 480 640 0"/>
          <path stroke="#C8102E" strokeWidth="40" d="m0 0 640 480M0 480 640 0"/>
          <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
          <path stroke="#C8102E" strokeWidth="60" d="M320 0v480M0 240h640"/>
        </svg>
      );
    case 'CA':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#ff0000" d="0 0h160v480H0zm480 0h160v480H480z"/>
          <path fill="#fff" d="160 0h320v480H160z"/>
          <path fill="#ff0000" d="m320 120 20 40 40-10-20 40 30 30-40 10 10 50-40-30-40 30 10-50-40-10 30-30-20-40 40 10z"/>
        </svg>
      );
    case 'DE':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#000" d="0 0h640v160H0z"/>
          <path fill="#dd0000" d="0 160h640v160H0z"/>
          <path fill="#ffce00" d="0 320h640v160H0z"/>
        </svg>
      );
    case 'FR':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#002395" d="0 0h213v480H0z"/>
          <path fill="#fff" d="213 0h214v480H213z"/>
          <path fill="#ed2939" d="427 0h213v480H427z"/>
        </svg>
      );
    case 'JP':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#fff" d="0 0h640v480H0z"/>
          <circle cx="320" cy="240" r="140" fill="#bc002d"/>
        </svg>
      );
    case 'AU':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#00008b" d="0 0h640v480H0z"/>
          <path stroke="#fff" strokeWidth="30" d="m0 0 320 240M0 240l320-240M160 0v240M0 120h320"/>
          <path stroke="#ff0000" strokeWidth="20" d="M160 0v240M0 120h320"/>
        </svg>
      );
    case 'SG':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#ed2939" d="0 0h640v240H0z"/>
          <path fill="#fff" d="0 240h640v240H0z"/>
          <circle cx="120" cy="120" r="60" fill="#fff"/>
          <circle cx="140" cy="120" r="50" fill="#ed2939"/>
        </svg>
      );
    case 'AE':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#00732f" d="160 0h480v160H160z"/>
          <path fill="#fff" d="160 160h480v160H160z"/>
          <path fill="#000" d="160 320h480v160H160z"/>
          <path fill="#ff0000" d="0 0h160v480H0z"/>
        </svg>
      );
    case 'CN':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#ee1c25" d="0 0h640v480H0z"/>
          <circle cx="100" cy="100" r="40" fill="#ffde00"/>
        </svg>
      );
    case 'BR':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#009b3a" d="0 0h640v480H0z"/>
          <path fill="#fedf00" d="M320 40 600 240 320 440 40 240z"/>
          <circle cx="320" cy="240" r="110" fill="#002776"/>
        </svg>
      );
    case 'NG':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#008753" d="0 0h213v480H0z"/>
          <path fill="#fff" d="213 0h214v480H213z"/>
          <path fill="#008753" d="427 0h213v480H427z"/>
        </svg>
      );
    case 'PK':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#fff" d="0 0h160v480H0z"/>
          <path fill="#00401a" d="160 0h480v480H160z"/>
          <circle cx="400" cy="240" r="90" fill="#fff"/>
          <circle cx="430" cy="220" r="80" fill="#00401a"/>
        </svg>
      );
    case 'BD':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0">
          <path fill="#006a4e" d="0 0h640v480H0z"/>
          <circle cx="280" cy="240" r="140" fill="#f42a41"/>
        </svg>
      );
    default:
      return (
        <div className="w-5 h-3.5 bg-neutral-800 border border-neutral-700 text-[9px] font-bold text-neutral-300 rounded-[2px] flex items-center justify-center flex-shrink-0 font-mono">
          {country}
        </div>
      );
  }
};

function rgbToSoftHex(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  s = 0.75;
  l = 0.65;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const newR = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const newG = Math.round(hue2rgb(p, q, h) * 255);
  const newB = Math.round(hue2rgb(p, q, h - 1/3) * 255);

  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function getFallbackSoftColor(headerBg: string | undefined): string {
  if (!headerBg) return '#ff6b6b';
  const clean = headerBg.toLowerCase();
  if (clean.includes('818cf8')) return '#ff6b6b';
  if (clean.includes('fef08a') || clean.includes('ffe600')) return '#fde047';
  if (clean.includes('6ee7b7')) return '#86efac';
  if (clean.includes('fbcfe8')) return '#fbcfe8';
  if (clean.includes('fed7aa')) return '#fdba74';
  return '#ff6b6b';
}

function RegisterPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const isWaitlistQuery = searchParams?.get('waitlist') === 'true';

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [extractedColor, setExtractedColor] = useState<string>('#ff6b6b');
  const [registrationsCount, setRegistrationsCount] = useState<number>(0);

  const parseCapacity = (capStr?: string): number | null => {
    if (!capStr) return null;
    const clean = capStr.toLowerCase().trim();
    if (clean.includes('unlimited') || clean === '0' || clean === '') return null;
    const match = capStr.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return isNaN(num) || num <= 0 ? null : num;
    }
    return null;
  };

  const maxCapacity = parseCapacity(event?.capacity);
  const isLimited = maxCapacity !== null;
  const remainingTickets = isLimited ? Math.max(0, maxCapacity - registrationsCount) : null;
  const isFull = (isLimited && remainingTickets === 0) || isWaitlistQuery;

  useEffect(() => {
    if (!event?.coverImage) {
      setExtractedColor(getFallbackSoftColor(event?.headerBg));
      return;
    }

    const img = new Image();
    if (!event.coverImage.startsWith('data:')) {
      img.crossOrigin = 'Anonymous';
    }
    img.src = event.coverImage;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 10, 10);
        const data = ctx.getImageData(0, 0, 10, 10).data;
        
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
          if (brightness > 15 && brightness < 240) {
            r += data[i];
            g += data[i+1];
            b += data[i+2];
            count++;
          }
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          setExtractedColor(rgbToSoftHex(r, g, b));
        } else {
          setExtractedColor(getFallbackSoftColor(event?.headerBg));
        }
      } catch (e) {
        console.warn('Color extraction failed:', e);
        setExtractedColor(getFallbackSoftColor(event?.headerBg));
      }
    };
    img.onerror = () => {
      setExtractedColor(getFallbackSoftColor(event?.headerBg));
    };
  }, [event?.coverImage, event?.headerBg]);

  // Flow step state: 'form' | 'payment' | 'confirm-txn'
  const [rsvpStep, setRsvpStep] = useState<'form' | 'payment' | 'confirm-txn'>('form');
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  interface Friend {
    name: string;
    email: string;
    phone: string;
  }
  const [friends, setFriends] = useState<Friend[]>([]);

  // Payment states
  const [paymentAccountName, setPaymentAccountName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentTxnId, setPaymentTxnId] = useState('');
  const [revealQr, setRevealQr] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText('6302933597@hdfc');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Coupon states
  const [inputCouponCode, setInputCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async () => {
    if (!inputCouponCode || !inputCouponCode.trim() || !event) return;

    // Sanitize string locally before sending
    const cleanCode = inputCouponCode
      .replace(/[\u200B-\u200D\uFEFF\u202F\u00A0\s]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .trim()
      .toUpperCase();

    setCouponLoading(true);
    setCouponError('');
    try {
      const perTicketNum = parseFloat(event.price.replace(/[^0-9.]/g, '')) || 0;
      const memberCount = 1 + (friends ? friends.length : 0);
      const totalOriginalPrice = perTicketNum * memberCount;

      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cleanCode,
          eventId: event.id,
          originalPrice: totalOriginalPrice
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid coupon code');
      }
      setAppliedCoupon(data);
      setInputCouponCode(data.code);
      setCouponError('');
    } catch (err: any) {
      setCouponError(err.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setInputCouponCode('');
    setCouponError('');
  };

  // Success states
  const [ticket, setTicket] = useState<any>(null);

  // Parsed custom fields
  const parsedCustomFields = event?.customFields
    ? (JSON.parse(event.customFields) as { name: string; type: 'text' | 'checkbox'; required: boolean }[])
    : [];

  useEffect(() => {
    let emailCheck: string | null = null;
    try {
      const stored = localStorage.getItem('student_forge_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setName(u.name || '');
        setEmail(u.email || '');
        emailCheck = u.email || null;
      }
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocalhost(isLocal);
    } catch (e) {
      console.error(e);
    }

    if (id) {
      setLoading(true);
      fetch(`/api/events/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.event) {
            setEvent(data.event);
            fetch(`/api/events/${id}/register`)
              .then((r) => r.json())
              .then((regData) => {
                const regs = regData.registrations || [];
                setRegistrationsCount(regs.length);
                if (emailCheck) {
                  const userReg = regs.find((r: any) => r.email === emailCheck);
                  if (userReg) {
                    setTicket(userReg);
                  }
                }
              })
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const downloadPDF = () => {
    if (!ticket) return;
    setDownloading(true);
    try {
      const a = document.createElement('a');
      a.href = `/api/registrations/${ticket.id}/pdf`;
      a.download = `ticket-${ticket.ticketCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error launching PDF download:', err);
      alert('Failed to download PDF ticket. Please try again.');
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number (e.g. 10-digit number or international format).');
        return;
      }
    }

    // Check required dynamic fields
    for (const field of parsedCustomFields) {
      if (field.required && !answers[field.name]) {
        alert(`Please fill out the required field: ${field.name}`);
        return;
      }
    }

    if (event && isEventFree(event.price)) {
      submitRegistration();
    } else {
      setRevealQr(false); // Reset reveal state for next screen
      setRsvpStep('payment');
    }
  };

  const submitRegistration = async () => {
    setSubmitting(true);
    try {
      // 1. Submit main participant registration
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          phone: phone.trim() ? `${countryCode} ${phone.trim()}` : '', 
          answers,
          paymentAccountName: paymentAccountName || null,
          paymentMethod: paymentMethod || null,
          paymentTxnId: paymentTxnId || null,
          couponCode: appliedCoupon?.code || null,
          discountApplied: appliedCoupon?.discountAmount || 0
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to complete registration for yourself.');
        setSubmitting(false);
        return;
      }

      // 2. Submit registrations for each friend sequentially
      for (let i = 0; i < friends.length; i++) {
        const friend = friends[i];
        if (!friend.name || !friend.email) continue;
        try {
          const friendRes = await fetch(`/api/events/${id}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: friend.name,
              email: friend.email,
              phone: friend.phone,
              answers,
              paymentAccountName: paymentAccountName || null,
              paymentMethod: paymentMethod || null,
              paymentTxnId: paymentTxnId || null
            }),
          });
          const friendData = await friendRes.json();
          if (!friendRes.ok || !friendData.success) {
            console.warn(`Failed to register friend ${friend.name}:`, friendData.error);
          }
        } catch (e) {
          console.error(`Failed to register friend ${friend.name}:`, e);
        }
      }

      setTicket(data.registration);
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTxnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAccountName.trim() || !paymentTxnId.trim()) {
      alert('Please fill out all verification details.');
      return;
    }

    const accountNameRegex = /^[a-zA-Z0-9\s.\-]{3,50}$/;
    if (!accountNameRegex.test(paymentAccountName)) {
      alert('Payment Account Name must be 3-50 characters, containing only letters, numbers, spaces, dots, or hyphens.');
      return;
    }

    const txnIdRegex = /^(\d{12}|[a-zA-Z0-9]{8,24})$/;
    if (!txnIdRegex.test(paymentTxnId)) {
      alert('Transaction ID must be a valid 12-digit UPI reference number or an 8-24 character alphanumeric transaction ID.');
      return;
    }

    const validMethods = ['UPI', 'GPAY', 'PHONEPE', 'PAYTM', 'OTHER'];
    if (!validMethods.includes(paymentMethod.toUpperCase())) {
      alert('Please select a valid payment method.');
      return;
    }

    submitRegistration();
  };

  if (loading) {
    return (
      <main 
        className="min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans"
        style={{
          ['--event-highlight' as any]: '#ff6b6b',
          ['--event-highlight-bg' as any]: '#ff6b6b1a'
        }}
      >
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-4">
          <DotmSquare5 size={36} dotSize={4} speed={1.2} bloom colorPreset="grad-aurora" animated />
          <p className="text-xs text-neutral-500 font-mono tracking-wider uppercase">Loading registration details...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20 px-4 text-center">
          <p className="text-sm text-neutral-400">Event details not found.</p>
          <a href="/events" className="inline-flex items-center gap-2 px-4 py-2 bg-[#222226] border border-[#2e2e34] rounded-md text-xs hover:bg-[#2c2c32] transition-colors">
            <GoArrowLeft className="w-3.5 h-3.5" /> Back to Events
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  // BLOCK REGISTRATION IF EVENT IS COMPLETED
  if (isEventCompleted(event)) {
    return (
      <main className="min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-4 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-xl">
            <GoClock className="w-8 h-8 text-neutral-400" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Registration Closed</h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Registration for <strong className="text-white">{event.title}</strong> is closed because this event has already concluded.
            </p>
          </div>
          <a
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#222226] border border-[#2e2e34] rounded-xl text-xs font-semibold text-white hover:bg-[#2c2c32] transition-colors shadow-md"
          >
            <GoArrowLeft className="w-4 h-4" /> Return to Event Details
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  // Generate payment QR code with total member count and discount applied
  const totalAttendees = 1 + (friends ? friends.length : 0);
  const perTicketPrice = parseFloat(event.price.replace(/[^0-9.]/g, '')) || 0;
  const totalBasePrice = perTicketPrice * totalAttendees;

  // Reactively calculate discount for friends additions/removals
  const discountAmountNum = appliedCoupon
    ? appliedCoupon.discountType === 'PERCENTAGE'
      ? Math.round((totalBasePrice * (appliedCoupon.discountValue || 0)) / 100)
      : Math.min(totalBasePrice, appliedCoupon.discountValue || appliedCoupon.discountAmount || 0)
    : 0;

  const finalPriceNum = Math.max(0, totalBasePrice - discountAmountNum);
  const formattedDisplayPrice = isEventFree(event.price) || finalPriceNum === 0 ? 'Free' : `₹${finalPriceNum}`;

  const qrPaymentValue = `upi://pay?pa=6302933597@hdfc&pn=Student%20Forge%20Events&am=${finalPriceNum}&cu=INR&tn=Registration%20${encodeURIComponent(event.title.substring(0, 15))}`;

  return (
    <main 
      className="min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans"
      style={{
        ['--event-highlight' as any]: extractedColor,
        ['--event-highlight-bg' as any]: `${extractedColor}1a`
      }}
    >
      <Navbar />

      {/* Global CSS for Print Optimization & Dynamic Input Focus */}
      <style dangerouslySetInnerHTML={{ __html: `
        input:focus, select:focus, textarea:focus {
          border-color: #52525b !important;
          outline: none !important;
          box-shadow: none !important;
        }
        @media print {
          nav, footer, .no-print, button, a {
            display: none !important;
          }
          body, html, main, div {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
          .printable-ticket-card {
            background-color: #ffffff !important;
            background: #ffffff !important;
            border: 2px solid #000000 !important;
            color: #000000 !important;
            box-shadow: none !important;
            margin: 20px auto !important;
            width: 100% !important;
            max-width: 680px !important;
            border-radius: 16px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: stretch !important;
            page-break-inside: avoid !important;
          }
          .printable-ticket-card * {
            color: #000000 !important;
          }
          .printable-ticket-card .text-neutral-400,
          .printable-ticket-card .text-neutral-500 {
            color: #4b5563 !important;
          }
          .printable-ticket-card .border-t,
          .printable-ticket-card .border-x,
          .printable-ticket-card .border-dashed {
            border-color: #000000 !important;
          }
          .printable-stub {
            border-top: none !important;
            border-left: 1px dashed #000000 !important;
            width: 220px !important;
          }
          .printable-tear-strip {
            display: none !important;
          }
          .printable-ticket-card div.bg-\\[\\#222226\\] {
            background-color: #f3f4f6 !important;
            background: #f3f4f6 !important;
            border: 1px solid #d1d5db !important;
          }
        }
      `}} />

      <div className="w-full max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 pb-16 px-4 sm:px-6 flex-1 flex flex-col gap-6 font-tight">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 font-tight pb-4 border-b border-neutral-800/80 mb-2">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span className="text-neutral-600">/</span>
          <a href="/events" className="hover:text-white transition-colors">Events</a>
          <span className="text-neutral-600">/</span>
          <a href={`/events/${event.id}`} className="hover:text-white transition-colors truncate max-w-[150px] sm:max-w-xs">{event.title}</a>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-medium">Register</span>
        </nav>

        {!ticket ? (
          /* Registration Form / Payment Flow Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Side: Form inputs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {rsvpStep === 'form' && (
                <>
                  <div className="flex flex-col gap-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h1 className="font-instrument-serif text-3xl sm:text-4xl text-white font-normal tracking-[-0.5px]">
                        {isFull ? 'Join Event Waitlist' : 'Complete your Registration'}
                      </h1>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
                        {totalAttendees} {totalAttendees === 1 ? 'Pass' : 'Passes'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-tight">
                      {isFull
                        ? 'Event capacity reached. Fill in your details to join the waitlist.'
                        : 'Fill in your details and add friend passes below. All entry passes are generated instantly.'}
                    </p>
                  </div>

                  {isFull && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3 animate-fade-in font-tight">
                      <GoClock className="w-5 h-5 flex-shrink-0 text-amber-400" />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-amber-200">
                          Capacity Limit Reached ({registrationsCount}/{maxCapacity || 40} Seats Filled)
                        </span>
                        <span className="text-[11px] text-amber-300/80">
                          0 tickets left. Submitting this form will place you on the waitlist.
                        </span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 animate-fade-in bg-transparent border-0 p-0 shadow-none">
                    
                    {/* Primary Attendee Box */}
                    <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                            Primary Attendee (You)
                          </span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          {isEventFree(event.price) ? 'Free' : `₹${perTicketPrice}`}
                        </span>
                      </div>

                      {/* Full Name */}
                      <div className="flex flex-col gap-1.5 font-tight">
                        <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                          <GoPerson className="w-3.5 h-3.5 text-neutral-400" /> Full Name <span className="text-neutral-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Enter your full name"
                          className="w-full bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600 font-tight shadow-inner"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="flex flex-col gap-1.5 font-tight">
                        <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                          <GoMail className="w-3.5 h-3.5 text-neutral-400" /> Email Address <span className="text-neutral-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                          className="w-full bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600 font-tight shadow-inner"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="flex flex-col gap-1.5 font-tight">
                        <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                          <GoDeviceMobile className="w-3.5 h-3.5 text-neutral-400" /> Phone Number <span className="text-neutral-500 text-[11px]">(Optional)</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 flex-shrink-0 shadow-inner">
                            <CountryFlagIcon country={COUNTRY_CODES.find((c) => c.code === countryCode)?.country || 'IN'} />
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="bg-transparent text-xs font-mono font-medium text-white outline-none cursor-pointer pr-1"
                            >
                              {COUNTRY_CODES.map((c, i) => (
                                <option key={i} value={c.code} className="bg-neutral-900 text-white font-mono">
                                  {c.code} ({c.country})
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={COUNTRY_CODES.find((c) => c.code === countryCode)?.placeholder || '98765 43210'}
                            className="flex-1 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600 font-mono shadow-inner"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Friends / Additional Participants Section */}
                    <div className="flex flex-col gap-4 pt-1 font-tight">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-white">
                            Add Friends / Teammates
                          </span>
                          <span className="text-xs text-neutral-400">
                            {friends.length === 0
                              ? 'Booking for more people? Add friends to register together.'
                              : `${friends.length} friend ${friends.length === 1 ? 'pass' : 'passes'} added (+₹${perTicketPrice * friends.length})`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFriends([...friends, { name: '', email: '', phone: '' }]);
                          }}
                          className="flex items-center gap-1.5 text-xs font-medium text-neutral-200 hover:text-white cursor-pointer py-2 px-3.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all font-tight shadow-sm active:scale-95"
                        >
                          <GoPlus className="w-3.5 h-3.5" />
                          <span>Add Friend {perTicketPrice > 0 ? `(+₹${perTicketPrice})` : ''}</span>
                        </button>
                      </div>

                      {/* Friends List */}
                      {friends.map((friend, idx) => (
                        <div key={idx} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3.5 relative animate-fade-in font-tight shadow-sm">
                          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-indigo-400" />
                              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-200">
                                Attendee #{idx + 2} (Friend Pass)
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-neutral-400">
                                {isEventFree(event.price) ? 'Free' : `+₹${perTicketPrice}`}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newFriends = [...friends];
                                  newFriends.splice(idx, 1);
                                  setFriends(newFriends);
                                }}
                                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Remove Friend"
                              >
                                <GoX className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] text-neutral-400 font-medium">Friend's Full Name *</label>
                              <input
                                type="text"
                                required
                                value={friend.name}
                                onChange={(e) => {
                                  const newFriends = [...friends];
                                  newFriends[idx].name = e.target.value;
                                  setFriends(newFriends);
                                }}
                                placeholder="Full name"
                                className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-all placeholder:text-neutral-600 font-tight shadow-inner"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] text-neutral-400 font-medium">Friend's Email *</label>
                              <input
                                type="email"
                                required
                                value={friend.email}
                                onChange={(e) => {
                                  const newFriends = [...friends];
                                  newFriends[idx].email = e.target.value;
                                  setFriends(newFriends);
                                }}
                                placeholder="friend@example.com"
                                className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-all placeholder:text-neutral-600 font-tight shadow-inner"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Custom RSVP Fields */}
                    {parsedCustomFields.length > 0 && (
                      <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-3.5 shadow-sm">
                        <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                          Additional Information
                        </span>
                        {parsedCustomFields.map((field, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5 font-tight">
                            {field.type === 'text' ? (
                              <>
                                <label className="text-xs font-medium text-neutral-300">
                                  {field.name} {field.required && <span className="text-neutral-500">*</span>}
                                </label>
                                <input
                                  type="text"
                                  required={field.required}
                                  value={(answers[field.name] as string) || ''}
                                  onChange={(e) => setAnswers({ ...answers, [field.name]: e.target.value })}
                                  placeholder={`Enter ${field.name.toLowerCase()}`}
                                  className="w-full bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600 font-tight shadow-inner"
                                />
                              </>
                            ) : (
                              <div className="flex items-center gap-2.5 py-1">
                                <input
                                  type="checkbox"
                                  id={`custom-check-${idx}`}
                                  required={field.required}
                                  checked={!!answers[field.name]}
                                  onChange={(e) => setAnswers({ ...answers, [field.name]: e.target.checked })}
                                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0 cursor-pointer accent-white"
                                />
                                <label htmlFor={`custom-check-${idx}`} className="text-xs text-neutral-300 cursor-pointer font-tight">
                                  {field.name} {field.required && <span className="text-neutral-500">*</span>}
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coupon Code Section */}
                    {!isEventFree(event.price) && (
                      <div className="flex flex-col gap-3 p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl w-full font-tight shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-neutral-800 border border-neutral-700 text-neutral-300 shrink-0">
                              <GoTag className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-white">
                              Have a Coupon Code?
                            </span>
                          </div>

                          {appliedCoupon && (
                            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400">
                              -{appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`} OFF
                            </span>
                          )}
                        </div>

                        {appliedCoupon ? (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 transition-all">
                            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                              <GoCheck className="w-4 h-4 font-bold" />
                              <span className="font-bold text-white tracking-wider">{appliedCoupon.code}</span>
                              <span className="text-[11px] text-emerald-400">
                                (-₹{discountAmountNum} saved)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-xs font-mono px-2 py-1 rounded-lg hover:bg-neutral-800"
                            >
                              Remove ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <input
                              type="text"
                              value={inputCouponCode}
                              onChange={(e) => setInputCouponCode(e.target.value.toUpperCase())}
                              placeholder="Enter Code (e.g. INCEPT50)"
                              className="flex-1 bg-neutral-950/90 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2 text-xs text-white uppercase font-mono font-bold outline-none transition-all placeholder:text-neutral-500 placeholder:normal-case tracking-wider shadow-inner"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon()}
                              disabled={couponLoading || !inputCouponCode.trim()}
                              className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold font-mono rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-40"
                            >
                              {couponLoading ? 'Applying...' : 'Apply'}
                            </button>
                          </div>
                        )}

                        {couponError && (
                          <p className="text-[11px] text-rose-400 font-mono font-medium animate-fade-in">
                            {couponError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Submit CTA Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-sm transition-all shadow-md active:scale-[0.99] font-tight cursor-pointer disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <span>Submitting...</span>
                      ) : isFull ? (
                        <span>Join Waitlist ({totalAttendees} {totalAttendees === 1 ? 'Pass' : 'Passes'})</span>
                      ) : isEventFree(event.price) || (appliedCoupon && finalPriceNum === 0) ? (
                        <span>Confirm Free Registration ({totalAttendees} {totalAttendees === 1 ? 'Pass' : 'Passes'})</span>
                      ) : (
                        <span>Proceed to Pay {formattedDisplayPrice} ({totalAttendees} {totalAttendees === 1 ? 'Pass' : 'Passes'})</span>
                      )}
                    </button>
                  </form>
                </>
              )}

              {rsvpStep === 'payment' && (
                <>
                  <div className="flex flex-col gap-1.5 animate-fade-in font-tight">
                    <button onClick={() => { setRsvpStep('form'); }} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors pb-1 text-left cursor-pointer">
                      <GoArrowLeft className="w-3.5 h-3.5" /> Back to Registration Details
                    </button>
                    <h1 className="font-instrument-serif text-3xl sm:text-4xl text-white font-normal tracking-[-0.5px]">
                      Scan &amp; Pay
                    </h1>
                    <p className="text-xs text-neutral-400">
                      Please complete payment of <strong className="text-white font-mono">{formattedDisplayPrice}</strong> for <strong>{totalAttendees} {totalAttendees === 1 ? 'Attendee' : 'Attendees'}</strong> to secure entry passes.
                    </p>
                  </div>

                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center gap-5 shadow-xl animate-fade-in text-center font-tight">
                    
                    {/* Amount badge */}
                    <div className="bg-neutral-950 border border-neutral-800 px-5 py-3.5 rounded-xl flex flex-col gap-1.5 max-w-[320px] w-full shadow-inner">
                      <div className="flex items-center justify-between text-[11px] uppercase font-mono text-neutral-400">
                        <span>Total Amount Due</span>
                        <span className="text-white font-semibold font-mono">{totalAttendees} {totalAttendees === 1 ? 'Pass' : 'Passes'}</span>
                      </div>
                      
                      <div className="flex items-baseline justify-center gap-2">
                        {appliedCoupon ? (
                          <>
                            <span className="text-xs line-through text-neutral-500 font-mono">₹{totalBasePrice}</span>
                            <span className="text-2xl font-bold text-emerald-400 font-mono">{formattedDisplayPrice}</span>
                          </>
                        ) : (
                          <>
                            {(event.price === '199' || event.price === '₹199' || (event.title && event.title.toLowerCase().includes('incept'))) && (
                              <span className="text-sm line-through text-neutral-500 font-mono">₹{249 * totalAttendees}</span>
                            )}
                            <span className="text-2xl font-bold font-mono text-white">
                              {formattedDisplayPrice}
                            </span>
                          </>
                        )}
                      </div>

                      {totalAttendees > 1 && !isEventFree(event.price) && (
                        <span className="text-[11px] font-mono text-neutral-400">
                          (₹{perTicketPrice} × {totalAttendees} attendees)
                        </span>
                      )}

                      {appliedCoupon && (
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                          Code '{appliedCoupon.code}' Applied! (-₹{discountAmountNum})
                        </span>
                      )}
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="p-4 bg-white border-4 border-white rounded-2xl shadow-xl flex items-center justify-center select-none animate-fade-in w-[200px] h-[200px] shrink-0">
                        <QRCodeSVG
                          value={qrPaymentValue}
                          size={168}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="Q"
                          includeMargin={false}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs text-neutral-300 font-medium">
                        Scan QR using GPay, PhonePe, Paytm or Any UPI App
                      </span>
                    </div>

                    {/* Mobile Direct Pay Deep Link Button */}
                    <a
                      href={qrPaymentValue}
                      className="w-full max-w-sm py-2.5 px-4 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer font-tight"
                    >
                      <GoDeviceMobile className="w-4 h-4" />
                      <span>Pay Directly via Mobile UPI App</span>
                    </a>

                    {/* Copy UPI ID Bar */}
                    <CopyCode code="6302933597@hdfc" label="UPI ID" duration={3500} />

                    <p className="text-[11px] text-neutral-500 font-mono max-w-sm">
                      Once scanning and paying is done, click below to submit payment transaction details for instant host verification.
                    </p>

                    <button
                      type="button"
                      onClick={() => setRsvpStep('confirm-txn')}
                      className="w-full py-3 px-5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-sm transition-all shadow-md active:scale-[0.99] font-tight cursor-pointer"
                    >
                      Next Step: Confirm Payment Details
                    </button>
                  </div>
                </>
              )}

              {rsvpStep === 'confirm-txn' && (
                <>
                  <div className="flex flex-col gap-1.5 animate-fade-in font-tight">
                    <button onClick={() => { setRsvpStep('payment'); }} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors pb-1 text-left cursor-pointer">
                      <GoArrowLeft className="w-3.5 h-3.5" /> Back to Payment Scan
                    </button>
                    <h1 className="font-instrument-serif text-3xl sm:text-4xl text-white font-normal tracking-[-0.5px]">
                      Confirm Transaction
                    </h1>
                    <p className="text-xs text-neutral-400">Fill in transaction details of your {formattedDisplayPrice} payment.</p>
                  </div>

                  <form onSubmit={handleTxnSubmit} className="flex flex-col gap-5 animate-fade-in bg-transparent border-0 p-0 shadow-none font-tight">
                    
                    {/* Account Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-neutral-300">
                        Sender Account Name <span className="text-neutral-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={paymentAccountName}
                        onChange={(e) => setPaymentAccountName(e.target.value)}
                        required
                        placeholder="e.g. John Doe / Bank account holder name"
                        className="w-full bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600 font-tight shadow-sm"
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-neutral-300">
                          Payment Method <span className="text-neutral-500">*</span>
                        </label>
                        {/* Official Payment Logos (GPay, PhonePe, UPI) */}
                        <div className="flex items-center gap-1.5 select-none">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-[10px] font-bold text-white font-sans">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            GPay
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-[10px] font-bold text-white font-sans">
                            <span className="w-3 h-3 rounded-full bg-[#5f259f] text-white text-[8px] flex items-center justify-center font-bold flex-shrink-0">पे</span>
                            PhonePe
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-[10px] font-bold text-white font-sans">
                            <svg className="w-3 h-3" viewBox="0 0 32 32">
                              <path fill="#007934" d="M18.8 4L13.2 14.8H18L13.2 24L23.6 12.4H18.8L23.6 4H18.8Z" />
                              <path fill="#E05E00" d="M13.2 4L7.6 14.8H12.4L7.6 24L18 12.4H13.2L18 4H13.2Z" />
                            </svg>
                            UPI
                          </span>
                        </div>
                      </div>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all cursor-pointer font-tight shadow-sm"
                      >
                        <option value="UPI" className="bg-neutral-900">UPI / GPay / PhonePe</option>
                        <option value="Bank Transfer" className="bg-neutral-900">Bank Transfer (IMPS/NEFT)</option>
                        <option value="Card Payment" className="bg-neutral-900">Credit / Debit Card</option>
                        <option value="PayPal" className="bg-neutral-900">PayPal</option>
                      </select>
                    </div>

                    {/* Transaction ID */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-neutral-300">
                        Transaction ID / Reference Number <span className="text-neutral-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={paymentTxnId}
                        onChange={(e) => setPaymentTxnId(e.target.value)}
                        required
                        placeholder="e.g. Txn-129037482, UPI Ref ID, etc."
                        className="w-full bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all font-mono placeholder:text-neutral-600 shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-sm transition-all shadow-md active:scale-[0.99] font-tight cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {submitting ? 'Submitting Details...' : 'Complete Registration & Submit'}
                    </button>
                  </form>
                </>
              )}

            </div>

            {/* Right Side: Event Details & Dynamic Live Order Summary Card */}
            <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col font-tight sticky top-24">
              
              {/* Event Cover Image at top (Clean 1:1 square container without overlay pills) */}
              {event.coverImage && (
                <div className="w-full aspect-square relative overflow-hidden bg-neutral-950 border-b border-neutral-800">
                  <img 
                    src={event.coverImage} 
                    alt={event.title} 
                    className="w-full h-full object-cover select-none" 
                  />
                </div>
              )}

              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-neutral-800 border border-neutral-700 text-neutral-300 px-2.5 py-0.5 rounded-md">
                    {event.ticketCode || 'TICKET'}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    Registration Pass
                  </span>
                </div>

                <h4 className="font-instrument-serif text-2xl font-normal text-white leading-snug">
                  {event.title}
                </h4>

                {/* Event Meta */}
                <div className="flex flex-col gap-2.5 text-xs text-neutral-400 pt-3 border-t border-neutral-800/80">
                  <div className="flex items-start gap-2.5">
                    <GoCalendar className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{event.startDate}</span>
                      <span className="text-neutral-400 font-mono text-[11px]">{event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <GoLocation className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300 break-words leading-relaxed">{event.location || 'Online / Virtual'}</span>
                  </div>
                </div>

                {/* Live Order Calculation Summary */}
                <div className="flex flex-col gap-2 pt-3 border-t border-neutral-800/80">
                  <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                    Live Order Summary
                  </span>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span>1 × Primary Pass (You)</span>
                    <span className="font-mono">{isEventFree(event.price) ? 'Free' : `₹${perTicketPrice}`}</span>
                  </div>

                  {friends.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-neutral-300 animate-fade-in">
                      <span>{friends.length} × Friend {friends.length === 1 ? 'Pass' : 'Passes'}</span>
                      <span className="font-mono">{isEventFree(event.price) ? 'Free' : `+₹${perTicketPrice * friends.length}`}</span>
                    </div>
                  )}

                  {appliedCoupon && discountAmountNum > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-mono animate-fade-in">
                      <span>Coupon '{appliedCoupon.code}'</span>
                      <span>-₹{discountAmountNum}</span>
                    </div>
                  )}

                  {/* Total Due Row */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-neutral-800 text-sm font-semibold">
                    <span className="text-white">Total Due ({totalAttendees} {totalAttendees === 1 ? 'Pass' : 'Passes'})</span>
                    <div className="flex items-baseline gap-1.5">
                      {!isEventFree(event.price) && (event.price === '199' || event.price === '₹199' || (event.title && event.title.toLowerCase().includes('incept'))) && (
                        <span className="text-xs line-through text-neutral-500 font-mono">₹{249 * totalAttendees}</span>
                      )}
                      <span className="text-base font-bold font-mono text-white">
                        {formattedDisplayPrice}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* HORIZONTAL BOARDING PASS TICKET SUCCESS SCREEN */
          <div className="max-w-3xl w-full mx-auto flex flex-col items-center gap-8 py-4 animate-fade-in font-tight">
            
            {/* Header info */}
            {ticket.status === 'PENDING' ? (
              <div className="flex flex-col items-center text-center gap-2.5 max-w-md mx-auto no-print">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-sm">
                  <GoClock className="w-6 h-6" />
                </div>
                <h2 className="font-instrument-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
                  Pending Host Approval
                </h2>
                <p className="text-xs text-neutral-400 font-tight leading-relaxed max-w-sm">
                  Your registration details have been received. The host will review and confirm your entry pass shortly.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-2.5 max-w-md mx-auto no-print">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-sm">
                  <GoCheck className="w-6 h-6" />
                </div>
                <h2 className="font-instrument-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
                  Registration Confirmed
                </h2>
                <p className="text-xs text-neutral-400 font-tight leading-relaxed max-w-sm">
                  Your entry pass is generated and confirmed. Present this pass at the venue for check-in.
                </p>
              </div>
            )}

            {/* Ticket Card Container */}
            <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl relative flex flex-col md:flex-row items-stretch overflow-hidden printable-ticket-card font-tight">
              
              {/* Left Side: Pass main information */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6 min-w-0">
                
                {/* Event Name & Ticket Status Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Event Name</span>
                    <h3 className="font-instrument-serif text-2xl md:text-3xl font-normal text-white leading-tight">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Status</span>
                    <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-md border ${
                      ticket.status === 'PENDING'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      {ticket.status === 'PENDING' ? 'PENDING APPROVAL' : 'CONFIRMED'}
                    </span>
                  </div>
                </div>

                {/* Details layout: Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3.5 border-t border-neutral-800 pt-5 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Date &amp; Time</span>
                    <span className="font-semibold text-white">{event.startDate}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">{event.startTime}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Location</span>
                    <span className="font-semibold text-white break-words leading-snug">{event.location || 'Online / Virtual'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Amount Paid</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {event.price ? (event.price.startsWith('₹') ? event.price : `₹${event.price}`) : 'Free'}
                    </span>
                  </div>
                </div>

                {/* Attendee Info Container */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold font-mono text-neutral-300">
                      {ticket.name?.substring(0, 2).toUpperCase() || 'SF'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate">{ticket.name}</span>
                      <span className="text-[11px] text-neutral-400 font-mono truncate">{ticket.email}</span>
                    </div>
                  </div>

                  {/* Dynamic fields / Answers */}
                  {ticket?.answers && (() => {
                    try {
                      const parsed = JSON.parse(ticket.answers);
                      const entries = Object.entries(parsed);
                      if (entries.length === 0) return null;
                      return (
                        <div className="border-t border-neutral-800/80 pt-2.5 mt-0.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
                          {entries.map(([key, val]) => (
                            <div key={key} className="flex gap-1.5 items-center">
                              <span className="text-neutral-400 font-medium">{key}:</span>
                              <span className="text-neutral-200 font-semibold">{typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    } catch { return null; }
                  })()}

                  {/* Transaction ID if paid */}
                  {ticket.paymentTxnId && (
                    <div className="border-t border-neutral-800/80 pt-2.5 mt-0.5 flex flex-wrap justify-between gap-3 text-[11px] text-neutral-400">
                      <div>Method: <span className="text-neutral-200 font-medium">{ticket.paymentMethod}</span></div>
                      <div>Account: <span className="text-neutral-200 font-medium">{ticket.paymentAccountName}</span></div>
                      <div className="truncate max-w-[200px]">Txn ID: <span className="text-neutral-200 font-mono font-medium">{ticket.paymentTxnId}</span></div>
                    </div>
                  )}
                </div>

              </div>

              {/* Tear Strip separator line with custom cutout notches */}
              <div className="hidden md:flex flex-col items-center justify-between py-4 select-none pointer-events-none printable-tear-strip">
                <div className="w-6 h-6 rounded-full bg-[#161618] border border-neutral-800 -mt-7 -mb-2" />
                <div className="h-full border-r border-dashed border-neutral-800 my-2" />
                <div className="w-6 h-6 rounded-full bg-[#161618] border border-neutral-800 -mb-7 -mt-2" />
              </div>

              {/* Right Side: QR Code / Verification Stub */}
              <div className="w-full md:w-60 bg-neutral-950 border-t md:border-t-0 border-neutral-800 md:border-l border-dashed p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center flex-shrink-0 printable-stub">
                {ticket.status === 'PENDING' ? (
                  <div className="w-32 h-32 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col items-center justify-center gap-2 p-3 text-center select-none shadow-sm">
                    <GoClock className="w-7 h-7 text-amber-400" />
                    <span className="text-[10px] font-mono text-neutral-300 font-semibold uppercase tracking-wider">
                      Awaiting
                    </span>
                    <span className="text-[9px] text-neutral-500 leading-tight">
                      QR unlocks after approval
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center select-none">
                    <QRCodeSVG
                      value={ticket.ticketCode}
                      size={120}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="L"
                      includeMargin={false}
                    />
                  </div>
                )}
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                    Presenter Pass
                  </span>
                  <span className="text-[10px] font-mono text-neutral-300 font-bold tracking-wider">
                    {ticket.ticketCode || 'SF-PASS'}
                  </span>
                </div>
              </div>

            </div>

            {/* Download & Print buttons */}
            {ticket.status !== 'PENDING' && (
              <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 no-print">
                <button
                  type="button"
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {downloading ? 'Downloading...' : 'Download Pass (PDF)'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl border border-neutral-800 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  Print Ticket
                </button>
              </div>
            )}

            {/* Back action */}
            <a
              href={`/events/${event.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors no-print"
            >
              <GoArrowLeft className="w-3.5 h-3.5" /> Return to Event Details
            </a>

          </div>
        )}

      </div>

      {/* Hidden container formatted for Landscape PDF Ticket Print */}
      {ticket && event && (
        <div 
          id="ticket-pdf-export-container"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '800px',
            height: '380px',
            backgroundColor: '#1c1c1f',
            color: '#ffffff',
            fontFamily: 'sans-serif',
            border: '2px solid #2e2e34',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          {/* Left Main Stub */}
          <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', minWidth: '0' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#88888e', letterSpacing: '1px' }}>Event Name</span>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {event.title}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#88888e', letterSpacing: '1px' }}>Ticket ID</span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold', color: '#d1d1d6' }}>
                  {ticket.status === 'PENDING' ? 'PENDING APPROVAL' : ticket.ticketCode}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', borderTop: '1px solid #2e2e34', paddingTop: '20px', margin: '20px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#88888e', letterSpacing: '1px' }}>Date &amp; Time</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>{event.startDate} at {event.startTime}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '200px' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#88888e', letterSpacing: '1px' }}>Location</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.location}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#88888e', letterSpacing: '1px' }}>Amount</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: extractedColor }}>{event.price || 'Free'}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#222226', border: '1px solid #2e2e34', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2e2e34', border: '1px solid #3e3e46', display: 'flex', alignItems: 'center', justifyContent: 'center', color: extractedColor, fontWeight: 'bold', fontSize: '12px', fontFamily: 'monospace' }}>
                  {ticket.name?.substring(0, 2).toUpperCase() || 'SF'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff' }}>{ticket.name}</span>
                  <span style={{ fontSize: '10px', color: '#a1a1aa', fontFamily: 'monospace' }}>{ticket.email}</span>
                </div>
              </div>
              
              {ticket.paymentTxnId && (
                <div style={{ borderTop: '1px solid #2e2e34', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#71717a' }}>
                  <div>Method: <span style={{ color: '#d4d4d8', fontWeight: '600' }}>{ticket.paymentMethod}</span></div>
                  <div>Account: <span style={{ color: '#d4d4d8', fontWeight: '600' }}>{ticket.paymentAccountName}</span></div>
                  <div>Txn ID: <span style={{ color: '#d4d4d8', fontFamily: 'monospace', fontWeight: '600' }}>{ticket.paymentTxnId}</span></div>
                </div>
              )}
            </div>

          </div>

          {/* Tear Line Separator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '1px', boxSizing: 'border-box', borderLeft: '2px dashed #2e2e34', margin: '20px 0' }}></div>

          {/* Right QR Code Stub */}
          <div style={{ width: '260px', backgroundColor: '#1c1c1f', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', boxSizing: 'border-box', flexShrink: 0 }}>
            {ticket.status === 'PENDING' ? (
              <div style={{ border: '2px dashed #2e2e34', borderRadius: '12px', width: '140px', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px', boxSizing: 'border-box', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px' }}>Awaiting</span>
                <span style={{ fontSize: '8px', color: '#71717a', marginTop: '4px' }}>Approval Pending</span>
              </div>
            ) : (
              <div style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                <QRCodeCanvas
                  value={ticket.ticketCode}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin={false}
                />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#d1d1d6', textTransform: 'uppercase', letterSpacing: '1px' }}>Presenter Pass</span>
              <span style={{ fontSize: '8px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {ticket.status === 'PENDING' ? 'Status: Pending' : 'Scan for entry'}
              </span>
            </div>
          </div>

        </div>
      )}

      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" 
        strategy="lazyOnload" 
      />
      <Script 
        src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.4/dist/dotlottie-wc.js" 
        type="module"
        strategy="lazyOnload" 
      />

      <Footer />
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#111113] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </main>
    }>
      <RegisterPageInner />
    </Suspense>
  );
}
