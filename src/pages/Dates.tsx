// My dates: visits coming up (confirm, ask to change, add to calendar), visits done with their reports, and getting ready for fitting day.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconCalendarPlus, IconCheck, IconCalendarEvent, IconFileText, IconClock, IconUsers, IconMapPin, IconTruck, IconHome, IconInfoCircle, IconChevronRight, IconListCheck } from '@tabler/icons-react';
import { Screen, Header, Tag, Avatar, Seg, Check, useToast } from '../ui/kit';
import { ChangeDateSheet } from '../ui/sheets';
import { PREP, addToCalendar } from '../lib/customer';
import { useMe } from '../data/store';
import { IMG, TODAY, Visit, fmt, fmtLong, addDays, dayRange, daysUntil } from '../data/portal';

const title = (v: Visit) => (v.kind === 'Installation' ? 'Fitting day' + (v.days && v.days > 1 ? 's' : '') : v.kind);

export default function Dates() {
  const { a, confirmFit, cancelChange } = useMe();
  const toast = useToast();
  const nav = useNavigate();
  const coming = a.visits.filter(v => v.status === 'Booked' && v.date >= TODAY);
  const done = a.visits.filter(v => !coming.includes(v)).reverse();
  const [f, setF] = useState<'next' | 'done'>(coming.length ? 'next' : 'done');
  const [change, setChange] = useState<Visit | null>(null);
  const prepDone = PREP.filter(p => a.prep[p.id]).length;
  return (
    <Screen tabs header={<>
      <div className="hdr-lg"><h1>My dates</h1></div>
      <div style={{ padding: '0 16px 10px' }}><Seg value={f} onChange={setF} items={[{ id: 'next', label: `Coming up · ${coming.length}` }, { id: 'done', label: `Done · ${done.length}` }]} /></div>
    </>}>
      <div className="pad" style={{ paddingTop: 4 }}>
        {f === 'next' && coming.length === 0 && <div className="alert ok"><IconCheck size={17} />No visits booked. {a.phase === 'done' ? 'Your job is finished.' : 'We will tell you when we book the next one.'}</div>}
        {f === 'next' && coming.map(v => {
          const fit = v.kind === 'Installation';
          const n = daysUntil(v.date);
          return (
            <div key={v.id} className="next">
              <div className="pic" style={{ backgroundImage: `url(${IMG[fit ? a.photo : 'window']})`, height: 130 }}>
                <div className="between" style={{ padding: 12 }}><Tag tone="glass">{n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`}</Tag>{fit && (a.confirmed ? <Tag tone="ok" icon={<IconCheck size={13} />}>You confirmed</Tag> : a.change ? <Tag tone="warn">Change asked</Tag> : <Tag tone="jade">Please confirm</Tag>)}</div>
                <div style={{ position: 'absolute', left: 16, bottom: 12, right: 16, color: '#fff' }} className="vstack"><span style={{ fontSize: 12, color: '#cfe0db', fontWeight: 600 }}>{title(v).toUpperCase()}</span><b style={{ fontSize: 18 }}>{dayRange(v)}</b></div>
              </div>
              <div className="body">
                <div className="facts">
                  <span><IconClock size={16} />{v.time}{fit ? ' · finish about 5pm' : ''}</span>
                  <span>{v.home ? <IconUsers size={16} /> : <IconTruck size={16} />}{v.home ? v.who.join(', ') : `From ${v.who[0]}`}</span>
                  <span>{v.home ? <IconMapPin size={16} /> : <IconHome size={16} />}{v.home ? a.address : 'Delivered to our depot · you do not need to be home'}</span>
                </div>
                <span className="small t2" style={{ lineHeight: 1.5 }}>{v.what}</span>
                {fit && <div className="hstack" style={{ gap: 6 }}>{v.who.map(w => <Avatar key={w} i={w.split(' ').map(x => x[0]).join('')} size={32} />)}<span className="tiny muted" style={{ marginLeft: 4 }}>{v.who[0].split(' ')[0]} will text you when the team is on the way</span></div>}
                {fit && a.change && (
                  <div className="alert warn"><IconInfoCircle size={17} /><span className="grow">You asked to change this date ({a.change.reason.toLowerCase()}). Sarah will call you within 1 working day. Until then, this date stays booked.</span></div>
                )}
                {fit && !a.confirmed && !a.change && <button className="btn btn-primary btn-block" onClick={() => { confirmFit(); toast('Thank you · fitting dates confirmed'); }}><IconCheck size={18} />Yes, we will be home</button>}
                <div className="hstack" style={{ gap: 8 }}>
                  {fit && !a.change && <button className="btn btn-outline grow" onClick={() => setChange(v)}><IconCalendarEvent size={17} />Change date</button>}
                  {fit && a.change && <button className="btn btn-outline grow" onClick={() => { cancelChange(); toast('Request cancelled · your date stays the same'); }}>Cancel my request</button>}
                  <button className="btn btn-outline grow" onClick={() => { addToCalendar(v, a); toast('Added to your calendar'); }}><IconCalendarPlus size={17} />Add to calendar</button>
                </div>
                {fit && (
                  <Link to="/dates/prepare" className="file">
                    <span className="tile" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--tint)', color: 'var(--primary-dark)' }}><IconListCheck size={20} /></span>
                    <span className="vstack grow" style={{ gap: 1 }}><b style={{ fontSize: 14 }}>Get ready for fitting day</b><span className="tiny muted">{prepDone} of {PREP.length} done</span></span>
                    <IconChevronRight size={18} color="#a5b2af" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {f === 'done' && (
          <div className="card flush"><div className="list">
            {done.map(v => (
              <button key={v.id} className="li" style={{ alignItems: 'flex-start' }} disabled={!v.doc} onClick={() => v.doc && nav(`/documents/${v.doc}`)}>
                <span className="tile" style={{ width: 44, height: 48, borderRadius: 12, background: 'var(--bg)', flexDirection: 'column', gap: 0, lineHeight: 1.1 }}><b style={{ fontSize: 16 }}>{fmt(v.date, { day: 'numeric' })}</b><span className="tiny muted">{fmt(v.date, { month: 'short' })}</span></span>
                <span className="vstack grow" style={{ gap: 2, minWidth: 0 }}><b style={{ fontSize: 14 }}>{title(v)}</b><span className="tiny muted">{dayRange(v)} · {v.who.join(', ')}</span><span className="tiny muted">{v.what}</span>{v.doc && <span className="small b" style={{ color: 'var(--primary-dark)' }}><IconFileText size={14} style={{ verticalAlign: -2 }} /> See the report</span>}</span>
                <Tag tone="ok">Done</Tag>
              </button>
            ))}
          </div></div>
        )}
      </div>
      {change && <ChangeDateSheet v={change} onClose={() => setChange(null)} />}
    </Screen>
  );
}

export function Prepare() {
  const { a, setPrep } = useMe();
  const fit = a.visits.find(v => v.kind === 'Installation')!;
  const n = PREP.filter(p => a.prep[p.id]).length;
  return (
    <Screen header={<Header back="/dates" title="Getting ready" sub={`${fmtLong(fit.date)}${fit.days && fit.days > 1 ? ` – ${fmt(addDays(fit.date, fit.days - 1))}` : ''}`} />}>
      <div className="pad">
        {fit.status === 'Done' && <div className="alert ok"><IconCheck size={17} />Your fitting is done. This list is here to look back at.</div>}
        <div className="card">
          <div className="between"><b style={{ fontSize: 15 }}>Before the fitters arrive</b><Tag tone={n === PREP.length ? 'ok' : 'jade'}>{n} of {PREP.length}</Tag></div>
          <div style={{ height: 8, borderRadius: 4, background: '#e6ecea', overflow: 'hidden' }}><div style={{ width: `${(n / PREP.length) * 100}%`, height: '100%', background: 'var(--primary)' }} /></div>
          {PREP.map(p => <Check key={p.id} on={!!a.prep[p.id]} onChange={v => setPrep(p.id, v)} label={<span className="vstack" style={{ gap: 2 }}><b style={{ fontSize: 14, textDecoration: a.prep[p.id] ? 'line-through' : 'none', color: a.prep[p.id] ? 'var(--muted)' : undefined }}>{p.t}</b><span className="tiny muted">{p.d}</span></span>} />)}
          {n === PREP.length && <div className="alert ok"><IconCheck size={17} />All ready. Thank you, that helps the day go smoothly.</div>}
        </div>
        <div className="sec"><h3>What happens on the day</h3></div>
        <div className="card">
          <div className="route">
            {[['08:00 – 09:00', `${fit.who[0].split(' ')[0]} and the team arrive and say hello`], ['Morning', 'Dust sheets down, old frames carefully taken out'], ['All day', 'New frames fitted one at a time, so your home is never left open'], ['End of day 1', 'Everything closed and locked before they leave'], ['Last day', 'Final checks, they show you how it all works, and you sign the handover'], ['After', 'Old frames and rubbish taken away']].map(([t, d], i, arr) => (
              <div key={t} className="stop"><div className="rail"><span className="pin">{i + 1}</span>{i < arr.length - 1 && <span className="line" />}</div><span className="vstack grow" style={{ gap: 2, paddingBottom: 12, paddingTop: 4 }}><b style={{ fontSize: 13 }}>{t}</b><span className="tiny muted">{d}</span></span></div>
            ))}
          </div>
        </div>
        <Link to="/messages" className="alert info"><IconInfoCircle size={17} /><span className="grow">Not sure about something? Ask Sarah before the day.</span><IconChevronRight size={16} /></Link>
      </div>
    </Screen>
  );
}
