// More: my job pages, my details, how we contact you, sign-in, notifications, help, reset, sign out.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconPackage, IconFileText, IconLifebuoy, IconUser, IconBell, IconShieldLock, IconSparkles, IconRefresh, IconLogout, IconChevronRight, IconPhone, IconMail, IconInfoCircle, IconDeviceMobile, IconDeviceLaptop, IconMessage } from '@tabler/icons-react';
import { Screen, Header, Avatar, Tag, Field, Switch, Empty, useToast } from '../ui/kit';
import { SignOutSheet } from '../ui/sheets';
import { UpdIcon, updLink } from '../lib/customer';
import { useMe, Prefs } from '../data/store';
import { IMG, OFFICE } from '../data/portal';

export default function More() {
  const { a, reset } = useMe();
  const nav = useNavigate();
  const toast = useToast();
  const [out, setOut] = useState(false);
  const open = a.issues.filter(i => i.kind === 'Aftercare' && i.status !== 'Fixed').length;
  const row = (to: string, I: any, l: string, s?: string, right?: React.ReactNode) => <Link to={to} className="li"><span className="ic"><I size={19} /></span><span className="vstack grow" style={{ gap: 0, minWidth: 0 }}>{l}{s && <span className="tiny muted ell">{s}</span>}</span>{right}<IconChevronRight size={18} className="chev" /></Link>;
  return (
    <Screen tabs header={<div className="hdr-lg"><h1>More</h1></div>}>
      <div className="pad" style={{ paddingTop: 4 }}>
        <div className="card" style={{ alignItems: 'center', textAlign: 'center', background: 'linear-gradient(180deg, #ebf7f3, #fff 70%)' }}>
          <Avatar i={a.initials} size={72} bg="#00c7a1" fg="#0b1f1b" />
          <div className="vstack" style={{ gap: 2 }}><b style={{ fontSize: 18 }}>{a.name}</b><span className="small muted">{a.email}</span></div>
          <div className="file" style={{ textAlign: 'left' }}><img src={IMG[a.photo]} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} /><span className="vstack grow" style={{ gap: 1, minWidth: 0 }}><b style={{ fontSize: 14 }}>Job {a.job}</b><span className="tiny muted ell">{a.products} · {a.address}</span></span></div>
        </div>
        <div className="card flush"><div className="list">
          {row('/order', IconPackage, 'My order', a.products)}
          {row('/documents', IconFileText, 'Documents', `${a.docs.filter(d => !d.locked).length} ready`)}
          {row('/help', IconLifebuoy, 'Help and aftercare', 'Report a problem, guarantee, care', open ? <Tag tone="warn">{open}</Tag> : undefined)}
        </div></div>
        <div className="card flush"><div className="list">
          {row('/more/details', IconUser, 'My details', a.phone)}
          {row('/more/contact', IconBell, 'How we contact you', [a.prefs.email && 'Email', a.prefs.text && 'Text messages'].filter(Boolean).join(' and '))}
          {row('/more/security', IconShieldLock, 'Signing in', 'One-time code by email')}
        </div></div>
        <div className="card flush"><div className="list">
          <a className="li" href={`tel:${OFFICE.tel}`} onClick={() => toast('Calling the office')}><span className="ic"><IconPhone size={19} /></span><span className="vstack grow" style={{ gap: 0 }}>Call the office<span className="tiny muted">{OFFICE.phone}</span></span></a>
          <button className="li" onClick={() => nav('/welcome/1')}><span className="ic"><IconSparkles size={19} /></span><span className="grow">How the app works</span><IconChevronRight size={18} className="chev" /></button>
          <button className="li" onClick={() => { reset(); toast('Demo data reset'); nav('/'); }}><span className="ic"><IconRefresh size={19} /></span><span className="vstack grow" style={{ gap: 0 }}>Reset demo data<span className="tiny muted">Start the demo again</span></span></button>
          <button className="li danger" onClick={() => setOut(true)}><span className="ic"><IconLogout size={19} /></span><span className="grow">Sign out</span></button>
        </div></div>
        <span className="tiny muted" style={{ textAlign: 'center' }}>My Jadeite · version 1.0 · © 2026 Jadeite Glazing</span>
      </div>
      {out && <SignOutSheet onClose={() => setOut(false)} />}
    </Screen>
  );
}

export function Details() {
  const { a, setDetails } = useMe();
  const toast = useToast();
  const nav = useNavigate();
  const [phone, setPhone] = useState(a.phone);
  const [email, setEmail] = useState(a.email);
  const changed = phone.trim() !== a.phone || email.trim() !== a.email;
  const valid = /.+@.+\..+/.test(email.trim()) && phone.replace(/\D/g, '').length >= 10;
  return (
    <Screen header={<Header back="/more" title="My details" />} foot={<button className="btn btn-primary btn-block" disabled={!changed || !valid} onClick={() => { setDetails({ phone: phone.trim(), email: email.trim() }); toast('Your details are saved'); nav('/more'); }}>Save changes</button>}>
      <div className="pad">
        <Field label="Name"><input className="input" value={a.name} disabled /></Field>
        <Field label="Mobile phone"><input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
        <Field label="Email" hint="You sign in with this email"><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Address of the job"><input className="input" value={`${a.address}, ${a.postcode}`} disabled /></Field>
        <Link to="/messages" className="alert info"><IconInfoCircle size={17} /><span className="grow">To change your name or address, message Sarah.</span><IconChevronRight size={16} /></Link>
      </div>
    </Screen>
  );
}

export function Contact() {
  const { a, setPrefs } = useMe();
  const toast = useToast();
  const p = a.prefs;
  const set = (k: keyof Prefs, v: boolean) => {
    if ((k === 'email' && !v && !p.text) || (k === 'text' && !v && !p.email)) { toast('Keep at least one way to reach you'); return; }
    setPrefs({ [k]: v }); toast('Saved');
  };
  const row = (k: keyof Prefs, t: string, d: string) => <div className="li"><span className="vstack grow" style={{ gap: 1 }}><b style={{ fontSize: 14 }}>{t}</b><span className="tiny muted">{d}</span></span><Switch on={p[k]} onChange={v => set(k, v)} label={t} /></div>;
  return (
    <Screen header={<Header back="/more" title="How we contact you" />}>
      <div className="pad">
        <div className="sec"><h3>Ways to reach you</h3></div>
        <div className="card flush"><div className="list">{row('email', 'Email', a.email)}{row('text', 'Text messages', a.phone)}</div></div>
        <div className="sec"><h3>Tell me about</h3></div>
        <div className="card flush"><div className="list">
          {row('visits', 'Visits and fitting days', 'Reminders the day before, and when the team is on the way')}
          {row('payments', 'Payments', 'When an invoice is ready and when a payment arrives')}
          {row('updates', 'Job updates and messages', 'When your order moves on, or Sarah sends a message')}
        </div></div>
        <span className="tiny muted">We always contact you about payments and visits in at least one way.</span>
      </div>
    </Screen>
  );
}

export function Security() {
  const toast = useToast();
  const [others, setOthers] = useState(true);
  return (
    <Screen header={<Header back="/more" title="Signing in" />}>
      <div className="pad">
        <div className="alert info"><IconMail size={17} />We email you a 6-digit code each time you sign in. There is no password to remember.</div>
        <div className="sec"><h3>Where you are signed in</h3></div>
        <div className="card flush"><div className="list">
          <div className="li"><span className="ic"><IconDeviceMobile size={19} /></span><span className="vstack grow" style={{ gap: 0 }}><b style={{ fontSize: 14 }}>This phone</b><span className="tiny muted">Leicester · now</span></span><Tag tone="ok">This one</Tag></div>
          {others && <div className="li"><span className="ic"><IconDeviceLaptop size={19} /></span><span className="vstack grow" style={{ gap: 0 }}><b style={{ fontSize: 14 }}>Computer</b><span className="tiny muted">Leicester · 13 Oct</span></span></div>}
        </div></div>
        {others && <button className="btn btn-outline btn-block" onClick={() => { setOthers(false); toast('Signed out on your other devices'); }}>Sign out on other devices</button>}
        <Link to="/messages" className="alert info"><IconMessage size={17} /><span className="grow">We only use your details for your job and your guarantee. You only ever see your own job.</span></Link>
      </div>
    </Screen>
  );
}

export function Notifications() {
  const { a, readNotifs } = useMe();
  const nav = useNavigate();
  return (
    <Screen header={<Header back="/" title="Updates on your job" right={!a.notifsRead ? <button className="link" onClick={readNotifs}>Mark all read</button> : undefined} />}>
      <div className="pad">
        {a.updates.length === 0 && <Empty icon={<IconBell size={24} />} title="No updates yet" />}
        <div className="card flush"><div className="list">
          {a.updates.map((u, i) => (
            <button key={i} className="li" onClick={() => { readNotifs(); nav(updLink[u.icon]); }}>
              <UpdIcon i={u.icon} />
              <span className="vstack grow" style={{ gap: 1 }}><b style={{ fontSize: 13 }}>{u.text}</b><span className="tiny muted">{u.when}</span></span>
              {!a.notifsRead && i < 2 && <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary)' }} />}
            </button>
          ))}
        </div></div>
      </div>
    </Screen>
  );
}
