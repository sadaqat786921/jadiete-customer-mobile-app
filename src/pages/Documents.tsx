// Documents: every paper for the job, grouped; the ones that come later are locked. Tap one to read and download it.
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconFileText, IconLock, IconSearch, IconChevronRight, IconDownload, IconShare } from '@tabler/icons-react';
import { Screen, Header, Tag, Empty, useToast } from '../ui/kit';
import { downloadDoc } from '../lib/customer';
import { useMe } from '../data/store';
import { DocGroup, OFFICE } from '../data/portal';

const GROUPS: DocGroup[] = ['Quote and order', 'Surveys and visits', 'Payments', 'Fitting', 'Guarantee and care'];

export default function Documents() {
  const { a } = useMe();
  const nav = useNavigate();
  const [f, setF] = useState<'all' | DocGroup>('all');
  const [q, setQ] = useState('');
  const list = a.docs.filter(x => (f === 'all' || x.group === f) && (x.name + x.about).toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen header={<>
      <Header back="/" title="Documents" sub={`${a.docs.filter(d => !d.locked).length} ready · job ${a.job}`} />
      <div style={{ padding: '0 16px 10px', display: 'grid', gap: 10 }}>
        <div className="input-icon"><IconSearch size={18} /><input className="input" placeholder="Search my documents" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="chips">
          <button className={`chip ${f === 'all' ? 'on' : ''}`} onClick={() => setF('all')}>All</button>
          {GROUPS.map(g => <button key={g} className={`chip ${f === g ? 'on' : ''}`} onClick={() => setF(g)}>{g}</button>)}
        </div>
      </div>
    </>}>
      <div className="pad" style={{ paddingTop: 4 }}>
        {list.length === 0 && <Empty icon={<IconFileText size={24} />} title="No documents found" sub="Try another word, or choose All." />}
        {GROUPS.filter(g => list.some(x => x.group === g)).map(g => (
          <React.Fragment key={g}>
            <div className="sec"><h3>{g}</h3></div>
            <div className="card flush"><div className="list">
              {list.filter(x => x.group === g).map(x => x.locked ? (
                <div key={x.id} className="li" style={{ alignItems: 'flex-start', background: 'var(--bg)' }}>
                  <span className="ic" style={{ background: '#fff', color: 'var(--muted)' }}><IconLock size={18} /></span>
                  <span className="vstack grow" style={{ gap: 2, minWidth: 0 }}><b style={{ fontSize: 14, color: 'var(--text-2)' }}>{x.name}</b><span className="tiny muted">Ready {x.locked.charAt(0).toLowerCase() + x.locked.slice(1)}</span></span>
                </div>
              ) : (
                <button key={x.id} className="li" style={{ alignItems: 'flex-start' }} onClick={() => nav(`/documents/${x.id}`)}>
                  <span className="ic"><IconFileText size={18} /></span>
                  <span className="vstack grow" style={{ gap: 2, minWidth: 0 }}><b style={{ fontSize: 14 }}>{x.name}</b><span className="tiny muted">{x.about} · {x.added}</span></span>
                  {x.added === '16 Oct' && <Tag tone="jade">New</Tag>}
                  <IconChevronRight size={18} className="chev" style={{ marginTop: 9 }} />
                </button>
              ))}
            </div></div>
          </React.Fragment>
        ))}
      </div>
    </Screen>
  );
}

export function DocView() {
  const { id } = useParams();
  const { a } = useMe();
  const toast = useToast();
  const d = a.docs.find(x => x.id === id);
  if (!d || d.locked) return <Screen header={<Header back="/documents" title="Document" />}><Empty icon={<IconLock size={24} />} title="Not ready yet" sub={d?.locked} /></Screen>;
  return (
    <Screen header={<Header back title={d.name} sub={`${d.pages} page${d.pages > 1 ? 's' : ''} · added ${d.added}`} />}
      foot={<div className="row2"><button className="btn btn-outline" onClick={() => toast('Opening share options')}><IconShare size={18} />Share</button><button className="btn btn-primary" onClick={() => { downloadDoc(d, a); toast('Saved to your phone'); }}><IconDownload size={18} />Download</button></div>}>
      <div className="pad">
        <div className="card" style={{ gap: 16 }}>
          <div className="between"><span className="hstack" style={{ gap: 8 }}><img src="images/mark.svg" style={{ height: 24 }} alt="" /><b style={{ fontSize: 15 }}>Jadeite Glazing</b></span><span className="tiny muted">Page 1 of {d.pages}</span></div>
          <div className="vstack" style={{ gap: 4 }}><b style={{ fontSize: 17 }}>{d.name}</b><span className="tiny muted">{a.name} · {a.address}, {a.postcode} · job {a.job}</span></div>
          <span className="small t2">{d.about}</span>
          {d.lines ? <div className="kv">{d.lines.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>
            : <div className="vstack" style={{ gap: 8 }}>{[92, 100, 78, 96, 64].map((w, i) => <span key={i} style={{ display: 'block', height: 8, borderRadius: 4, background: '#eef2f1', width: `${w}%` }} />)}</div>}
          {d.group === 'Quote and order' && d.id !== 'd-terms' && (
            <div className="vstack" style={{ gap: 6 }}>
              <b className="small">Windows and doors</b>
              {a.items.map(i => <div key={i.ref} className="between small" style={{ borderTop: '1px solid var(--border)', paddingTop: 6, gap: 8 }}><span>{i.qty} × {i.type}</span><span className="muted">{i.w} × {i.h}mm</span></div>)}
            </div>
          )}
          <div className="vstack" style={{ gap: 8 }}>{[100, 88, 70].map((w, i) => <span key={i} style={{ display: 'block', height: 8, borderRadius: 4, background: '#eef2f1', width: `${w}%` }} />)}</div>
          <span className="tiny muted">Jadeite Glazing Ltd · {OFFICE.phone} · {OFFICE.email}</span>
        </div>
      </div>
    </Screen>
  );
}
