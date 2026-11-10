// Shared demo state for the Customer portal (saved in sessionStorage; "Reset demo data" clears it).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SEED, Account, AcctId, Msg, Issue, Invoice, nowStamp } from './portal';

export type Prefs = { email: boolean; text: boolean; visits: boolean; payments: boolean; updates: boolean };
export type Extra = {
  confirmed?: string;                                           // fitting date confirmed by the customer
  change?: { reason: string; dates: string; note: string; on: string }; // asked to change the fitting date
  prep: Record<string, boolean>;                                // getting-ready checklist
  happy?: { on: string; name: string };                         // confirmed the repairs online
  onboarded: boolean;                                           // welcome done this session
  prefs: Prefs;
  notifsRead: boolean;
};
export type Acct = Account & Extra;
type State = { me: AcctId | null; data: Record<AcctId, Acct> };

const KEY = 'jadeite-customer-mobile-v1';
const fresh = (): State => ({
  me: null,
  data: Object.fromEntries(Object.entries(SEED).map(([k, a]) => [k, { ...structuredClone(a), prep: k === 'smith' ? { curtains: true, sills: true } : {}, onboarded: false, notifsRead: false, prefs: { email: true, text: true, visits: true, payments: true, updates: true } }])) as Record<AcctId, Acct>,
});
const load = (): State => { try { const s = sessionStorage.getItem(KEY); if (s) return JSON.parse(s); } catch { /* ignore */ } return fresh(); };

type Ctx = { st: State; setMe: (id: AcctId | null) => void; upd: (fn: (a: Acct) => Partial<Acct>) => void; reset: () => void };
const C = createContext<Ctx>(null as any);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [st, setSt] = useState<State>(load);
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch { /* ignore */ } }, [st]);
  const setMe = (id: AcctId | null) => setSt(s => ({ ...s, me: id }));
  const upd = (fn: (a: Acct) => Partial<Acct>) => setSt(s => (s.me ? { ...s, data: { ...s.data, [s.me]: { ...s.data[s.me], ...fn(s.data[s.me]) } } } : s));
  const reset = () => setSt(s => ({ ...fresh(), me: s.me }));
  return <C.Provider value={{ st, setMe, upd, reset }}>{children}</C.Provider>;
}

export const useStore = () => useContext(C);

// The signed-in customer and everything they can do.
export function useMe() {
  const { st, upd, setMe, reset } = useStore();
  const a = st.data[st.me || 'smith'];
  const say = (text: string, photos?: number) => upd(x => ({ msgs: [...x.msgs, { id: 'm' + Date.now(), from: 'me', who: x.name, text, when: nowStamp(), photos } as Msg] }));
  const sys = (x: Acct, text: string): Msg[] => [...x.msgs, { id: 's' + Date.now() + Math.random(), from: 'system', who: 'Jadeite', text, when: nowStamp() }];
  const unread = a.msgs.filter(m => m.from === 'office' && !m.read).length;
  return {
    a, unread, setMe, reset,
    say,
    readAll: () => upd(x => ({ msgs: x.msgs.map(m => ({ ...m, read: true })) })),
    readNotifs: () => upd(() => ({ notifsRead: true })),
    setPrep: (k: string, v: boolean) => upd(x => ({ prep: { ...x.prep, [k]: v } })),
    onboard: () => upd(() => ({ onboarded: true })),
    setPrefs: (p: Partial<Prefs>) => upd(x => ({ prefs: { ...x.prefs, ...p } })),
    setDetails: (p: { phone: string; email: string }) => upd(x => ({ ...p, msgs: sys(x, 'You updated your contact details') })),
    confirmFit: () => upd(x => ({ confirmed: nowStamp(), change: undefined, msgs: sys(x, 'You confirmed your fitting date'), updates: [{ when: '16 Oct', text: 'You confirmed your fitting date', icon: 'check' }, ...x.updates] })),
    askChange: (reason: string, dates: string, note: string) => upd(x => ({
      change: { reason, dates, note, on: nowStamp() }, confirmed: undefined,
      msgs: [...x.msgs, { id: 'm' + Date.now(), from: 'me', who: x.name, text: `Please can we change the fitting date? Reason: ${reason}. Better for us: ${dates}.${note ? ' ' + note : ''}`, when: nowStamp() }],
    })),
    cancelChange: () => upd(x => ({ change: undefined, msgs: sys(x, 'You cancelled your request to change the date') })),
    pay: (ref: string, method: 'Card' | 'Bank transfer') => upd(x => {
      const inv = x.invoices.find(i => i.ref === ref)!;
      const card = method === 'Card';
      const invoices: Invoice[] = x.invoices.map(i => (i.ref === ref ? { ...i, status: card ? 'Paid' : 'Checking', paidOn: card ? '16 Oct' : undefined, method } : i));
      const allPaid = invoices.every(i => i.status === 'Paid');
      return {
        invoices,
        docs: card ? x.docs.map(d => (d.id === `d-${ref.toLowerCase().replace('-', '')}` ? { ...d, name: `${inv.type} receipt ${ref}`, added: '16 Oct', about: `£${inv.amount.toLocaleString('en-GB')} paid by card` } : d)) : x.docs,
        phase: card && allPaid && x.phase === 'checks' && x.happy ? 'done' : x.phase,
        msgs: sys(x, card ? `Payment received · ${inv.type} £${inv.amount.toLocaleString('en-GB')}` : `You told us you sent £${inv.amount.toLocaleString('en-GB')} by bank transfer`),
        updates: [{ when: '16 Oct', text: card ? `${inv.type} paid · £${inv.amount.toLocaleString('en-GB')}${allPaid ? ' · paid in full' : ''}` : `Bank transfer sent · we will confirm when it arrives`, icon: 'pound' }, ...x.updates],
      };
    }),
    // Patel: confirm the repairs online → job closed → guarantee published → final invoice sent
    signOff: (name: string) => upd(x => ({
      happy: { on: '16 Oct', name },
      invoices: x.invoices.map(i => (i.status === 'On hold' ? { ...i, status: 'Due', due: '2026-10-30', note: 'Due within 14 days' } : i)),
      docs: x.docs.map(d => (d.group === 'Guarantee and care' ? { ...d, locked: undefined, added: '16 Oct' } : d)).map(d => (d.id === 'd-guarantee' ? { ...d, about: 'Valid until 9 Oct 2036', lines: [['Covers', 'Frames, glass and fitting'], ['From', '09 Oct 2026'], ['Until', '09 Oct 2036'], ['Number', 'GU-10471']] as [string, string][] } : d)).concat(x.docs.some(d => d.id === 'd-inv3369') ? [] : [{ id: 'd-inv3369', name: 'Final payment invoice INV-3369', group: 'Payments', added: '16 Oct', pages: 1, about: '£802 due by Fri 30 Oct' }]),
      msgs: [...sys(x, `You confirmed you are happy with the repairs · signed by ${name}`), { id: 'o' + Date.now(), from: 'office', who: 'Sarah Mitchell', text: 'Thank you, Mrs Patel! Your job is now finished. Your 10-year guarantee and FENSA certificate are in Documents, and your final invoice for £802 is in Payments.', when: nowStamp() }],
      updates: [{ when: '16 Oct', text: 'Final invoice sent · £802', icon: 'pound' }, { when: '16 Oct', text: 'Guarantee and FENSA certificate added', icon: 'shield' }, { when: '16 Oct', text: 'You confirmed you are happy with the repairs', icon: 'check' }, ...x.updates],
    })),
    notFixed: (ids: string[], note: string) => upd(x => ({
      issues: x.issues.map(i => (ids.includes(i.id) ? { ...i, status: 'Looking into it', fixedOn: undefined, log: [...i.log, { when: '16 Oct', text: `You said it is not fixed yet${note ? `: ${note}` : ''}` }] } : i)),
      msgs: [...x.msgs, { id: 'm' + Date.now(), from: 'me', who: x.name, text: `Not fixed yet: ${x.issues.filter(i => ids.includes(i.id)).map(i => i.title.toLowerCase()).join(' and ')}.${note ? ' ' + note : ''}`, when: nowStamp() }],
      updates: [{ when: '16 Oct', text: 'You told us something is not fixed yet', icon: 'tool' }, ...x.updates],
    })),
    report: (p: Omit<Issue, 'id' | 'status' | 'log' | 'reported' | 'by' | 'kind'>) => {
      const id = 'AC-' + (130 + a.issues.filter(i => i.kind === 'Aftercare').length);
      upd(x => ({
        issues: [{ ...p, id, kind: 'Aftercare', status: 'Received', reported: '16 Oct', by: 'You', log: [{ when: '16 Oct', text: `Sent by you${p.photos ? ` with ${p.photos} photo${p.photos > 1 ? 's' : ''}` : ''}` }] }, ...x.issues],
        msgs: sys(x, `You reported a problem · ${p.title} (${id})`),
        updates: [{ when: '16 Oct', text: `Problem reported · ${p.title}`, icon: 'tool' }, ...x.updates],
      }));
      return id;
    },
    addToIssue: (id: string, text: string, photos: number) => upd(x => ({ issues: x.issues.map(i => (i.id === id ? { ...i, photos: (i.photos || 0) + photos, log: [...i.log, { when: '16 Oct', text: `You added: ${text || `${photos} photo${photos > 1 ? 's' : ''}`}` }] } : i)) })),
    cancelIssue: (id: string) => upd(x => ({ issues: x.issues.filter(i => i.id !== id), msgs: sys(x, `You cancelled request ${id}`) })),
    review: (stars: number, text: string) => upd(x => ({ review: { stars, text, on: '16 Oct' }, updates: [{ when: '16 Oct', text: `Thank you for your ${stars}-star review`, icon: 'message' }, ...x.updates] })),
  };
}
