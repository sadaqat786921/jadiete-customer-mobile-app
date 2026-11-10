// The customer's bottom sheets: pay (card or bank transfer), ask to change the fitting date, review, sign out.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCreditCard, IconBuildingBank, IconLock, IconCheck, IconCopy, IconCircleCheck, IconInfoCircle, IconStar, IconStarFilled, IconLogout, IconCalendarEvent, IconCurrencyPound } from '@tabler/icons-react';
import { Sheet, Field, Seg, useToast } from './kit';
import { useMe } from '../data/store';
import { Invoice, Visit, BANK, gbp, fmt, addDays } from '../data/portal';

const icon = (I: any, warn?: boolean) => <span className="tile" style={{ width: 40, height: 40, borderRadius: 12, background: warn ? '#fdf3d9' : 'var(--tint)', color: warn ? '#9a6f00' : 'var(--primary-dark)' }}><I size={20} /></span>;

export function PaySheet({ inv, onClose }: { inv: Invoice; onClose: () => void }) {
  const { a, pay } = useMe();
  const toast = useToast();
  const [how, setHow] = useState<'card' | 'bank'>('card');
  const [card, setCard] = useState({ name: ({ smith: 'Sarah Smith', patel: 'R Patel', khan: 'A Khan' } as Record<string, string>)[a.id], num: '4242 4242 4242 4242', exp: '09/28', cvc: '123' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<'' | 'card' | 'bank'>('');
  const ok = card.name.trim() && card.num.replace(/\s/g, '').length === 16 && /^\d\d\/\d\d$/.test(card.exp) && card.cvc.length === 3;
  const payCard = () => { setBusy(true); setTimeout(() => { pay(inv.ref, 'Card'); setBusy(false); setDone('card'); }, 1000); };
  const copy = (t: string) => { try { navigator.clipboard?.writeText(t); } catch { /* ignore */ } toast('Copied'); };
  if (done) {
    return (
      <Sheet title={done === 'card' ? 'Payment received' : 'Thank you'} onClose={onClose} footer={<button className="btn btn-primary" onClick={onClose}>Done</button>}>
        <div className="success" style={{ padding: '8px 0', gap: 10 }}>
          <span className="ring" style={{ width: 84, height: 84 }}><IconCircleCheck size={42} /></span>
          <h2>{gbp(inv.amount)}</h2>
          <span className="t2">{done === 'card' ? `Your ${inv.type.toLowerCase()} is paid. Your receipt is in Documents and we have emailed you a copy.` : 'We will confirm when your payment arrives. This can take 1 to 2 working days.'}</span>
        </div>
      </Sheet>
    );
  }
  return (
    <Sheet full title={`Pay your ${inv.type.toLowerCase()}`} sub={`${inv.ref} · job ${a.job}`} icon={icon(IconCurrencyPound, true)} onClose={onClose}
      footer={how === 'card'
        ? <button className="btn btn-primary" disabled={!ok || busy} onClick={payCard}>{busy ? 'Paying…' : <><IconLock size={18} />Pay {gbp(inv.amount)}</>}</button>
        : <button className="btn btn-primary" onClick={() => { pay(inv.ref, 'Bank transfer'); setDone('bank'); }}><IconCheck size={18} />I have sent it</button>}>
      <div className="card flat" style={{ background: 'var(--tint)', border: 0, gap: 2 }}>
        <span className="small t2">Amount to pay</span>
        <b style={{ fontSize: 20 }}>{gbp(inv.amount)}</b>
        <span className="tiny muted">{inv.pct ? `${inv.pct}% of ${gbp(a.total)}` : ''}{inv.due ? ` · due ${fmt(inv.due)}` : ''}</span>
      </div>
      <Seg value={how} onChange={setHow} items={[{ id: 'card', label: <span className="hstack" style={{ gap: 6 }}><IconCreditCard size={16} />Card</span> }, { id: 'bank', label: <span className="hstack" style={{ gap: 6 }}><IconBuildingBank size={16} />Bank transfer</span> }]} />
      {how === 'card' ? (
        <>
          <Field label="Name on card"><input className="input" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} /></Field>
          <Field label="Card number"><input className="input" inputMode="numeric" value={card.num} onChange={e => setCard({ ...card, num: e.target.value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') })} /></Field>
          <div className="grid-2">
            <Field label="Expiry (MM/YY)"><input className="input" value={card.exp} onChange={e => setCard({ ...card, exp: e.target.value.slice(0, 5) })} /></Field>
            <Field label="Security code"><input className="input" inputMode="numeric" value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })} /></Field>
          </div>
          <span className="hstack tiny muted" style={{ gap: 6 }}><IconLock size={14} />Secure payment. We never see or keep your card number.</span>
        </>
      ) : (
        <>
          <span className="small t2">Pay from your bank app using these details. Please use the reference so we know it is from you.</span>
          <div className="card flush"><div className="list">
            {([['Account name', BANK.name], ['Sort code', BANK.sort], ['Account number', BANK.account], ['Reference', a.job], ['Amount', gbp(inv.amount)]] as [string, string][]).map(([k, v]) => (
              <div key={k} className="li" style={{ padding: '12px 14px' }}>
                <span className="vstack grow" style={{ gap: 1 }}><span className="tiny muted">{k}</span><b style={{ fontSize: 15 }}>{v}</b></span>
                {k !== 'Account name' && <button className="btn btn-grey btn-sm" onClick={() => copy(v)}><IconCopy size={16} />Copy</button>}
              </div>
            ))}
          </div></div>
        </>
      )}
    </Sheet>
  );
}

export function ChangeDateSheet({ v, onClose }: { v: Visit; onClose: () => void }) {
  const { askChange } = useMe();
  const toast = useToast();
  const [reason, setReason] = useState('');
  const [when, setWhen] = useState<string[]>([]);
  const [note, setNote] = useState('');
  return (
    <Sheet full title="Ask to change the date" sub={`Booked: ${fmt(v.date)} – ${fmt(addDays(v.date, (v.days || 1) - 1))}`} icon={icon(IconCalendarEvent)} onClose={onClose}
      footer={<button className="btn btn-primary" disabled={!reason || !when.length} onClick={() => { askChange(reason, when.join(', '), note.trim()); toast('Sent to Sarah in the office'); onClose(); }}>Send request</button>}>
      <div className="alert info"><IconInfoCircle size={17} />Your date stays booked until the office agrees a new one with you.</div>
      <Field label="Why do you need to change it?"><div className="chips wrap">{['We will be away', 'Work or family commitment', 'Not ready yet', 'Something else'].map(r => <button key={r} className={`chip ${reason === r ? 'on' : ''}`} onClick={() => setReason(r)}>{r}</button>)}</div></Field>
      <Field label="When would suit you better?" hint="Pick as many as you like"><div className="chips wrap">{['Any day next week', 'Week of 2 Nov', 'Week of 9 Nov', 'Mornings only'].map(r => <button key={r} className={`chip ${when.includes(r) ? 'on' : ''}`} onClick={() => setWhen(w => (w.includes(r) ? w.filter(x => x !== r) : [...w, r]))}>{r}</button>)}</div></Field>
      <Field label="Anything else? (optional)"><textarea className="textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="For example: we are away from 24 October" /></Field>
    </Sheet>
  );
}

export function ReviewSheet({ onClose }: { onClose: () => void }) {
  const { a, review } = useMe();
  const toast = useToast();
  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  return (
    <Sheet title="How did we do?" sub={`${a.products} · ${a.job}`} icon={icon(IconStar)} onClose={onClose}
      footer={<button className="btn btn-primary" disabled={!stars} onClick={() => { review(stars, text.trim()); toast('Thank you for your review'); onClose(); }}>Send review</button>}>
      <div className="vstack" style={{ alignItems: 'center', gap: 6 }}>
        <div className="hstack" style={{ gap: 4 }}>{[1, 2, 3, 4, 5].map(s => <button key={s} className="icon-btn ghost" aria-label={`${s} star${s > 1 ? 's' : ''}`} onClick={() => setStars(s)}>{s <= stars ? <IconStarFilled size={30} color="#e0a100" /> : <IconStar size={30} color="#b6c2bf" />}</button>)}</div>
        <span className="small t2">{['Tap a star', 'Poor', 'Not great', 'OK', 'Good', 'Excellent'][stars]}</span>
      </div>
      <Field label="Tell us more (optional)"><textarea className="textarea" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="What went well? What could we do better?" /></Field>
    </Sheet>
  );
}

export function Stars({ n }: { n: number }) { return <span className="hstack" style={{ gap: 2 }}>{[1, 2, 3, 4, 5].map(s => s <= n ? <IconStarFilled key={s} size={16} color="#e0a100" /> : <IconStar key={s} size={16} color="#b6c2bf" />)}</span>; }

export function SignOutSheet({ onClose }: { onClose: () => void }) {
  const { setMe } = useMe();
  const nav = useNavigate();
  return (
    <Sheet title="Sign out?" sub="You can sign in again with a code sent to your email." onClose={onClose} footer={<><button className="btn btn-grey" onClick={onClose}>Cancel</button><button className="btn btn-danger" onClick={() => { setMe(null); nav('/login'); }}><IconLogout size={18} />Sign out</button></>}>
      <span className="t2">Everything about your job stays safe here.</span>
    </Sheet>
  );
}
