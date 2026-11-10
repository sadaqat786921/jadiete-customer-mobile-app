// Home: where the job is up to, things to do, what is next, my job, latest updates and the team.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconBell, IconChevronRight, IconClock, IconMapPin, IconUsers, IconCalendarEvent, IconPackage, IconFileText, IconLifebuoy, IconCurrencyPound, IconCircleCheck, IconPhone, IconMessage, IconCheck, IconShieldCheck } from '@tabler/icons-react';
import { Screen, Tag, Avatar } from '../ui/kit';
import { PaySheet, ReviewSheet, Stars } from '../ui/sheets';
import { journey, headline, useTodos, Todo, UpdIcon, updLink } from '../lib/customer';
import { useMe } from '../data/store';
import { IMG, OFFICE, TODAY, fmt, fmtLong, addDays, daysUntil, gbp } from '../data/portal';

export function TodoList({ todos }: { todos: Todo[] }) {
  const { a } = useMe();
  const nav = useNavigate();
  const [sheet, setSheet] = useState<string | null>(null);
  const inv = sheet?.startsWith('pay:') ? a.invoices.find(i => i.ref === sheet.slice(4)) : undefined;
  return (
    <>
      <div className="card flush"><div className="list">
        {todos.map(t => (
          <button key={t.id} className="li" style={{ alignItems: 'flex-start' }} onClick={() => (t.act ? setSheet(t.act) : nav(t.to!))}>
            <span className="ic" style={t.tone === 'warn' ? { background: '#fdf3d9', color: '#9a6f00' } : undefined}>{t.icon}</span>
            <span className="vstack grow" style={{ gap: 2, minWidth: 0 }}><b style={{ fontSize: 14 }}>{t.title}</b><span className="tiny muted">{t.sub}</span>{t.label && <span className="small b" style={{ color: 'var(--primary-dark)', marginTop: 4 }}>{t.label}</span>}</span>
            <IconChevronRight size={18} className="chev" style={{ marginTop: 9 }} />
          </button>
        ))}
      </div></div>
      {inv && <PaySheet inv={inv} onClose={() => setSheet(null)} />}
      {sheet === 'review' && <ReviewSheet onClose={() => setSheet(null)} />}
    </>
  );
}

export default function Home() {
  const { a, unread } = useMe();
  const nav = useNavigate();
  const todos = useTodos(a);
  const h = headline(a);
  const steps = journey(a);
  const at = steps.findIndex(s => s.state !== 'done');
  const coming = a.visits.filter(v => v.status === 'Booked' && v.date >= TODAY);
  const next = coming.find(v => v.home) || coming[0];
  const paid = a.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const g = a.docs.find(d => d.id === 'd-guarantee');
  const ready = a.docs.filter(d => !d.locked).length;
  const hr = new Date().getHours();
  return (
    <Screen dark tabs>
      <div className="hero" style={{ paddingBottom: 66 }}>
        <div className="photo" style={{ backgroundImage: `url(${IMG[a.photo]})` }} />
        <span className="glow" />
        <div className="between" style={{ paddingTop: 6 }}>
          <Link to="/more" className="hstack" style={{ gap: 10 }}><Avatar i={a.initials} size={42} bg="#00c7a1" fg="#0b1f1b" /><span className="vstack" style={{ gap: 0 }}><span style={{ fontSize: 12, color: '#cfe0db' }}>Job {a.job}</span><b style={{ fontSize: 14 }}>{a.name}</b></span></Link>
          <button className="icon-btn glass" aria-label="Notifications" onClick={() => nav('/notifications')}><IconBell size={20} />{!a.notifsRead && <span className="badge">{Math.min(a.updates.length, 2)}</span>}</button>
        </div>
        <span style={{ fontSize: 13, color: '#bfe9dc', fontWeight: 600, display: 'block', marginTop: 20 }}>{hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'}, {a.first}</span>
        <h1 style={{ fontSize: 20, letterSpacing: -0.4, marginTop: 4, lineHeight: 1.25 }}>{h.title}</h1>
        <span style={{ color: '#cfe0db', fontSize: 14, display: 'block', marginTop: 6 }}>{h.sub}</span>
        <div className="hstack" style={{ gap: 8, marginTop: 18 }}>
          {next ? <button className="stat" onClick={() => nav('/dates')}><b>{daysUntil(next.date)}</b><span>Days to {next.kind === 'Installation' ? 'fitting' : next.kind.toLowerCase()}</span></button>
            : <button className="stat" onClick={() => nav('/help')}><b>{a.issues.filter(i => i.status !== 'Fixed').length}</b><span>Open requests</span></button>}
          <button className="stat" onClick={() => nav('/payments')}><b>{gbp(a.total - paid)}</b><span>{paid >= a.total ? 'Paid in full' : 'Left to pay'}</span></button>
          <button className="stat" onClick={() => nav('/documents')}><b>{ready}</b><span>Documents</span></button>
        </div>
      </div>

      <div className="pad" style={{ marginTop: -50, position: 'relative' }}>
        <div className="card">
          <div className="between"><b style={{ fontSize: 15 }}>Where your job is up to</b><Tag tone={a.phase === 'done' ? 'ok' : 'jade'}>{at < 0 ? 'All done' : steps[at].label}</Tag></div>
          <div className="route">
            {steps.map((s, i) => (
              <div key={s.label} className="stop">
                <div className="rail"><span className={`pin ${s.state === 'done' ? 'done' : s.state === 'now' ? 'now' : ''}`}>{s.state === 'done' ? <IconCheck size={14} stroke={3} /> : i + 1}</span>{i < steps.length - 1 && <span className="line" style={s.state === 'done' ? { background: 'var(--primary)' } : undefined} />}</div>
                <div className="between grow" style={{ paddingBottom: 10, paddingTop: 4, alignItems: 'flex-start' }}>
                  <b style={{ fontSize: 14, color: s.state === 'next' ? 'var(--muted)' : 'var(--text)', fontWeight: s.state === 'now' ? 700 : 600 }}>{s.label}</b>
                  <span className="tiny muted">{s.state === 'now' ? <Tag tone="jade">Now</Tag> : s.when || ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sec"><h3>Things to do</h3>{todos.length > 0 && <span className="tiny muted">{todos.length} to do</span>}</div>
        {todos.length ? <TodoList todos={todos} /> : (
          <div className="card tight" style={{ flexDirection: 'row', alignItems: 'center' }}><span className="tile" style={{ width: 40, height: 40, borderRadius: 12, background: '#e3f6ec', color: 'var(--ok)' }}><IconCircleCheck size={22} /></span><span className="vstack" style={{ gap: 1 }}><b style={{ fontSize: 14 }}>Nothing to do right now</b><span className="tiny muted">{a.phase === 'done' ? 'If anything is not right, use Help and aftercare.' : 'We will tell you when we need anything.'}</span></span></div>
        )}

        {next && (
          <>
            <div className="sec"><h3>Coming up</h3><Link to="/dates">My dates<IconChevronRight size={15} /></Link></div>
            <div className="next">
              <div className="pic" style={{ backgroundImage: `url(${IMG[next.kind === 'Installation' ? a.photo : 'window']})` }}>
                <div className="between" style={{ padding: 12 }}><Tag tone="glass">{daysUntil(next.date) === 0 ? 'Today' : `In ${daysUntil(next.date)} days`}</Tag>{next.kind === 'Installation' && (a.confirmed ? <Tag tone="ok">Confirmed</Tag> : a.change ? <Tag tone="warn">Change asked</Tag> : <Tag tone="jade">Please confirm</Tag>)}</div>
                <div style={{ position: 'absolute', left: 16, bottom: 12, right: 16, color: '#fff' }}><b style={{ fontSize: 18 }}>{next.kind === 'Installation' ? 'Fitting day' + (next.days && next.days > 1 ? 's' : '') : next.kind}</b></div>
              </div>
              <div className="body">
                <div className="facts">
                  <span><IconCalendarEvent size={16} />{next.days && next.days > 1 ? `${fmt(next.date)} – ${fmt(addDays(next.date, next.days - 1))}` : fmtLong(next.date)}</span>
                  <span><IconClock size={16} />{next.time}</span>
                  <span><IconUsers size={16} />{next.home ? next.who.join(', ') : `From ${next.who[0]} · you do not need to be home`}</span>
                  <span><IconMapPin size={16} />{next.home ? a.address : 'Delivered to our depot'}</span>
                </div>
                <button className="btn btn-primary btn-block" onClick={() => nav('/dates')}>See details</button>
              </div>
            </div>
          </>
        )}

        <div className="sec"><h3>My job</h3></div>
        <div className="grid-2">
          {([['/order', IconPackage, 'My order', a.products], ['/documents', IconFileText, 'Documents', `${ready} ready`], ['/payments', IconCurrencyPound, 'Payments', paid >= a.total ? 'Paid in full' : `${gbp(paid)} of ${gbp(a.total)} paid`], ['/help', IconLifebuoy, 'Help and aftercare', a.phase === 'before' ? 'After fitting' : 'Report a problem']] as [string, any, string, string][]).map(([to, I, t, s]) => (
            <Link key={to} to={to} className="card tight" style={{ alignItems: 'flex-start' }}><span className="tile" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--tint)', color: 'var(--primary-dark)' }}><I size={20} /></span><b style={{ fontSize: 14 }}>{t}</b><span className="tiny muted ell" style={{ maxWidth: '100%' }}>{s}</span></Link>
          ))}
        </div>

        {a.phase === 'done' && g && (
          <Link to="/help" className="card tight" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <span className="tile" style={{ width: 40, height: 40, borderRadius: 12, background: '#e3f6ec', color: 'var(--ok)' }}><IconShieldCheck size={22} /></span>
            <span className="vstack grow" style={{ gap: 2 }}><b style={{ fontSize: 14 }}>10-year guarantee</b><span className="tiny muted">{g.about}</span>{a.review && <Stars n={a.review.stars} />}</span>
            <IconChevronRight size={18} color="#a5b2af" />
          </Link>
        )}

        <div className="sec"><h3>Latest updates</h3><Link to="/notifications">All<IconChevronRight size={15} /></Link></div>
        <div className="card flush"><div className="list">
          {a.updates.slice(0, 4).map((u, i) => (
            <Link key={i} to={updLink[u.icon]} className="li"><UpdIcon i={u.icon} /><span className="vstack grow" style={{ gap: 1 }}><b style={{ fontSize: 13 }}>{u.text}</b><span className="tiny muted">{u.when}</span></span></Link>
          ))}
        </div></div>

        <div className="sec"><h3>Your Jadeite team</h3></div>
        <div className="card flush"><div className="list">
          {a.team.map(p => (
            <div key={p.name} className="li">
              <Avatar i={p.initials} size={40} bg={p.role.startsWith('Office') ? '#00c7a1' : undefined} fg={p.role.startsWith('Office') ? '#0b1f1b' : undefined} />
              <span className="vstack grow" style={{ gap: 1, minWidth: 0 }}><b style={{ fontSize: 14 }}>{p.name}</b><span className="tiny muted">{p.role}</span></span>
              {p.role.startsWith('Office') && <span className="hstack"><Link to="/messages" className="icon-btn" aria-label="Message Sarah" style={{ position: 'relative' }}><IconMessage size={19} />{unread > 0 && <span className="dot" />}</Link><a href={`tel:${OFFICE.tel}`} className="icon-btn" aria-label="Call the office"><IconPhone size={19} /></a></span>}
            </div>
          ))}
        </div></div>
      </div>
    </Screen>
  );
}
