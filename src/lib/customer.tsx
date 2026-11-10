// Customer app logic shared by every screen: where the job is up to, things to do, getting ready, downloads.
import React from 'react';
import { IconCheck, IconTruck, IconCalendarEvent, IconCurrencyPound, IconFileText, IconTool, IconMessage, IconShieldCheck, IconCircleCheck, IconBuildingBank, IconStar } from '@tabler/icons-react';
import { Acct } from '../data/store';
import { Doc, Invoice, IssueStatus, Upd, gbp, fmt, fmtLong, addDays, Visit } from '../data/portal';

/* ---------- Journey ---------- */
export type JStep = { label: string; when?: string; state: 'done' | 'now' | 'next' };
export function journey(a: Acct): JStep[] {
  const fitDone = a.phase !== 'before';
  const fit = a.visits.find(v => v.kind === 'Installation')!;
  const del = a.visits.find(v => v.kind === 'Delivery')!;
  const fs = a.visits.find(v => v.kind === 'Final survey')!;
  const allDone = a.phase === 'done';
  const s = (label: string, done: boolean, now: boolean, when?: string): JStep => ({ label, when, state: done ? 'done' : now ? 'now' : 'next' });
  return [
    s('Order agreed', true, false, a.invoices[0].paidOn),
    s('Final survey', true, false, fmt(fs.date, { day: 'numeric', month: 'short' })),
    s('Being made', a.order.status !== 'Being made', a.order.status === 'Being made', `Ordered ${a.order.ordered}`),
    s('Delivery', a.order.status === 'Delivered', a.order.status === 'On the way', fmt(del.date, { day: 'numeric', month: 'short' })),
    s('Fitting', fitDone, false, fit.days && fit.days > 1 ? `${fmt(fit.date, { day: 'numeric', month: 'short' })} – ${fmt(addDays(fit.date, fit.days - 1), { day: 'numeric', month: 'short' })}` : fmt(fit.date, { day: 'numeric', month: 'short' })),
    s('Final checks', allDone || !!a.happy, a.phase === 'checks' && !a.happy),
    s('All done', allDone, a.phase === 'checks' && !!a.happy),
  ];
}

export function headline(a: Acct): { title: string; sub: string } {
  const fit = a.visits.find(v => v.kind === 'Installation')!;
  if (a.phase === 'before') {
    return a.order.status === 'On the way'
      ? { title: 'Your new windows are on their way', sub: `Fitting starts ${fmtLong(fit.date)}` }
      : { title: 'Your windows are being made', sub: `Fitting starts ${fmtLong(fit.date)}` };
  }
  if (a.phase === 'checks') {
    if (!a.happy) return { title: 'Your repairs are done', sub: 'Please check them and tell us you are happy' };
    return { title: 'Your job is finished', sub: 'Thank you. Your final payment is the last step.' };
  }
  const g = a.docs.find(d => d.id === 'd-guarantee');
  return { title: 'All done · enjoy your new ' + (a.id === 'khan' ? 'roof' : 'windows'), sub: g?.about ? `Your 10-year guarantee is ${g.about.charAt(0).toLowerCase() + g.about.slice(1)}` : 'Your guarantee is in Documents' };
}

/* ---------- Things to do ---------- */
export type Todo = { id: string; title: string; sub: string; tone: 'warn' | 'jade' | 'ok' | 'info'; icon: React.ReactNode; to?: string; act?: string; label?: string };
export function useTodos(a: Acct): Todo[] {
  const t: Todo[] = [];
  const fit = a.visits.find(v => v.kind === 'Installation' && v.status === 'Booked');
  if (a.phase === 'checks' && !a.happy) {
    const open = a.issues.filter(i => i.status !== 'Fixed');
    t.push(open.length
      ? { id: 'track', title: 'We are looking into what is not fixed', sub: 'Sarah will call you to arrange another visit', tone: 'info', icon: <IconTool size={20} />, to: '/help', label: 'See my requests' }
      : { id: 'signoff', title: 'Check the repairs and confirm you are happy', sub: 'Amir fixed the scratch and the handle this morning', tone: 'warn', icon: <IconCheck size={20} />, to: '/sign-off', label: 'Check now' });
  }
  a.invoices.filter(i => i.status === 'Due').forEach(i => t.push({ id: 'pay-' + i.ref, title: `Pay your ${i.type.toLowerCase()} · ${gbp(i.amount)}`, sub: `Due ${fmt(i.due)} · ${i.ref}`, tone: 'warn', icon: <IconCurrencyPound size={20} />, act: 'pay:' + i.ref, label: 'Pay now' }));
  a.invoices.filter(i => i.status === 'Checking').forEach(i => t.push({ id: 'chk-' + i.ref, title: `We are checking your bank transfer · ${gbp(i.amount)}`, sub: 'It can take 1 to 2 working days to show. Nothing else to do.', tone: 'info', icon: <IconBuildingBank size={20} />, to: '/payments', label: 'See payments' }));
  if (fit && !a.confirmed && !a.change) t.push({ id: 'confirm', title: 'Confirm your fitting dates', sub: `${fmt(fit.date)} – ${fmt(addDays(fit.date, (fit.days || 1) - 1))} · arrive 08:00 – 09:00`, tone: 'jade', icon: <IconCalendarEvent size={20} />, to: '/dates', label: 'Confirm' });
  if (fit && a.change) t.push({ id: 'change', title: 'You asked to change your fitting date', sub: 'Sarah will call you within 1 working day to agree a new date', tone: 'info', icon: <IconCalendarEvent size={20} />, to: '/dates', label: 'See my dates' });
  if (fit) { const n = Object.values(a.prep).filter(Boolean).length; if (n < PREP.length) t.push({ id: 'prep', title: 'Get ready for fitting day', sub: `${n} of ${PREP.length} done`, tone: 'jade', icon: <IconCheck size={20} />, to: '/dates/prepare', label: 'Open checklist' }); }
  a.issues.filter(i => i.kind === 'Aftercare' && i.status !== 'Fixed').forEach(i => t.push({ id: 'iss-' + i.id, title: `${i.title}`, sub: `${i.id} · ${i.status}${i.visit ? ` · ${i.visit}` : ''}`, tone: 'info', icon: <IconTool size={20} />, to: `/help/${i.id}`, label: 'Track it' }));
  if ((a.phase === 'done' || a.happy) && !a.review) t.push({ id: 'review', title: 'How did we do?', sub: 'Tell us about your experience. It takes a minute.', tone: 'jade', icon: <IconStar size={20} />, act: 'review', label: 'Leave a review' });
  return t;
}

/* ---------- Getting ready for fitting day ---------- */
export const PREP: { id: string; t: string; d: string }[] = [
  { id: 'space', t: 'Clear about 1 metre inside each window and the front door', d: 'Move furniture back so the fitters can work safely.' },
  { id: 'curtains', t: 'Take down curtains, blinds and poles', d: 'We cannot refit these for you.' },
  { id: 'sills', t: 'Clear the window sills', d: 'Ornaments, plants and photos.' },
  { id: 'drive', t: 'Keep the driveway clear for the van', d: 'The van needs to park close to the house on both days.' },
  { id: 'pets', t: 'Keep pets in another room', d: 'Doors will be open while the old frames come out.' },
  { id: 'adult', t: 'Make sure someone over 18 is home on both days', d: 'We need you at the start of day 1 and at the end of day 2 to sign the handover.' },
];

/* ---------- Icons for updates ---------- */
const UI: Record<Upd['icon'], any> = { check: IconCircleCheck, truck: IconTruck, calendar: IconCalendarEvent, pound: IconCurrencyPound, file: IconFileText, tool: IconTool, message: IconMessage, shield: IconShieldCheck };
export function UpdIcon({ i, size = 36 }: { i: Upd['icon']; size?: number }) { const I = UI[i]; return <span className="tile" style={{ width: size, height: size, borderRadius: size / 2, background: i === 'pound' ? '#fdf3d9' : 'var(--tint)', color: i === 'pound' ? '#9a6f00' : 'var(--primary-dark)' }}><I size={Math.round(size * 0.5)} /></span>; }
export const updLink: Record<Upd['icon'], string> = { check: '/', truck: '/order', calendar: '/dates', pound: '/payments', file: '/documents', tool: '/help', message: '/messages', shield: '/documents' };

export const issueTone = (s: IssueStatus) => (s === 'Fixed' ? 'ok' : s === 'Visit booked' ? 'jade' : 'warn');
export const invTone = (s: Invoice['status']) => (s === 'Paid' ? 'ok' : s === 'Due' ? 'warn' : s === 'Checking' ? 'jade' : 'grey');

/* ---------- Downloads (documents and calendar) ---------- */
function save(name: string, body: string, type: string) {
  try {
    const url = URL.createObjectURL(new Blob([body], { type }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { /* preview may block downloads */ }
}
export function downloadDoc(d: Doc, a: Acct) {
  const rows = (d.lines || []).map(([k, v]) => `<tr><td style="color:#6b7a78;padding:6px 16px 6px 0">${k}</td><td><b>${v}</b></td></tr>`).join('');
  save(`${d.name}.html`, `<!doctype html><meta charset="utf-8"><title>${d.name}</title><body style="font-family:Arial,sans-serif;max-width:640px;margin:40px auto;color:#0f1414"><h2 style="color:#0b6e5c">Jadeite Glazing</h2><h1>${d.name}</h1><p>${a.name} · ${a.address} · ${a.job}</p><p>${d.about}</p><table>${rows}</table></body>`, 'text/html');
}
export function addToCalendar(v: Visit, a: Acct) {
  const d = v.date.replace(/-/g, '');
  const end = addDays(v.date, v.days || 1).replace(/-/g, '');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Jadeite//Customer portal//EN', 'BEGIN:VEVENT', `UID:${a.job}-${v.id}@jadeite`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:Jadeite ${v.kind.toLowerCase()}`, `DESCRIPTION:${v.time}. ${v.what}`, `LOCATION:${a.address}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  save(`Jadeite ${v.kind}.ics`, ics, 'text/calendar');
}

