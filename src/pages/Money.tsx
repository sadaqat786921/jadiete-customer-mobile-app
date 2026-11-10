// My order (what is being made, sizes, finish, progress, price) and Payments (paid, due, pay, receipts).
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconCheck, IconFileText, IconRuler2, IconMessage, IconCircleCheck, IconClock, IconLock, IconBuildingBank, IconInfoCircle, IconChevronRight, IconCurrencyPound } from '@tabler/icons-react';
import { Screen, Header, Tag } from '../ui/kit';
import { PaySheet } from '../ui/sheets';
import { invTone } from '../lib/customer';
import { useMe } from '../data/store';
import { IMG, BANK, Invoice, gbp, fmt } from '../data/portal';

export function Order() {
  const { a } = useMe();
  const nav = useNavigate();
  const frames = a.items.reduce((s, i) => s + i.qty, 0);
  const st = a.order.status;
  const fitted = a.phase !== 'before';
  const steps: [string, string, boolean, boolean][] = [
    ['Order placed', `${a.order.ordered} · ${a.order.ref}`, true, false],
    ['Confirmed by the factory', `${a.order.supplier} checked every size`, true, false],
    ['Being made', 'Made to your exact sizes', st !== 'Being made', st === 'Being made'],
    ['On the way', st === 'On the way' ? `Arrives ${a.order.expected}` : 'Left the factory', st === 'Delivered', st === 'On the way'],
    ['Checked at our depot', `${a.order.expected} · every frame checked`, st === 'Delivered', false],
    ['Fitted', fitted ? 'Done' : 'On your fitting day', fitted, false],
  ];
  return (
    <Screen header={<Header back="/" title="My order" sub={`${a.quote} · job ${a.job}`} />}>
      <div className="pad">
        <div className="vhero" style={{ backgroundImage: `url(${IMG[a.photo]})`, height: 170, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ marginTop: 'auto', padding: 16 }} className="vstack"><span style={{ alignSelf: 'flex-start' }}><Tag tone={fitted ? 'ok' : 'jade'}>{fitted ? 'Fitted' : st}</Tag></span><b style={{ fontSize: 18, marginTop: 6 }}>{a.products}</b><span style={{ fontSize: 13, color: '#cfe0db' }}>{frames} frame{frames > 1 ? 's' : ''} · {a.address}</span></div>
        </div>
        <div className="sec"><h3>What we are making</h3></div>
        {a.items.map(i => (
          <div key={i.ref} className="file" style={{ alignItems: 'flex-start' }}>
            <img src={IMG[i.photo]} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
            <span className="vstack grow" style={{ gap: 2, minWidth: 0 }}>
              <b style={{ fontSize: 14 }}>{i.qty > 1 ? `${i.qty} × ` : ''}{i.type}</b>
              <span className="tiny muted">{i.room}{i.notes ? ` · ${i.notes}` : ''}</span>
              <span className="small hstack" style={{ gap: 5, color: 'var(--primary-dark)', fontWeight: 600 }}><IconRuler2 size={15} />{i.w} × {i.h}mm</span>
            </span>
          </div>
        ))}
        <span className="tiny muted">Sizes are width × height, checked at your home before anything was ordered.</span>
        <div className="sec"><h3>Your finish</h3></div>
        <div className="kv">{a.spec.map(([k, v]) => <div key={k} style={{ gridColumn: v.length > 22 ? 'span 2' : undefined }}><span>{k}</span><b>{v}</b></div>)}</div>
        <div className="sec"><h3>Where your order is up to</h3></div>
        <div className="card"><div className="route">
          {steps.map(([t, s, done, now], i) => (
            <div key={t} className="stop"><div className="rail"><span className={`pin ${done ? 'done' : now ? 'now' : ''}`}>{done ? <IconCheck size={14} stroke={3} /> : i + 1}</span>{i < steps.length - 1 && <span className="line" style={done ? { background: 'var(--primary)' } : undefined} />}</div>
              <span className="vstack grow" style={{ gap: 2, paddingBottom: 12, paddingTop: 4 }}><span className="hstack" style={{ gap: 6 }}><b style={{ fontSize: 13, color: done || now ? 'var(--text)' : 'var(--muted)' }}>{t}</b>{now && <Tag tone="jade">Now</Tag>}</span><span className="tiny muted">{s}</span></span></div>
          ))}
        </div></div>
        <div className="sec"><h3>Your price</h3><Link to="/payments">Payments<IconChevronRight size={15} /></Link></div>
        <div className="card">
          <div className="between"><span className="t2">Total including VAT</span><b style={{ fontSize: 18 }}>{gbp(a.total)}</b></div>
          {a.invoices.map(i => <div key={i.ref} className="between"><span className="small">{i.type}{i.pct ? ` (${i.pct}%)` : ''}</span><span className="hstack" style={{ gap: 8 }}><b className="small">{gbp(i.amount)}</b><Tag tone={invTone(i.status)}>{i.status}</Tag></span></div>)}
        </div>
        <div className="sec"><h3>Papers for this order</h3></div>
        {['d-quote', 'd-order', 'd-final'].map(id => { const x = a.docs.find(y => y.id === id)!; return <button key={id} className="file" onClick={() => nav(`/documents/${id}`)}><span className="tile" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--tint)', color: 'var(--primary-dark)' }}><IconFileText size={20} /></span><span className="vstack grow" style={{ gap: 1, minWidth: 0 }}><b style={{ fontSize: 14 }}>{x.name}</b><span className="tiny muted">{x.about}</span></span><IconChevronRight size={18} color="#a5b2af" /></button>; })}
        <Link to={fitted ? '/help' : '/messages'} className="alert info"><IconMessage size={17} /><span className="grow">{fitted ? 'Something not right? Go to Help and aftercare.' : 'Want to change something? Your frames are being made, so ask Sarah and she will check.'}</span><IconChevronRight size={16} /></Link>
      </div>
    </Screen>
  );
}

export function Payments() {
  const { a } = useMe();
  const nav = useNavigate();
  const [pay, setPay] = useState<Invoice | null>(null);
  const paid = a.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const due = a.invoices.filter(i => i.status === 'Due');
  const docId = (i: Invoice) => `d-${i.ref.toLowerCase().replace('-', '')}`;
  return (
    <Screen tabs header={<div className="hdr-lg"><h1>Payments</h1></div>}>
      <div className="pad" style={{ paddingTop: 4 }}>
        <div className="card" style={{ background: 'var(--deep)', color: '#fff', border: 0 }}>
          <span style={{ fontSize: 13, color: '#cfe0db' }}>{paid >= a.total ? 'Paid in full. Thank you.' : 'Left to pay'}</span>
          <b style={{ fontSize: 20 }}>{gbp(a.total - paid)}</b>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,.15)', overflow: 'hidden' }}><div style={{ width: `${(paid / a.total) * 100}%`, height: '100%', background: 'var(--primary)' }} /></div>
          <div className="between" style={{ fontSize: 12, color: '#cfe0db' }}><span>{gbp(paid)} paid</span><span>Total {gbp(a.total)}</span></div>
        </div>
        {due.map(i => (
          <div key={i.ref} className="card" style={{ borderColor: '#f2e0a8', background: '#fffcf3' }}>
            <div className="hstack" style={{ gap: 12 }}><span className="tile" style={{ width: 44, height: 44, borderRadius: 12, background: '#fdf3d9', color: '#9a6f00' }}><IconCurrencyPound size={22} /></span><span className="vstack grow" style={{ gap: 2 }}><b style={{ fontSize: 15 }}>{i.type} · {gbp(i.amount)}</b><span className="tiny muted">Due {fmt(i.due)} · {i.ref}</span></span></div>
            <div className="hstack" style={{ gap: 8 }}>
              {a.docs.some(x => x.id === docId(i)) && <button className="btn btn-outline" onClick={() => nav(`/documents/${docId(i)}`)}>Invoice</button>}
              <button className="btn btn-primary grow" onClick={() => setPay(i)}>Pay {gbp(i.amount)}</button>
            </div>
          </div>
        ))}
        <div className="sec"><h3>Your payments</h3><span className="tiny muted">{a.plan.split(' · ').length} stages</span></div>
        <div className="card flush"><div className="list">
          {a.invoices.map(i => {
            const has = a.docs.some(x => x.id === docId(i));
            return (
              <button key={i.ref} className="li" style={{ alignItems: 'flex-start' }} disabled={!has} onClick={() => has && nav(`/documents/${docId(i)}`)}>
                <span className="ic" style={i.status === 'Paid' ? { background: '#e3f6ec', color: 'var(--ok)' } : i.status === 'Due' ? { background: '#fdf3d9', color: '#9a6f00' } : { background: 'var(--bg)', color: 'var(--muted)' }}>{i.status === 'Paid' ? <IconCircleCheck size={19} /> : i.status === 'Checking' ? <IconBuildingBank size={19} /> : i.status === 'On hold' ? <IconLock size={19} /> : <IconClock size={19} />}</span>
                <span className="vstack grow" style={{ gap: 2, minWidth: 0 }}>
                  <span className="between"><b style={{ fontSize: 14 }}>{i.type}{i.pct ? ` · ${i.pct}%` : ''}</b><b style={{ fontSize: 14 }}>{gbp(i.amount)}</b></span>
                  <span className="tiny muted">{i.status === 'Paid' ? `Paid ${i.paidOn} · ${i.method}` : i.status === 'Checking' ? 'Bank transfer sent · we are checking it arrived' : i.status === 'Due' ? `Due ${fmt(i.due)}` : i.note}</span>
                  <span className="between"><span className="tiny muted">{i.ref}{has ? ` · ${i.status === 'Paid' ? 'receipt' : 'invoice'}` : ''}</span><Tag tone={invTone(i.status)}>{i.status}</Tag></span>
                </span>
              </button>
            );
          })}
        </div></div>
        {a.invoices.some(i => i.status === 'On hold') && <div className="alert info"><IconInfoCircle size={17} />Your final payment is on hold while we put the last things right. Nothing is due until you tell us you are happy.</div>}
        <div className="sec"><h3>Ways to pay</h3></div>
        <div className="card flush"><div className="list">
          <div className="li" style={{ alignItems: 'flex-start' }}><span className="ic"><IconLock size={19} /></span><span className="vstack grow" style={{ gap: 2 }}><b style={{ fontSize: 14 }}>Card, here in the app</b><span className="tiny muted">Safe and instant. Your receipt appears straight away.</span></span></div>
          <div className="li" style={{ alignItems: 'flex-start' }}><span className="ic"><IconBuildingBank size={19} /></span><span className="vstack grow" style={{ gap: 2 }}><b style={{ fontSize: 14 }}>Bank transfer</b><span className="tiny muted">{BANK.name} · sort code {BANK.sort} · account {BANK.account} · reference {a.job}</span></span></div>
        </div></div>
        <span className="tiny muted" style={{ textAlign: 'center' }}>{a.plan}</span>
      </div>
      {pay && <PaySheet inv={pay} onClose={() => setPay(null)} />}
    </Screen>
  );
}
