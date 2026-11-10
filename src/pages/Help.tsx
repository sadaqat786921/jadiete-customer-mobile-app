// Help and aftercare: report a problem, my requests (track, add to, cancel), my guarantee, care tips, common questions, contact us.
// Also: Check the repairs (confirm and sign, or say what is not fixed).
import React, { useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { IconLifebuoy, IconTool, IconShieldCheck, IconLock, IconChevronDown, IconChevronRight, IconPhone, IconMail, IconMessage, IconCheck, IconSparkles, IconDroplet, IconKey, IconWind, IconInfoCircle, IconCircleCheck, IconX, IconCurrencyPound } from '@tabler/icons-react';
import { Screen, Header, Tag, Empty, Field, Seg, Steps, PhotoGrid, Check, SignaturePad, useToast, img } from '../ui/kit';
import { issueTone } from '../lib/customer';
import { useMe } from '../data/store';
import { OFFICE } from '../data/portal';

const CARE: [any, string, string][] = [
  [IconSparkles, 'Clean the frames', 'Warm soapy water and a soft cloth every few months. No bleach or scourers.'],
  [IconDroplet, 'Keep the drainage holes clear', 'Small slots at the bottom of the frame let rain out.'],
  [IconKey, 'Oil locks and hinges once a year', 'A drop of light oil keeps them turning easily.'],
  [IconWind, 'Air your home', 'Use the trickle vents to let damp out and stop condensation.'],
];
const FAQ: [string, string][] = [
  ['What does my guarantee cover?', 'Your 10-year guarantee covers the frames, the glass (including misting between the panes) and our fitting work. It moves to the new owner if you sell your home.'],
  ['Is condensation a fault?', 'Condensation on the inside or outside of the glass is normal. Misting between the two panes of glass is a fault: please report it.'],
  ['I cannot lock a window or door', `Call the office straight away on ${OFFICE.phone}. Out of hours, leave a message and we will call you first thing.`],
  ['Can I change my fitting date?', 'Yes. Go to My dates and tap "Change date". Sarah will call you to agree a new one.'],
  ['How do I get my FENSA certificate?', 'It is in Documents when your job is finished. FENSA also posts a copy within 30 days.'],
];
const PICS = ['bifold', 'window', 'door', 'roof'];

export default function Help() {
  const { a } = useMe();
  const nav = useNavigate();
  const [open, setOpen] = useState<number | null>(null);
  const fitted = a.phase !== 'before';
  const g = a.docs.find(x => x.id === 'd-guarantee')!;
  const care = a.docs.find(x => x.id === 'd-care')!;
  return (
    <Screen header={<Header back="/" title="Help and aftercare" />}>
      <div className="pad">
        <div className="card" style={{ background: 'var(--deep)', color: '#fff', border: 0 }}>
          <div className="hstack" style={{ gap: 12 }}><span className="tile" style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,199,161,.18)', color: 'var(--primary)' }}><IconLifebuoy size={22} /></span><span className="vstack" style={{ gap: 2 }}><b style={{ fontSize: 16 }}>{fitted ? 'Something not right?' : 'Problems after fitting'}</b><span style={{ fontSize: 13, color: '#cfe0db' }}>{fitted ? 'Tell us, add a photo, and we will put it right.' : 'Once your windows are in you can report a problem here.'}</span></span></div>
          {fitted ? <button className="btn btn-primary btn-block" onClick={() => nav('/help/report')}><IconTool size={18} />Report a problem</button> : <Link to="/messages" className="btn btn-primary btn-block"><IconMessage size={18} />Message Sarah</Link>}
        </div>

        <div className="sec"><h3>My requests</h3>{a.issues.length > 0 && <span className="tiny muted">{a.issues.filter(i => i.status !== 'Fixed').length} open</span>}</div>
        {a.issues.length ? (
          <div className="card flush"><div className="list">
            {a.issues.map(i => (
              <Link key={i.id} to={`/help/${i.id}`} className="li" style={{ alignItems: 'flex-start' }}>
                <span className="ic" style={i.status === 'Fixed' ? { background: '#e3f6ec', color: 'var(--ok)' } : { background: '#fdf3d9', color: '#9a6f00' }}>{i.status === 'Fixed' ? <IconCheck size={18} /> : <IconTool size={18} />}</span>
                <span className="vstack grow" style={{ gap: 2, minWidth: 0 }}><b style={{ fontSize: 14 }}>{i.title}</b><span className="tiny muted ell">{i.item}</span><span className="hstack" style={{ gap: 6 }}><Tag tone={issueTone(i.status)}>{i.status}</Tag><span className="tiny muted">{i.id}</span></span></span>
                <IconChevronRight size={18} className="chev" style={{ marginTop: 9 }} />
              </Link>
            ))}
          </div></div>
        ) : <div className="card"><Empty icon={<IconTool size={24} />} title="No requests" sub={fitted ? 'Nothing to put right.' : 'Nothing here yet.'} /></div>}

        <div className="sec"><h3>My guarantee</h3>{g.locked ? <Tag tone="grey" icon={<IconLock size={12} />}>Not yet</Tag> : <Tag tone="ok" icon={<IconShieldCheck size={13} />}>Active</Tag>}</div>
        {g.locked ? <div className="alert info"><IconShieldCheck size={17} />Your 10-year guarantee is added {g.locked.charAt(0).toLowerCase() + g.locked.slice(1)}. It covers frames, glass and fitting.</div> : (
          <>
            <div className="kv">{(g.lines || []).map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>
            <button className="btn btn-outline btn-block" onClick={() => nav('/documents/d-guarantee')}><IconShieldCheck size={18} />View my guarantee</button>
          </>
        )}

        <div className="sec"><h3>Looking after your {a.id === 'khan' ? 'roof' : 'windows'}</h3>{!care.locked && <button className="link" onClick={() => nav('/documents/d-care')}>Care guide</button>}</div>
        <div className="card flush"><div className="list">
          {CARE.map(([I, t, d]) => <div key={t} className="li" style={{ alignItems: 'flex-start' }}><span className="ic"><I size={18} /></span><span className="vstack grow" style={{ gap: 2 }}><b style={{ fontSize: 14 }}>{t}</b><span className="tiny muted">{d}</span></span></div>)}
        </div></div>

        <div className="sec"><h3>Common questions</h3></div>
        <div className="card flush"><div className="list">
          {FAQ.map(([q, ans], k) => (
            <div key={q}>
              <button className="li" aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)}><b className="grow" style={{ fontSize: 14 }}>{q}</b><IconChevronDown size={18} color="#6b7a78" style={{ transform: open === k ? 'rotate(180deg)' : 'none' }} /></button>
              {open === k && <p className="small t2" style={{ padding: '0 16px 14px', lineHeight: 1.55 }}>{ans}</p>}
            </div>
          ))}
        </div></div>

        <div className="sec"><h3>Contact us</h3><span className="tiny muted">Mon – Fri 8am – 5:30pm</span></div>
        <div className="qa" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 8 }}>
          <a href={`tel:${OFFICE.tel}`}><span className="ic"><IconPhone size={18} /></span>Call</a>
          <a href={`mailto:${OFFICE.email}`}><span className="ic"><IconMail size={18} /></span>Email</a>
          <Link to="/messages"><span className="ic"><IconMessage size={18} /></span>Message</Link>
        </div>
      </div>
    </Screen>
  );
}

const KINDS = ['Draught or leak', 'Hard to open or close', 'Lock or handle', 'Glass misted or cracked', 'Damage or scratch', 'Something else'];
export function Report() {
  const { a, report } = useMe();
  const nav = useNavigate();
  const toast = useToast();
  const [item, setItem] = useState(`${a.items[0].type} · ${a.items[0].room}`);
  const [kind, setKind] = useState('');
  const [detail, setDetail] = useState('');
  const [photos, setPhotos] = useState(0);
  const [urgent, setUrgent] = useState<'no' | 'yes'>('no');
  const [home, setHome] = useState<string[]>([]);
  if (a.phase === 'before') return <Navigate to="/help" replace />;
  const send = () => {
    const id = report({ title: kind === 'Something else' ? detail.trim().split('.')[0].slice(0, 48) || 'Something else' : kind, detail: detail.trim() + (home.length ? ` Usually home: ${home.join(', ')}.` : ''), item, photos, urgent: urgent === 'yes' });
    toast(`Sent · request ${id}`); nav(`/help/${id}`, { replace: true });
  };
  return (
    <Screen header={<Header back="/help" title="Report a problem" sub="We will put it right" />} foot={<button className="btn btn-primary btn-block" disabled={!kind || detail.trim().length < 5} onClick={send}>Send to the office</button>}>
      <div className="pad">
        <Field label="Which window or door?"><select className="select" value={item} onChange={e => setItem(e.target.value)}>{a.items.map(i => <option key={i.ref}>{i.type} · {i.room}</option>)}<option>Something else</option></select></Field>
        <Field label="What is the problem?"><div className="chips wrap">{KINDS.map(k => <button key={k} className={`chip ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)}>{k}</button>)}</div></Field>
        <Field label="Tell us a little more"><textarea className="textarea" rows={3} value={detail} onChange={e => setDetail(e.target.value)} placeholder="For example: water comes in at the bottom corner when it rains hard" /></Field>
        <Field label="Photos help us bring the right part" hint="Optional"><PhotoGrid n={photos} onAdd={() => setPhotos(p => p + 1)} onRemove={() => setPhotos(p => Math.max(0, p - 1))} /></Field>
        <Field label="How urgent is it?"><Seg value={urgent} onChange={setUrgent} items={[{ id: 'no', label: 'It can wait' }, { id: 'yes', label: 'Urgent' }]} /></Field>
        {urgent === 'yes' && <div className="alert warn"><IconInfoCircle size={17} /><span>If it cannot lock or water is coming in, please also call us on <a href={`tel:${OFFICE.tel}`} style={{ fontWeight: 700 }}>{OFFICE.phone}</a>.</span></div>}
        <Field label="When are you usually home?" hint="So we can book a visit that suits you"><div className="chips wrap">{['Weekday mornings', 'Weekday afternoons', 'Any time', 'Saturdays'].map(k => <button key={k} className={`chip ${home.includes(k) ? 'on' : ''}`} onClick={() => setHome(h => (h.includes(k) ? h.filter(x => x !== k) : [...h, k]))}>{k}</button>)}</div></Field>
      </div>
    </Screen>
  );
}

const FLOW = ['Received', 'Looking into it', 'Visit booked', 'Fixed'];
export function Request() {
  const { id } = useParams();
  const { a, addToIssue, cancelIssue } = useMe();
  const nav = useNavigate();
  const toast = useToast();
  const [more, setMore] = useState('');
  const [photos, setPhotos] = useState(0);
  const i = a.issues.find(x => x.id === id);
  if (!i) return <Screen header={<Header back="/help" title="Request" />}><Empty icon={<IconTool size={24} />} title="Request not found" /></Screen>;
  const at = FLOW.indexOf(i.status);
  return (
    <Screen header={<Header back="/help" title={i.title} sub={`${i.id} · ${i.kind === 'Snag' ? 'Noted at fitting' : 'Aftercare request'}`} />}
      foot={i.status !== 'Fixed' ? <button className="btn btn-primary btn-block" disabled={!more.trim() && !photos} onClick={() => { addToIssue(i.id, more.trim(), photos); toast('Added to your request'); setMore(''); setPhotos(0); }}>Add to request</button> : undefined}>
      <div className="pad">
        <div className="card"><Steps at={i.status === 'Fixed' ? 3 : at} done={i.status === 'Fixed'} labels={FLOW} /></div>
        <div className="kv">
          <div style={{ gridColumn: 'span 2' }}><span>What is wrong</span><b>{i.detail}</b></div>
          <div style={{ gridColumn: 'span 2' }}><span>Window or door</span><b>{i.item}</b></div>
          <div><span>Reported</span><b>{i.reported} · {i.by === 'You' ? 'by you' : i.by.split(' (')[0]}</b></div>
          <div><span>{i.fixedOn ? 'Fixed' : 'Visit'}</span><b>{i.fixedOn ? `${i.fixedOn} · ${i.fixedBy}` : i.visit || 'Not booked yet'}</b></div>
        </div>
        {!!i.photos && <div className="hstack" style={{ gap: 8, flexWrap: 'wrap' }}>{Array.from({ length: i.photos }, (_, k) => <img key={k} src={img(PICS[k % 4])} alt="" style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} />)}</div>}
        <div className="sec"><h3>What has happened</h3></div>
        <div className="card"><div className="route">
          {[...i.log].reverse().map((l, k, arr) => <div key={k} className="stop"><div className="rail"><span className={`pin ${k === 0 ? 'now' : 'done'}`}><IconCheck size={14} stroke={3} /></span>{k < arr.length - 1 && <span className="line" />}</div><span className="vstack grow" style={{ gap: 2, paddingBottom: 12, paddingTop: 4 }}><b style={{ fontSize: 13 }}>{l.text}</b><span className="tiny muted">{l.when}</span></span></div>)}
        </div></div>
        {i.status !== 'Fixed' && (
          <>
            <Field label="Add something (optional)"><textarea className="textarea" rows={2} value={more} onChange={e => setMore(e.target.value)} placeholder="For example: it is worse when it is windy" /></Field>
            <PhotoGrid n={photos} onAdd={() => setPhotos(p => p + 1)} onRemove={() => setPhotos(p => Math.max(0, p - 1))} />
            {i.kind === 'Aftercare' && i.status === 'Received' && <button className="btn btn-ghost btn-block" onClick={() => { cancelIssue(i.id); toast('Request cancelled'); nav('/help'); }}>Cancel this request</button>}
          </>
        )}
      </div>
    </Screen>
  );
}

export function SignOff() {
  const { a, signOff, notFixed } = useMe();
  const nav = useNavigate();
  const toast = useToast();
  const fixed = a.issues.filter(i => i.kind === 'Snag' && i.fixedOn === '16 Oct');
  const [ans, setAns] = useState<Record<string, 'yes' | 'no'>>({});
  const [checks, setChecks] = useState([false, false]);
  const [name, setName] = useState('R Patel');
  const [signed, setSigned] = useState(false);
  const [note, setNote] = useState('');
  if (a.phase !== 'checks') return <Navigate to="/" replace />;
  if (a.happy) {
    return (
      <Screen header={<Header back="/" title="Check the repairs" />}>
        <div className="success">
          <span className="ring"><IconCircleCheck size={50} /></span>
          <h2>Your job is finished</h2>
          <span className="t2">You confirmed you are happy on {a.happy.on}, signed by {a.happy.name}. Your guarantee is in Documents and your final invoice is in Payments.</span>
          <Link to="/payments" className="btn btn-primary btn-block"><IconCurrencyPound size={18} />Go to payments</Link>
          <Link to="/documents" className="btn btn-outline btn-block"><IconShieldCheck size={18} />My documents</Link>
        </div>
      </Screen>
    );
  }
  if (!fixed.length) return <Navigate to="/help" replace />;
  const all = fixed.every(i => ans[i.id]);
  const no = fixed.filter(i => ans[i.id] === 'no');
  const ready = all && (no.length ? note.trim().length > 3 : checks.every(Boolean) && signed && name.trim());
  const submit = () => {
    if (no.length) { notFixed(no.map(i => i.id), note.trim()); toast('Sent · Sarah will call you'); nav('/help'); return; }
    signOff(name.trim()); toast('Thank you · your job is finished'); nav('/');
  };
  return (
    <Screen header={<Header back="/" title="Check the repairs" sub="Amir came back this morning" />}
      foot={<button className="btn btn-primary btn-block" disabled={!ready} onClick={submit}>{!all ? 'Answer each question' : no.length ? 'Send to the office' : <><IconCheck size={18} />I am happy · finish my job</>}</button>}>
      <div className="pad">
        <div className="alert info"><IconInfoCircle size={17} />Please look at each repair and tell us if it is fixed.</div>
        {fixed.map((i, k) => (
          <div key={i.id} className={`mrow ${ans[i.id] === 'yes' ? 'ok' : ans[i.id] === 'no' ? 'changed' : ''}`}>
            <div className="vstack" style={{ gap: 2 }}><b style={{ fontSize: 15 }}>{k + 1}. {i.title}</b><span className="tiny muted">{i.item} · {i.id}</span></div>
            <span className="small t2">{i.log[i.log.length - 1].text}</span>
            <div className="hstack" style={{ gap: 8 }}>{Array.from({ length: i.photos || 0 }, (_, n) => <img key={n} src={img(PICS[n % 4])} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />)}</div>
            <div className="yn">
              <button className={ans[i.id] === 'yes' ? 'yes' : ''} onClick={() => setAns({ ...ans, [i.id]: 'yes' })}><IconCheck size={17} />Fixed</button>
              <button className={ans[i.id] === 'no' ? 'no' : ''} onClick={() => setAns({ ...ans, [i.id]: 'no' })}><IconX size={17} />Not yet</button>
            </div>
          </div>
        ))}
        {all && no.length > 0 && (
          <>
            <div className="alert warn"><IconInfoCircle size={17} />We will arrange another visit. Your final payment stays on hold.</div>
            <Field label="What is still wrong?"><textarea className="textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="For example: the handle is better but still a bit stiff" /></Field>
          </>
        )}
        {all && no.length === 0 && (
          <>
            <div className="sec"><h3>Confirm and sign</h3></div>
            <div className="card">
              <Check on={checks[0]} onChange={v => setChecks([v, checks[1]])} label="Everything opens, closes and locks properly" />
              <Check on={checks[1]} onChange={v => setChecks([checks[0], v])} label="The area was left clean and tidy" />
            </div>
            <Field label="Your name"><input className="input" value={name} onChange={e => setName(e.target.value)} /></Field>
            <Field label="Your signature"><SignaturePad value={signed} onChange={setSigned} name={name} /></Field>
            <div className="alert info"><IconShieldCheck size={17} />Your guarantee goes into Documents and your final payment of £802 is released, due within 14 days.</div>
          </>
        )}
      </div>
    </Screen>
  );
}
