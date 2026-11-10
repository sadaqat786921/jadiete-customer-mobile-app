// Sign in with email and a one-time code (no password), the invite email, sign-in paused, and the first-time welcome.
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { IconMail, IconArrowRight, IconChevronLeft, IconShieldLock, IconLock, IconPhone, IconCheck, IconCalendarEvent, IconFileText, IconCurrencyPound, IconMessage, IconLifebuoy, IconShieldCheck } from '@tabler/icons-react';
import { StatusBar, Field, Switch, useToast } from '../ui/kit';
import { useStore, useMe } from '../data/store';
import { ACCOUNTS, IMG, OFFICE, SEED, AcctId } from '../data/portal';

const CODE = '482193';

function Top({ title, sub, photo = IMG.house }: { title: string; sub: string; photo?: string }) {
  return (
    <div className="top">
      <div className="photo" style={{ backgroundImage: `url(${photo})` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><StatusBar light /></div>
      <div className="hstack" style={{ gap: 10, marginBottom: 'auto', marginTop: 70 }}><img src="images/mark-glass.svg" alt="" style={{ width: 38, height: 38 }} onError={e => ((e.target as HTMLImageElement).src = 'images/mark.svg')} /><b style={{ fontSize: 20 }}>Jadeite</b><span className="tag glass" style={{ marginLeft: 'auto' }}>My Jadeite</span></div>
      <h1 style={{ fontSize: 20, letterSpacing: -0.6, lineHeight: 1.15 }}>{title}</h1>
      <span style={{ color: '#cfe0db', fontSize: 14, marginTop: 6 }}>{sub}</span>
    </div>
  );
}

export function Login() {
  const nav = useNavigate();
  const toast = useToast();
  const loc = useLocation() as any;
  const [email, setEmail] = useState<string>(loc.state?.email || ACCOUNTS[0].email);
  const ok = /.+@.+\..+/.test(email.trim());
  const id = ACCOUNTS.find(x => x.email === email.trim().toLowerCase())?.id || 'smith';
  const go = () => { toast(`Code sent to ${email.trim()}`); nav('/code', { state: { email: email.trim(), id } }); };
  return (
    <div className="auth">
      <Top title="Your new windows, every step of the way" sub="Dates, documents, payments and the office, in one place." />
      <div className="form">
        <Field label="Email address" hint="Use the email you gave us. There is no password."><div className="input-icon"><IconMail size={19} /><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email address" /></div></Field>
        <button className="btn btn-primary btn-block" disabled={!ok} onClick={go}>Send me a code<IconArrowRight size={18} /></button>
        <div className="vstack" style={{ gap: 8 }}>
          <span className="tiny muted">Demo: choose a customer</span>
          {ACCOUNTS.map(x => (
            <button key={x.id} className="file" style={{ borderColor: email === x.email ? 'var(--primary)' : undefined, boxShadow: email === x.email ? '0 0 0 3px rgba(0,199,161,.12)' : undefined }} onClick={() => setEmail(x.email)}>
              <img src={IMG[x.photo]} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
              <span className="vstack grow" style={{ gap: 1, minWidth: 0 }}><b style={{ fontSize: 14 }}>{x.name}</b><span className="tiny muted ell">{x.sub}</span></span>
              {email === x.email && <span className="tile" style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--primary)', color: 'var(--deep)' }}><IconCheck size={14} stroke={3} /></span>}
            </button>
          ))}
        </div>
        <button className="link" style={{ alignSelf: 'center' }} onClick={() => nav('/invite')}>See the invite email a new customer gets</button>
      </div>
    </div>
  );
}

export function Code() {
  const nav = useNavigate();
  const toast = useToast();
  const loc = useLocation() as any;
  const { setMe, st } = useStore();
  const email: string = loc.state?.email || ACCOUNTS[0].email;
  const id: AcctId = loc.state?.id || 'smith';
  const [d, setD] = useState(['', '', '', '', '', '']);
  const [tries, setTries] = useState(0);
  const [bad, setBad] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { refs.current[0]?.focus(); }, []);
  const code = d.join('');
  const verify = () => {
    if (code === CODE) { setMe(id); nav(st.data[id].onboarded ? '/' : '/welcome/1'); return; }
    const n = tries + 1; setTries(n); setBad(true); setD(['', '', '', '', '', '']); refs.current[0]?.focus();
    if (n >= 3) nav('/locked');
  };
  const put = (i: number, val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length > 1) { const nd = digits.slice(0, 6).split(''); setD([...nd, ...Array(6 - nd.length).fill('')]); refs.current[Math.min(5, nd.length)]?.focus(); setBad(false); return; }
    const nd = [...d]; nd[i] = digits; setD(nd); setBad(false);
    if (digits && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <div className="auth">
      <StatusBar />
      <div className="form" style={{ paddingTop: 8 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/login', { state: { email } })}><IconChevronLeft size={22} /></button>
        <span className="tile" style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--tint)', color: 'var(--primary-dark)' }}><IconShieldLock size={30} /></span>
        <div className="vstack" style={{ gap: 6 }}><h1 style={{ fontSize: 20, letterSpacing: -0.5 }}>Check your email</h1><span className="t2">We sent a 6-digit code to <b>{email}</b>. It works for 10 minutes.</span></div>
        <div className={`codebox ${bad ? 'bad' : ''}`}>
          {d.map((x, i) => <input key={i} ref={el => { refs.current[i] = el; }} inputMode="numeric" maxLength={6} value={x} aria-label={`Digit ${i + 1}`} onChange={e => put(i, e.target.value)} onKeyDown={e => { if (e.key === 'Backspace' && !d[i] && i > 0) refs.current[i - 1]?.focus(); if (e.key === 'Enter' && code.length === 6) verify(); }} />)}
        </div>
        {bad && <div className="alert err"><IconShieldLock size={17} />That code is not right. {3 - tries} {3 - tries === 1 ? 'try' : 'tries'} left.</div>}
        <button className="btn btn-primary btn-block" disabled={code.length < 6} onClick={verify}>Sign in</button>
        <button className="link" style={{ alignSelf: 'center' }} onClick={() => toast(`New code sent to ${email}`)}>Send the code again</button>
        <span className="tiny muted" style={{ textAlign: 'center', marginTop: 'auto' }}>Demo code: 482193</span>
      </div>
    </div>
  );
}

export function Locked() {
  const nav = useNavigate();
  return (
    <div className="auth">
      <StatusBar />
      <div className="success">
        <span className="ring warn"><IconLock size={46} /></span>
        <h2>Sign-in paused</h2>
        <span className="t2">The code was wrong 3 times, so we paused sign-in to keep your details safe. Call the office and we will unlock it straight away.</span>
        <a className="btn btn-primary btn-block" href={`tel:${OFFICE.tel}`}><IconPhone size={18} />Call {OFFICE.phone}</a>
        <button className="btn btn-grey btn-block" onClick={() => nav('/login')}>Back to sign in</button>
      </div>
    </div>
  );
}

// The email a customer gets when the office invites them.
export function Invite() {
  const nav = useNavigate();
  const a = SEED.smith;
  return (
    <div className="app">
      <StatusBar />
      <div className="hdr white"><button className="icon-btn" aria-label="Back" onClick={() => nav('/login')}><IconChevronLeft size={22} /></button><div className="ttl"><b>Inbox</b><span>From Jadeite Glazing</span></div></div>
      <div className="scroll" style={{ background: '#fff' }}>
        <div style={{ height: 150, backgroundImage: `url(${IMG.house})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="vstack" style={{ gap: 12, padding: 20 }}>
          <b style={{ fontSize: 18 }}>Welcome to Jadeite · follow your job online</b>
          <span className="tiny muted">Jadeite Glazing · to {a.email}</span>
          <p className="t2" style={{ fontSize: 14, lineHeight: 1.6 }}>Dear {a.dear},</p>
          <p className="t2" style={{ fontSize: 14, lineHeight: 1.6 }}>Everything is agreed and we are getting your order ready. You can now follow every step of your job ({a.job}) in the My Jadeite app: your dates, documents, payments and messages with the office.</p>
          <p className="t2" style={{ fontSize: 14, lineHeight: 1.6 }}>Sign in with this email address. We will send you a one-time code, so there is no password to remember.</p>
          <button className="btn btn-primary btn-block" onClick={() => nav('/code', { state: { email: a.email, id: 'smith' } })}>Open My Jadeite<IconArrowRight size={18} /></button>
          <p className="small t2" style={{ lineHeight: 1.6 }}>Any questions, call Sarah on {OFFICE.phone}.<br />Kind regards, the Jadeite Glazing team</p>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { photo: IMG.house, t: 'Everything about your job', d: 'See where your job is up to and what happens next.', pts: [[IconCalendarEvent, 'Your dates', 'Delivery and fitting days, with times'], [IconFileText, 'Your documents', 'Quote, reports, receipts and guarantee'], [IconCurrencyPound, 'Your payments', 'What is paid, what is left. Pay here.']] },
  { photo: IMG.door, t: 'Talk to us any time', d: 'Every message is kept with your job.', pts: [[IconMessage, 'Message the office', 'Sarah replies the same working day'], [IconLifebuoy, 'Report a problem', 'After fitting, tell us if anything is not right'], [IconShieldCheck, 'Your guarantee', 'Ready when your job is finished']] },
];

export function Welcome() {
  const { step = '1' } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { st } = useStore();
  const { a, onboard, setPrefs, setDetails } = useMe();
  const i = Math.min(3, Math.max(1, +step)) - 1;
  const [phone, setPhone] = useState(a.phone);
  const [email, setEmail] = useState(a.email);
  const [p, setP] = useState(a.prefs);
  if (!st.me) return <Navigate to="/login" replace />;
  const finish = () => { setPrefs(p); if (phone !== a.phone || email !== a.email) setDetails({ phone, email }); onboard(); toast('All set · welcome to My Jadeite'); nav('/'); };
  const s = SLIDES[Math.min(i, 1)];
  return (
    <div className="app">
      <StatusBar />
      <div className="hdr"><div className="ttl"><b>Step {i + 1} of 3</b></div><button className="link" onClick={() => { onboard(); nav('/'); }}>Skip</button></div>
      <div className="prog">{[0, 1, 2].map(k => <span key={k} className={k < i ? 'done' : k === i ? 'now' : ''} />)}</div>
      <div className="scroll"><div className="pad">
        {i < 2 ? (
          <>
            <div style={{ height: 190, borderRadius: 16, backgroundImage: `url(${s.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="vstack" style={{ gap: 6 }}><h1 style={{ fontSize: 20, letterSpacing: -0.4 }}>{i === 0 ? `Welcome, ${a.first}` : s.t}</h1><span className="t2" style={{ lineHeight: 1.5 }}>{i === 0 ? `Your app for job ${a.job}: ${a.products.toLowerCase()} at ${a.address}. ${s.d}` : s.d}</span></div>
            <div className="card flush"><div className="list">
              {s.pts.map(([I, t, d]: any) => <div key={t} className="li"><span className="ic"><I size={19} /></span><span className="vstack grow" style={{ gap: 1 }}><b style={{ fontSize: 14 }}>{t}</b><span className="tiny muted">{d}</span></span></div>)}
            </div></div>
          </>
        ) : (
          <>
            <div className="vstack" style={{ gap: 6 }}><h1 style={{ fontSize: 20, letterSpacing: -0.4 }}>Are your details right?</h1><span className="t2">We use these for visit reminders and updates.</span></div>
            <Field label="Mobile phone"><input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
            <Field label="Email"><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
            <div className="card flush"><div className="list">
              <div className="li"><span className="vstack grow" style={{ gap: 1 }}><b style={{ fontSize: 14 }}>Email</b><span className="tiny muted">Updates, documents and invoices</span></span><Switch on={p.email} onChange={v => setP({ ...p, email: v })} label="Email" /></div>
              <div className="li"><span className="vstack grow" style={{ gap: 1 }}><b style={{ fontSize: 14 }}>Text messages</b><span className="tiny muted">Reminders and when the team is on the way</span></span><Switch on={p.text} onChange={v => setP({ ...p, text: v })} label="Text messages" /></div>
            </div></div>
            {!p.email && !p.text && <div className="alert warn">Please keep at least one on, so we can reach you about your visits.</div>}
          </>
        )}
      </div></div>
      <div className="foot"><div className="row2">
        {i > 0 && <button className="btn btn-grey" onClick={() => nav(`/welcome/${i}`)}>Back</button>}
        {i < 2 ? <button className="btn btn-primary" onClick={() => nav(`/welcome/${i + 2}`)}>Next<IconArrowRight size={18} /></button>
          : <button className="btn btn-primary" disabled={!p.email && !p.text} onClick={finish}>Go to My Jadeite</button>}
      </div></div>
    </div>
  );
}
