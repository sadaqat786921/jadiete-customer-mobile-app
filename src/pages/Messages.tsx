// Messages: one conversation with Sarah in the office, kept with the job.
import React, { useEffect, useRef, useState } from 'react';
import { IconSend, IconCamera, IconPhone, IconSettings } from '@tabler/icons-react';
import { Screen, Avatar, useToast, img } from '../ui/kit';
import { useMe } from '../data/store';
import { OFFICE } from '../data/portal';

const PICS = ['window', 'door', 'bifold', 'house'];
const Pics = ({ n }: { n: number }) => <span className="hstack" style={{ gap: 6, flexWrap: 'wrap', marginTop: 6 }}>{Array.from({ length: n }, (_, k) => <img key={k} src={img(PICS[k % 4])} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />)}</span>;

export default function Messages() {
  const { a, say, readAll } = useMe();
  const toast = useToast();
  const [txt, setTxt] = useState('');
  const [photos, setPhotos] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { readAll(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [a.msgs.length]);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [a.msgs.length]);
  const send = (t = txt) => { if (!t.trim() && !photos) return; say(t.trim() || `${photos} photo${photos > 1 ? 's' : ''}`, photos || undefined); toast('Sent to Sarah'); setTxt(''); setPhotos(0); };
  const quick = a.phase === 'before' ? ['Can you confirm the arrival time?', 'Do we need to move anything else?', 'Can I pay by bank transfer?']
    : a.phase === 'checks' ? ['Thank you, all looks good', 'When is my final invoice due?', 'Can you send my guarantee?'] : ['How do I clean the glass?', 'Can you send my guarantee again?', 'Thank you, all good'];
  return (
    <Screen tabs scrollRef={box}
      header={<div className="hdr white"><span className="ttl" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, display: 'flex' }}><Avatar i="SM" size={40} bg="#00c7a1" fg="#0b1f1b" /><span className="vstack" style={{ gap: 0 }}><b style={{ fontSize: 15 }}>Sarah Mitchell</b><span className="tiny muted">Jadeite office · replies the same working day</span></span></span><a className="icon-btn" href={`tel:${OFFICE.tel}`} aria-label="Call the office" onClick={() => toast('Calling the office')}><IconPhone size={19} /></a></div>}
      foot={<>
        <div className="chips">{quick.map(q => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}</div>
        {photos > 0 && <div className="between small"><span className="t2">{photos} photo{photos > 1 ? 's' : ''} added</span><button className="link" onClick={() => setPhotos(0)}>Remove</button></div>}
        <div className="composer">
          <button className="icon-btn" aria-label="Add a photo" onClick={() => setPhotos(p => p + 1)}><IconCamera size={19} /></button>
          <textarea value={txt} onChange={e => setTxt(e.target.value)} placeholder="Message Sarah…" aria-label="Message" />
          <button className="send" disabled={!txt.trim() && !photos} onClick={() => send()} aria-label="Send"><IconSend size={20} /></button>
        </div>
      </>}>
      <div className="pad" style={{ gap: 10 }}>
        {a.msgs.map(m => {
          if (m.from === 'system') return <span key={m.id} className="sys"><IconSettings size={12} />{m.text} · {m.when}</span>;
          const out = m.from === 'me';
          return (
            <div key={m.id} className={`bubble ${out ? 'out' : 'in'}`}>
              <div className="who" style={{ color: out ? 'var(--primary-dark)' : 'var(--muted)' }}>{out ? 'You' : `${m.who} · office`}</div>
              <div>{m.text}</div>
              {!!m.photos && <Pics n={m.photos} />}
              <div className="tiny muted" style={{ marginTop: 4, textAlign: 'right' }}>{m.when}</div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
