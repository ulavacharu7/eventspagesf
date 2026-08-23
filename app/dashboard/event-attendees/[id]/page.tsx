'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  GoArrowLeft, GoPeople, GoCheck, 
  GoX, GoCalendar, GoLocation, GoTag, GoSearch,
  GoDownload
} from 'react-icons/go';

interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string | null;
  ticketCode: string;
  answers: string | null;
  paymentAccountName: string | null;
  paymentMethod: string | null;
  paymentTxnId: string | null;
  status: string;
  createdAt: string;
}

interface EventData {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  location: string | null;
  price: string;
  requireApproval: boolean;
}

export default function EventAttendeesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvingIds, setApprovingIds] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState<'PDF' | 'XLS' | null>(null);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
      }
    } catch (err) {
      console.error('Failed to fetch event:', err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`/api/events/${id}/register`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([fetchEventDetails(), fetchRegistrations()]).finally(() => {
        setLoading(false);
      });
    }
  }, [id]);

  const handleApproveUser = async (regId: string) => {
    setApprovingIds(prev => ({ ...prev, [regId]: true }));
    try {
      const res = await fetch(`/api/registrations/${regId}/approve`, { method: 'POST' });
      if (res.ok) {
        setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'APPROVED' } : r));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to approve registration.');
      }
    } catch {
      alert('Failed to approve registration.');
    } finally {
      setApprovingIds(prev => ({ ...prev, [regId]: false }));
    }
  };

  // ── Export to XLS ─────────────────────────────────────────────────────────
  const handleExportXLS = async () => {
    setExporting('XLS');
    try {
      const XLSX = await import('xlsx');
      const rows = registrations.map((reg, idx) => {
        let answers: Record<string, string> = {};
        try { answers = reg.answers ? JSON.parse(reg.answers) : {}; } catch {}
        return {
          '#': idx + 1,
          'Name': reg.name,
          'Email': reg.email,
          'Phone': reg.phone || '',
          'Ticket Code': reg.ticketCode,
          'Status': reg.status,
          'Payment Method': reg.paymentMethod || '',
          'Account Name': reg.paymentAccountName || '',
          'Transaction ID': reg.paymentTxnId || '',
          'Registered At': new Date(reg.createdAt).toLocaleString(),
          ...Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, String(v)])),
        };
      });

      const ws = XLSX.utils.json_to_sheet(rows);

      // Auto-size columns
      const colWidths = Object.keys(rows[0] || {}).map(key => ({
        wch: Math.max(key.length, ...rows.map(r => String((r as Record<string, unknown>)[key] ?? '').length)) + 2,
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendees');
      const fileName = `attendees_${event?.title?.replace(/[^a-z0-9]/gi, '_') || id}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error('XLS export error:', err);
      alert('Failed to export Excel file.');
    } finally {
      setExporting(null);
    }
  };

  // ── Export to PDF ─────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    setExporting('PDF');
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Ultra-Clean Light Header (White background with crisp dark typography)
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 75, 'F');

      // Top Brand Header
      doc.setTextColor(24, 24, 27);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('STUDENT FORGE', 28, 24);

      // Report Sub-title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(24, 24, 27);
      doc.text('Event Attendees Report', 28, 42);

      // Event Name
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(82, 82, 91);
      doc.text(event?.title || 'Event Roster', 28, 56);

      // Right-aligned Export Metadata
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(113, 113, 122);
      doc.text(`Exported: ${new Date().toLocaleString()}`, pageWidth - 28, 42, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(24, 24, 27);
      doc.text(`Total Registrations: ${registrations.length}`, pageWidth - 28, 56, { align: 'right' });

      // Subtle Divider Hairline Line
      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(0.5);
      doc.line(28, 64, pageWidth - 28, 64);

      const tableRows = registrations.map((reg, idx) => {
        let answers = '';
        try {
          const parsed = reg.answers ? JSON.parse(reg.answers) : {};
          answers = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join('; ');
        } catch {}
        return [
          idx + 1,
          reg.name || '—',
          reg.email || '—',
          reg.phone || '—',
          reg.ticketCode || '—',
          reg.status || 'APPROVED',
          reg.paymentMethod || '—',
          reg.paymentTxnId || '—',
          answers || '—',
          new Date(reg.createdAt).toLocaleDateString(),
        ];
      });

      autoTable(doc, {
        startY: 74,
        head: [['#', 'Name', 'Email', 'Phone', 'Ticket Code', 'Status', 'Payment', 'Txn ID', 'Answers', 'Date']],
        body: tableRows,
        styles: {
          fontSize: 7.5,
          cellPadding: 6,
          textColor: [24, 24, 27],
          valign: 'middle',
          lineColor: [228, 228, 231],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [244, 244, 245], // Crisp soft light gray header bar
          textColor: [24, 24, 27], // Dark crisp header text
          fontStyle: 'bold',
          fontSize: 7.5,
          halign: 'left',
          lineColor: [228, 228, 231],
          lineWidth: 0.4,
        },
        alternateRowStyles: {
          fillColor: [252, 252, 253],
        },
        columnStyles: {
          0: { cellWidth: 24, halign: 'center' },
          1: { cellWidth: 96, fontStyle: 'bold' },
          2: { cellWidth: 165 }, // Generous width for email addresses to stay on 1 clean line!
          3: { cellWidth: 76 },
          4: { cellWidth: 80, fontStyle: 'bold' },
          5: { cellWidth: 65, halign: 'center', fontStyle: 'bold' }, // Prevents APPROVED from wrapping!
          6: { cellWidth: 55, halign: 'center' },
          7: { cellWidth: 105 }, // Generous width for transaction IDs!
          8: { cellWidth: 70 },
          9: { cellWidth: 49, halign: 'center' },
        },
        margin: { left: 28, right: 28 },
        didDrawPage: (data) => {
          // Page footer
          const pageCount = (doc as unknown as { internal: { pages: unknown[] } }).internal.pages.length - 1;
          doc.setFontSize(7);
          doc.setTextColor(140, 140, 148);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}  ·  StudentForge Events`,
            28,
            doc.internal.pageSize.getHeight() - 14
          );
        },
      });

      const fileName = `attendees_${event?.title?.replace(/[^a-z0-9]/gi, '_') || id}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to export PDF file.');
    } finally {
      setExporting(null);
    }
  };

  // Filter registrations
  const filteredRegs = registrations.filter(reg => {
    const query = searchQuery.toLowerCase();
    return (
      reg.name.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      reg.ticketCode.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col font-tight select-none">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-12 sm:pt-16 md:pt-20 pb-12 flex flex-col gap-6">
        
        {/* Navigation Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors text-left cursor-pointer w-fit bg-transparent border-none outline-none"
            >
              <GoArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <h1 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.6px] leading-tight flex items-center gap-2">
              <GoPeople className="text-[#ff6b6b] w-6 h-6" />
              <span>Event</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] via-[#f97316] to-[#fbbf24]">
                Attendees
              </span>
            </h1>
            {event && (
              <p className="text-xs sm:text-sm text-white/50 font-normal">
                Guest list for <span className="text-white font-medium">&quot;{event.title}&quot;</span>
              </p>
            )}
          </div>

          {/* Export Tools */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={handleExportPDF}
              disabled={!!exporting || registrations.length === 0}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white/80 hover:text-white text-xs font-semibold rounded-[8px] border border-white/10 transition-all cursor-pointer shadow-sm flex items-center gap-2 active:scale-95"
            >
              <GoDownload className="w-3.5 h-3.5 text-rose-400" />
              {exporting === 'PDF' ? 'Exporting…' : 'Export PDF'}
            </button>
            <button
              onClick={handleExportXLS}
              disabled={!!exporting || registrations.length === 0}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white/80 hover:text-white text-xs font-semibold rounded-[8px] border border-white/10 transition-all cursor-pointer shadow-sm flex items-center gap-2 active:scale-95"
            >
              <GoDownload className="w-3.5 h-3.5 text-emerald-400" />
              {exporting === 'XLS' ? 'Exporting…' : 'Export XLS'}
            </button>
          </div>
        </div>

        {/* Quick Event Summary Strip */}
        {event && (
          <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 text-xs text-white/50">
            <div className="flex items-center gap-1.5"><GoCalendar className="w-3.5 h-3.5 text-white/40" /> Date: <span className="text-white font-medium">{event.startDate} at {event.startTime}</span></div>
            <div className="flex items-center gap-1.5"><GoLocation className="w-3.5 h-3.5 text-white/40" /> Venue: <span className="text-white font-medium truncate max-w-[200px]">{event.location || 'Online'}</span></div>
            <div className="flex items-center gap-1.5"><GoTag className="w-3.5 h-3.5 text-white/40" /> Price: <span className="text-white font-medium">{event.price}</span></div>
            <div className="ml-auto bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-white/80 font-medium">Total Registered: <span className="text-[#ff6b6b] font-bold">{registrations.length}</span></div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-[#18181c]/80 border border-white/10 focus-within:border-white/30 rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
          <GoSearch className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search attendee by name, email, or ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-white/30 outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
              <GoX className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Attendee Roster */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-[#18181c]/60 border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredRegs.length === 0 ? (
          <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <GoPeople className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-instrument-serif text-xl sm:text-2xl text-white font-normal">No attendees found</h3>
              <p className="text-xs text-white/50 mt-1 font-normal">
                {searchQuery ? 'Try adjusting your search terms.' : 'Attendees who register will appear here.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredRegs.map((reg) => (
              <div key={reg.id} className="flex flex-col md:flex-row md:items-center justify-between bg-[#18181c]/80 border border-white/10 rounded-2xl p-4 gap-4 shadow-sm hover:border-white/20 transition-colors animate-fade-in">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/80 flex-shrink-0">
                    {reg.name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-white truncate max-w-[200px]">{reg.name || 'Anonymous'}</p>
                      {reg.status === 'PENDING' ? (
                        <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono font-semibold animate-pulse">
                          Pending Approval
                        </span>
                      ) : (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-semibold">
                          Approved
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/40 font-mono truncate mt-0.5">{reg.email}</p>

                    {reg.answers && (() => {
                      try {
                        const parsedAns = JSON.parse(reg.answers);
                        return (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {Object.entries(parsedAns).map(([k, v]) => (
                              <span key={k} className="text-[9px] bg-[#222226] text-neutral-300 px-1.5 py-0.5 rounded border border-[#2e2e34]">
                                <strong>{k}:</strong> {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                              </span>
                            ))}
                          </div>
                        );
                      } catch { return null; }
                    })()}

                    {reg.paymentTxnId && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                          Paid via {reg.paymentMethod} ({reg.paymentAccountName})
                        </span>
                        <span className="text-[9px] bg-[#222226] text-neutral-400 border border-[#2e2e34] px-1.5 py-0.5 rounded font-mono">
                          Txn: {reg.paymentTxnId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-[#2e2e34] pt-3 md:pt-0">
                  <div className="flex flex-col md:items-end">
                    <span className="text-[8px] uppercase font-mono text-neutral-500">Ticket Code</span>
                    <span className="text-xs font-mono font-bold text-neutral-300">{reg.ticketCode}</span>
                  </div>

                  {reg.status === 'PENDING' && (
                    <button
                      onClick={() => handleApproveUser(reg.id)}
                      disabled={approvingIds[reg.id]}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      {approvingIds[reg.id] ? 'Approving…' : 'Approve Guest'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export hint footer */}
        {registrations.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] text-neutral-500">
              Showing {filteredRegs.length} of {registrations.length} attendee{registrations.length !== 1 ? 's' : ''}
            </p>
            <p className="text-[10px] text-neutral-600">
              Use &quot;Export PDF&quot; or &quot;Export XLS&quot; to download the full list
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
