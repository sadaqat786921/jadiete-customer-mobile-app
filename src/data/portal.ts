// Sample data for the Jadeite Systems Customer portal.
// The same customers, jobs, dates and invoices as the Office Admin, Sales, Surveyor and Installer apps.
// All names, numbers and addresses are invented for demonstration.

export const TODAY = '2026-10-16'; // Friday 16 October 2026
export const OFFICE = { phone: '0116 496 0000', tel: '01164960000', email: 'hello@jadeiteglazing.co.uk', hours: 'Mon to Fri 8am – 5:30pm · Sat 9am – 1pm' };
export const BANK = { name: 'Jadeite Glazing Ltd', sort: '20-45-77', account: '43917286' };

export const IMG = {
  house: 'images/house.jpg',
  door: 'images/door.jpg',
  bifold: 'images/bifold.jpg',
  orangery: 'images/orangery.jpg',
  window: 'images/window.jpg',
  roof: 'images/roof.jpg',
};
export type Pic = keyof typeof IMG;

export type AcctId = 'smith' | 'patel' | 'khan';

export type Person = { name: string; initials: string; role: string; phone?: string; note?: string };
export type Item = { ref: string; room: string; type: string; w: number; h: number; qty: number; notes?: string; photo: Pic };
export type Visit = {
  id: string; kind: 'Sales visit' | 'Survey' | 'Final survey' | 'Delivery' | 'Installation' | 'Return visit' | 'Aftercare visit';
  date: string; days?: number; time: string; who: string[]; status: 'Done' | 'Booked';
  what: string; doc?: string; home?: boolean;
};
export type InvStatus = 'Paid' | 'Due' | 'On hold' | 'Not sent yet' | 'Checking';
export type Invoice = { ref: string; type: string; pct?: number; amount: number; due: string; status: InvStatus; paidOn?: string; method?: string; note?: string };
export type DocGroup = 'Quote and order' | 'Surveys and visits' | 'Payments' | 'Fitting' | 'Guarantee and care';
export type Doc = { id: string; name: string; group: DocGroup; added?: string; pages: number; locked?: string; lines?: [string, string][]; about: string };
export type Msg = { id: string; from: 'me' | 'office' | 'system'; who: string; text: string; when: string; photos?: number; read?: boolean };
export type IssueStatus = 'Received' | 'Looking into it' | 'Visit booked' | 'Fixed';
export type Issue = {
  id: string; kind: 'Snag' | 'Aftercare'; title: string; detail: string; item: string; reported: string; by: string;
  status: IssueStatus; visit?: string; fixedOn?: string; fixedBy?: string; photos?: number; urgent?: boolean; log: { when: string; text: string }[];
};
export type Upd = { when: string; text: string; icon: 'check' | 'truck' | 'calendar' | 'pound' | 'file' | 'tool' | 'message' | 'shield' };

export type Account = {
  id: AcctId; name: string; first: string; dear: string; initials: string; email: string; phone: string; address: string; postcode: string;
  job: string; quote: string; products: string; photo: Pic; spec: [string, string][];
  team: Person[]; items: Item[]; visits: Visit[]; invoices: Invoice[]; docs: Doc[]; msgs: Msg[]; issues: Issue[]; updates: Upd[];
  total: number; plan: string; order: { ref: string; ordered: string; supplier: string; expected: string; status: 'Being made' | 'On the way' | 'Delivered' };
  phase: 'before' | 'checks' | 'done'; // before fitting · fitted, final checks · all done (aftercare)
  review?: { stars: number; text: string; on: string };
};

const SARAH: Person = { name: 'Sarah Mitchell', initials: 'SM', role: 'Office · your main contact', phone: OFFICE.phone, note: 'Looks after your job from order to aftercare' };

/* ------------------------------------------------------------------ */
/* Sarah & David Smith · JG-10482 · before fitting                     */
/* ------------------------------------------------------------------ */
const SMITH: Account = {
  id: 'smith', name: 'Sarah & David Smith', first: 'Sarah', dear: 'Sarah and David', initials: 'SS', email: 'smiths@email.co.uk', phone: '07700 900 482',
  address: '14 Ashby Road, Leicester', postcode: 'LE2 3HT', job: 'JG-10482', quote: 'FP-55109', products: '6 windows and a front door', photo: 'house',
  spec: [['Frame colour', 'Anthracite grey outside, white inside'], ['Glass', 'A-rated double glazing, toughened where needed'], ['Handles', 'Chrome, locking'], ['Front door', 'Composite, anthracite, chrome handle']],
  team: [
    SARAH,
    { name: 'Mike Harris', initials: 'MH', role: 'Salesperson', phone: '07700 900 101', note: 'Visited you and made your quote' },
    { name: 'Priya Shah', initials: 'PS', role: 'Surveyor', note: 'Checked every size on 2 Oct' },
    { name: 'Dan Hughes', initials: 'DH', role: 'Lead fitter', note: 'Fitting 22 – 23 Oct' },
    { name: 'Lee Brooks', initials: 'LB', role: 'Fitter', note: 'Fitting 22 – 23 Oct' },
    { name: 'Chris Reid', initials: 'CR', role: 'Fitter', note: 'Fitting 22 – 23 Oct' },
  ],
  items: [
    { ref: 'W1', room: 'Lounge (front bay)', type: 'Casement window', w: 1770, h: 1200, qty: 2, notes: 'Bay window, 2 frames', photo: 'window' },
    { ref: 'W2', room: 'Bedroom 1', type: 'Casement window', w: 1200, h: 1050, qty: 2, photo: 'window' },
    { ref: 'W3', room: 'Kitchen', type: 'Casement window', w: 1000, h: 900, qty: 2, notes: 'Safety restrictors', photo: 'window' },
    { ref: 'D1', room: 'Front entrance', type: 'Composite front door', w: 920, h: 2090, qty: 1, notes: 'Anthracite, chrome handle', photo: 'door' },
  ],
  visits: [
    { id: 'v1', kind: 'Sales visit', date: '2026-09-28', time: '16:00 – 17:00', who: ['Mike Harris'], status: 'Done', what: 'Mike talked through windows and doors and took first measurements.', home: true },
    { id: 'v2', kind: 'Survey', date: '2026-09-29', time: '10:00 – 11:30', who: ['Priya Shah'], status: 'Done', what: 'Survey for your quote.', doc: 'd-survey', home: true },
    { id: 'v3', kind: 'Final survey', date: '2026-10-02', time: '10:00 – 11:30', who: ['Priya Shah'], status: 'Done', what: 'Every size checked before ordering. All sizes confirmed.', doc: 'd-final', home: true },
    { id: 'v4', kind: 'Delivery', date: '2026-10-20', time: 'During the day', who: ['Emplas'], status: 'Booked', what: 'Your frames arrive at our depot. We check every frame before fitting day. You do not need to be home.' },
    { id: 'v5', kind: 'Installation', date: '2026-10-22', days: 2, time: 'Arrive 08:00 – 09:00', who: ['Dan Hughes', 'Lee Brooks', 'Chris Reid'], status: 'Booked', what: 'Old windows and door out, new ones in. Your home is left secure at the end of day 1.', home: true },
  ],
  total: 6280, plan: '50% deposit · 40% before fitting · 10% when finished',
  invoices: [
    { ref: 'INV-3381', type: 'Deposit', pct: 50, amount: 3140, due: '2026-09-30', status: 'Paid', paidOn: '30 Sep', method: 'Card' },
    { ref: 'INV-3392', type: 'Stage payment', pct: 40, amount: 2512, due: '2026-10-20', status: 'Due', note: 'Due 2 days before fitting starts' },
    { ref: 'INV-3410', type: 'Final payment', pct: 10, amount: 628, due: '', status: 'Not sent yet', note: 'Sent when the work is finished and you are happy' },
  ],
  order: { ref: 'SO-48238', ordered: '06 Oct', supplier: 'Emplas', expected: 'Tue 20 Oct', status: 'On the way' },
  docs: [
    { id: 'd-quote', name: 'Your quote FP-55109', group: 'Quote and order', added: '29 Sep', pages: 4, about: 'Signed online 30 Sep', lines: [['Quote', 'FP-55109'], ['Made by', 'Mike Harris'], ['Total', '£6,280 inc. VAT'], ['Signed', '30 Sep 2026']] },
    { id: 'd-terms', name: 'Terms and conditions', group: 'Quote and order', added: '30 Sep', pages: 6, about: 'Agreed with your quote' },
    { id: 'd-order', name: 'Order confirmation', group: 'Quote and order', added: '06 Oct', pages: 2, about: 'Your frames are made to these sizes', lines: [['Order', 'SO-48238'], ['Frames', '7'], ['Ordered', '06 Oct 2026'], ['Delivery', 'Tue 20 Oct 2026']] },
    { id: 'd-survey', name: 'Survey report', group: 'Surveys and visits', added: '29 Sep', pages: 3, about: 'Priya Shah · 29 Sep' },
    { id: 'd-final', name: 'Final survey report', group: 'Surveys and visits', added: '02 Oct', pages: 3, about: 'All sizes confirmed · signed by you', lines: [['Surveyor', 'Priya Shah'], ['Date', '02 Oct 2026'], ['Result', 'All sizes the same'], ['Signed', 'Sarah Smith']] },
    { id: 'd-inv3381', name: 'Deposit receipt INV-3381', group: 'Payments', added: '30 Sep', pages: 1, about: '£3,140 paid by card' },
    { id: 'd-inv3392', name: 'Stage payment invoice INV-3392', group: 'Payments', added: '13 Oct', pages: 1, about: '£2,512 due Tue 20 Oct' },
    { id: 'd-ready', name: 'Getting ready for fitting day', group: 'Fitting', added: '13 Oct', pages: 2, about: 'What to do before the fitters arrive' },
    { id: 'd-complete', name: 'Completion certificate', group: 'Fitting', pages: 1, locked: 'After your fitting', about: 'Signed at the end of fitting' },
    { id: 'd-guarantee', name: '10-year guarantee', group: 'Guarantee and care', pages: 4, locked: 'When your job is finished', about: 'Covers frames, glass and fitting' },
    { id: 'd-fensa', name: 'FENSA certificate', group: 'Guarantee and care', pages: 1, locked: 'When your job is finished', about: 'Shows the work meets building rules' },
    { id: 'd-care', name: 'Care guide', group: 'Guarantee and care', pages: 6, locked: 'When your job is finished', about: 'Keep your windows and door like new' },
  ],
  msgs: [
    { id: 'm1', from: 'office', who: 'Sarah Mitchell', text: 'Welcome to your Jadeite portal, Sarah and David! I am Sarah and I look after your job. You can see your dates, documents and payments here, and message me any time.', when: '30 Sep, 20:05', read: true },
    { id: 'm2', from: 'system', who: 'Jadeite', text: 'Your order was placed with Emplas', when: '06 Oct, 11:00' },
    { id: 'm3', from: 'office', who: 'Sarah Mitchell', text: 'Good news: your fitting is booked for Thursday 22 and Friday 23 October. Dan, Lee and Chris will arrive between 8 and 9am. Your stage payment invoice is in Payments.', when: '13 Oct, 15:10', read: true },
    { id: 'm4', from: 'me', who: 'Sarah Smith', text: 'Thanks! Will the fitters need the driveway clear?', when: '16 Oct, 10:42' },
  ],
  issues: [],
  updates: [
    { when: '16 Oct', text: 'Your frames left the factory and are on their way', icon: 'truck' },
    { when: '13 Oct', text: 'Fitting booked for Thu 22 – Fri 23 Oct', icon: 'calendar' },
    { when: '13 Oct', text: 'Stage payment invoice sent · £2,512', icon: 'pound' },
    { when: '06 Oct', text: 'Order placed with Emplas · 7 frames', icon: 'file' },
    { when: '02 Oct', text: 'Final survey done · all sizes confirmed', icon: 'check' },
    { when: '30 Sep', text: 'Quote signed and deposit paid', icon: 'pound' },
  ],
  phase: 'before',
};

/* ------------------------------------------------------------------ */
/* Mrs Patel · JG-10471 · fitted, repairs done today                   */
/* ------------------------------------------------------------------ */
const PATEL: Account = {
  id: 'patel', name: 'Mrs Patel', first: 'Mrs Patel', dear: 'Mrs Patel', initials: 'RP', email: 'patel.r@email.co.uk', phone: '07700 900 643',
  address: '7 Leeds Road, Oadby', postcode: 'LE2 5AA', job: 'JG-10471', quote: 'FP-55061', products: 'Bi-fold doors and 2 windows', photo: 'bifold',
  spec: [['Frame colour', 'Grey outside, white inside'], ['Glass', 'A-rated double glazing, toughened'], ['Bi-fold', '3 panels, opening to the left'], ['Handles', 'Satin silver, locking']],
  team: [
    SARAH,
    { name: 'Mike Harris', initials: 'MH', role: 'Salesperson', phone: '07700 900 101', note: 'Visited you and made your quote' },
    { name: 'Priya Shah', initials: 'PS', role: 'Surveyor', note: 'Checked every size on 26 Aug' },
    { name: 'Amir Khan', initials: 'AK', role: 'Lead fitter', note: 'Fitted your doors and came back today' },
    { name: 'Joe Patel', initials: 'JP', role: 'Fitter', note: 'Fitted 8 – 9 Oct' },
    { name: 'Chris Reid', initials: 'CR', role: 'Fitter', note: 'Fitted 8 – 9 Oct' },
  ],
  items: [
    { ref: 'D1', room: 'Kitchen to garden', type: 'Bi-fold door (3 panels)', w: 3000, h: 2100, qty: 1, notes: 'Opens to the left', photo: 'bifold' },
    { ref: 'W1', room: 'Rear bedroom', type: 'Casement window', w: 1100, h: 1050, qty: 2, photo: 'window' },
  ],
  visits: [
    { id: 'v1', kind: 'Survey', date: '2026-08-10', time: '10:00 – 11:00', who: ['Mike Harris'], status: 'Done', what: 'Survey for your quote.', doc: 'd-survey', home: true },
    { id: 'v2', kind: 'Final survey', date: '2026-08-26', time: '10:00 – 11:30', who: ['Priya Shah'], status: 'Done', what: 'Every size checked before ordering. All sizes confirmed.', doc: 'd-final', home: true },
    { id: 'v3', kind: 'Delivery', date: '2026-10-05', time: 'During the day', who: ['Origin'], status: 'Done', what: 'Frames arrived at our depot and were checked.' },
    { id: 'v4', kind: 'Installation', date: '2026-10-08', days: 2, time: 'Arrive 08:00 – 09:00', who: ['Amir Khan', 'Joe Patel', 'Chris Reid'], status: 'Done', what: 'Bi-fold doors and 2 windows fitted. You signed the handover on 9 Oct.', doc: 'd-complete', home: true },
    { id: 'v5', kind: 'Return visit', date: '2026-10-14', time: '09:00 – 10:00', who: ['Tom Wright'], status: 'Done', what: 'Looked at the stiff handle. A new handle part was ordered.', home: true },
    { id: 'v6', kind: 'Return visit', date: '2026-10-16', time: '08:00 – 09:00', who: ['Amir Khan'], status: 'Done', what: 'Fixed the scratch on the bi-fold frame and fitted the new window handle.', doc: 'd-return', home: true },
  ],
  total: 8020, plan: '50% deposit · 40% before fitting · 10% when finished',
  invoices: [
    { ref: 'INV-3302', type: 'Deposit', pct: 50, amount: 4010, due: '2026-08-20', status: 'Paid', paidOn: '20 Aug', method: 'Bank transfer' },
    { ref: 'INV-3341', type: 'Stage payment', pct: 40, amount: 3208, due: '2026-10-06', status: 'Paid', paidOn: '02 Oct', method: 'Card' },
    { ref: 'INV-3369', type: 'Final payment', pct: 10, amount: 802, due: '', status: 'On hold', note: 'On hold until you are happy with the repairs. Nothing to pay yet.' },
  ],
  order: { ref: 'SO-48121', ordered: '29 Aug', supplier: 'Origin', expected: 'Mon 5 Oct', status: 'Delivered' },
  docs: [
    { id: 'd-quote', name: 'Your quote FP-55061', group: 'Quote and order', added: '12 Aug', pages: 3, about: 'Accepted 20 Aug', lines: [['Quote', 'FP-55061'], ['Made by', 'Mike Harris'], ['Total', '£8,020 inc. VAT'], ['Accepted', '20 Aug 2026']] },
    { id: 'd-terms', name: 'Terms and conditions', group: 'Quote and order', added: '20 Aug', pages: 6, about: 'Agreed with your quote' },
    { id: 'd-order', name: 'Order confirmation', group: 'Quote and order', added: '29 Aug', pages: 2, about: 'Your frames are made to these sizes' },
    { id: 'd-survey', name: 'Survey report', group: 'Surveys and visits', added: '10 Aug', pages: 2, about: 'Mike Harris · 10 Aug' },
    { id: 'd-final', name: 'Final survey report', group: 'Surveys and visits', added: '26 Aug', pages: 3, about: 'All sizes confirmed · signed by you' },
    { id: 'd-return', name: 'Return visit report', group: 'Surveys and visits', added: '16 Oct', pages: 2, about: 'Amir Khan · both repairs done, with photos', lines: [['Fitter', 'Amir Khan'], ['Date', '16 Oct 2026'], ['Scratch on bi-fold frame', 'Fixed'], ['Stiff window handle', 'Fixed · new handle fitted']] },
    { id: 'd-inv3302', name: 'Deposit receipt INV-3302', group: 'Payments', added: '20 Aug', pages: 1, about: '£4,010 paid by bank transfer' },
    { id: 'd-inv3341', name: 'Stage payment receipt INV-3341', group: 'Payments', added: '02 Oct', pages: 1, about: '£3,208 paid by card' },
    { id: 'd-ready', name: 'Getting ready for fitting day', group: 'Fitting', added: '06 Oct', pages: 2, about: 'What to do before the fitters arrive' },
    { id: 'd-complete', name: 'Completion certificate', group: 'Fitting', added: '09 Oct', pages: 2, about: 'Signed by you on 9 Oct · 2 small things to put right', lines: [['Fitted by', 'Amir Khan, Joe Patel, Chris Reid'], ['Finished', '09 Oct 2026'], ['Signed', 'R Patel'], ['To put right', '2 small things']] },
    { id: 'd-guarantee', name: '10-year guarantee', group: 'Guarantee and care', pages: 4, locked: 'When you are happy with the repairs', about: 'Covers frames, glass and fitting' },
    { id: 'd-fensa', name: 'FENSA certificate', group: 'Guarantee and care', pages: 1, locked: 'When you are happy with the repairs', about: 'Shows the work meets building rules' },
    { id: 'd-care', name: 'Care guide', group: 'Guarantee and care', pages: 6, added: '09 Oct', about: 'Keep your bi-folds and windows like new' },
  ],
  msgs: [
    { id: 'm1', from: 'office', who: 'Sarah Mitchell', text: 'Thank you for having us, Mrs Patel. Amir noted 2 small things to put right: a scratch on the bi-fold frame and a stiff bedroom window handle. We will book a visit to fix them.', when: '09 Oct, 17:20', read: true },
    { id: 'm2', from: 'me', who: 'Mrs Patel', text: 'The bedroom window handle is still stiff after Tuesday. Can someone come back?', when: '15 Oct, 16:05' },
    { id: 'm3', from: 'office', who: 'Sarah Mitchell', text: 'Sorry about that. The new handle has arrived. Amir will come back tomorrow, Friday 16 Oct, between 8 and 9am to fit it and fix the scratch.', when: '15 Oct, 16:30', read: true },
    { id: 'm4', from: 'office', who: 'Sarah Mitchell', text: 'Amir fixed both this morning. Please have a look, and when you are happy, confirm it in your portal. Then we can finish your job and send your guarantee.', when: '16 Oct, 09:40' },
  ],
  issues: [
    { id: 'SN-117', kind: 'Snag', title: 'Scratch on the bi-fold frame', detail: 'Small scratch on the left panel frame.', item: 'Bi-fold door (3 panels)', reported: '09 Oct', by: 'Amir Khan (fitter)', status: 'Fixed', visit: 'Fri 16 Oct, 08:00 – 09:00', fixedOn: '16 Oct', fixedBy: 'Amir Khan', photos: 2,
      log: [{ when: '09 Oct', text: 'Noted by Amir at the handover' }, { when: '15 Oct', text: 'Visit booked for Fri 16 Oct' }, { when: '16 Oct', text: 'Fixed by Amir · 2 photos' }] },
    { id: 'SN-118', kind: 'Snag', title: 'Bedroom window handle is stiff', detail: 'Rear bedroom window handle hard to turn.', item: 'Casement window · Rear bedroom', reported: '09 Oct', by: 'You', status: 'Fixed', visit: 'Fri 16 Oct, 08:00 – 09:00', fixedOn: '16 Oct', fixedBy: 'Amir Khan', photos: 2,
      log: [{ when: '09 Oct', text: 'Reported by you at the handover' }, { when: '14 Oct', text: 'Tom looked at it · new handle ordered' }, { when: '15 Oct', text: 'Visit booked for Fri 16 Oct' }, { when: '16 Oct', text: 'New handle fitted by Amir · 2 photos' }] },
  ],
  updates: [
    { when: '16 Oct', text: 'Amir fixed the scratch and fitted the new handle', icon: 'tool' },
    { when: '15 Oct', text: 'Return visit booked for Fri 16 Oct', icon: 'calendar' },
    { when: '09 Oct', text: 'Fitting finished · you signed the handover', icon: 'check' },
    { when: '08 Oct', text: 'Fitting started', icon: 'tool' },
    { when: '02 Oct', text: 'Stage payment received · £3,208', icon: 'pound' },
    { when: '29 Aug', text: 'Order placed with Origin', icon: 'file' },
  ],
  phase: 'checks',
};

/* ------------------------------------------------------------------ */
/* Mr Khan · JG-10455 · all done, in guarantee                         */
/* ------------------------------------------------------------------ */
const KHAN: Account = {
  id: 'khan', name: 'Mr Khan', first: 'Mr Khan', dear: 'Mr Khan', initials: 'MK', email: 'a.khan@email.co.uk', phone: '07700 900 233',
  address: '41 York Road, Harrogate', postcode: 'HG1 2QL', job: 'JG-10455', quote: 'FP-55052', products: 'Orangery roof', photo: 'orangery',
  spec: [['Roof', 'Roof lantern, 2400 × 1200mm'], ['Frame colour', 'Grey outside, white inside'], ['Glass', 'Solar control, self-cleaning'], ['Trims', 'Grey to match']],
  team: [
    SARAH,
    { name: 'Emma Clarke', initials: 'EC', role: 'Salesperson', phone: '07700 900 102', note: 'Visited you and made your quote' },
    { name: 'Rob King', initials: 'RK', role: 'Surveyor', note: 'Checked every size on 18 Aug' },
    { name: 'Amir Khan', initials: 'AK', role: 'Lead fitter', note: 'Fitted 12 – 14 Oct' },
    { name: 'Joe Patel', initials: 'JP', role: 'Fitter', note: 'Fitted 12 – 14 Oct' },
    { name: 'Sam Price', initials: 'SP', role: 'Apprentice', note: 'Fitted 12 – 14 Oct' },
  ],
  items: [{ ref: 'R1', room: 'Orangery', type: 'Roof lantern', w: 2400, h: 1200, qty: 1, notes: 'Solar control glass', photo: 'roof' }],
  visits: [
    { id: 'v1', kind: 'Survey', date: '2026-08-02', time: '10:00 – 11:00', who: ['Emma Clarke'], status: 'Done', what: 'Survey for your quote.', doc: 'd-survey', home: true },
    { id: 'v2', kind: 'Final survey', date: '2026-08-18', time: '09:00 – 10:00', who: ['Rob King'], status: 'Done', what: 'Every size checked before ordering. All sizes confirmed.', doc: 'd-final', home: true },
    { id: 'v3', kind: 'Delivery', date: '2026-10-09', time: 'During the day', who: ['Origin'], status: 'Done', what: 'Roof arrived at our depot and was checked.' },
    { id: 'v4', kind: 'Installation', date: '2026-10-12', days: 3, time: 'Arrive 08:00 – 09:00', who: ['Amir Khan', 'Joe Patel', 'Sam Price'], status: 'Done', what: 'Orangery roof fitted. You signed the handover on 14 Oct.', doc: 'd-complete', home: true },
  ],
  total: 4680, plan: '50% deposit · 50% when finished',
  invoices: [
    { ref: 'INV-3290', type: 'Deposit', pct: 50, amount: 2340, due: '2026-08-12', status: 'Paid', paidOn: '12 Aug', method: 'Card' },
    { ref: 'INV-3375', type: 'Final payment', pct: 50, amount: 2340, due: '2026-10-14', status: 'Paid', paidOn: '14 Oct', method: 'Bank transfer' },
  ],
  order: { ref: 'SO-48101', ordered: '21 Aug', supplier: 'Origin', expected: 'Fri 9 Oct', status: 'Delivered' },
  docs: [
    { id: 'd-quote', name: 'Your quote FP-55052', group: 'Quote and order', added: '04 Aug', pages: 3, about: 'Accepted 12 Aug', lines: [['Quote', 'FP-55052'], ['Made by', 'Emma Clarke'], ['Total', '£4,680 inc. VAT'], ['Accepted', '12 Aug 2026']] },
    { id: 'd-terms', name: 'Terms and conditions', group: 'Quote and order', added: '12 Aug', pages: 6, about: 'Agreed with your quote' },
    { id: 'd-order', name: 'Order confirmation', group: 'Quote and order', added: '21 Aug', pages: 1, about: 'Your roof is made to these sizes' },
    { id: 'd-survey', name: 'Survey report', group: 'Surveys and visits', added: '02 Aug', pages: 2, about: 'Emma Clarke · 2 Aug' },
    { id: 'd-final', name: 'Final survey report', group: 'Surveys and visits', added: '18 Aug', pages: 2, about: 'All sizes confirmed · signed by you' },
    { id: 'd-inv3290', name: 'Deposit receipt INV-3290', group: 'Payments', added: '12 Aug', pages: 1, about: '£2,340 paid by card' },
    { id: 'd-inv3375', name: 'Final payment receipt INV-3375', group: 'Payments', added: '14 Oct', pages: 1, about: '£2,340 paid by bank transfer · paid in full' },
    { id: 'd-ready', name: 'Getting ready for fitting day', group: 'Fitting', added: '09 Oct', pages: 2, about: 'What to do before the fitters arrive' },
    { id: 'd-complete', name: 'Completion certificate', group: 'Fitting', added: '14 Oct', pages: 2, about: 'Signed by you on 14 Oct', lines: [['Fitted by', 'Amir Khan, Joe Patel, Sam Price'], ['Finished', '14 Oct 2026'], ['Signed', 'A Khan'], ['To put right', '1 trim · fixed 13 Oct']] },
    { id: 'd-guarantee', name: '10-year guarantee', group: 'Guarantee and care', added: '14 Oct', pages: 4, about: 'Valid until 14 Oct 2036', lines: [['Covers', 'Frames, glass and fitting'], ['From', '14 Oct 2026'], ['Until', '14 Oct 2036'], ['Number', 'GU-10455']] },
    { id: 'd-fensa', name: 'FENSA certificate', group: 'Guarantee and care', added: '14 Oct', pages: 1, about: 'Registered with FENSA' },
    { id: 'd-care', name: 'Care guide', group: 'Guarantee and care', added: '14 Oct', pages: 6, about: 'Keep your roof like new' },
  ],
  msgs: [
    { id: 'm1', from: 'office', who: 'Sarah Mitchell', text: 'Your orangery roof is finished! Your 10-year guarantee, FENSA certificate and care guide are now in Documents. Thank you for choosing Jadeite.', when: '14 Oct, 17:45', read: true },
    { id: 'm2', from: 'me', who: 'Mr Khan', text: 'Very happy with the roof, thank you all.', when: '15 Oct, 09:12' },
    { id: 'm3', from: 'office', who: 'Sarah Mitchell', text: 'That is lovely to hear, Mr Khan. I have passed it on to Amir and the team.', when: '15 Oct, 09:30', read: true },
  ],
  issues: [
    { id: 'SN-116', kind: 'Snag', title: 'Trim colour did not match', detail: 'One trim was delivered in white, not grey.', item: 'Roof lantern', reported: '13 Oct', by: 'Amir Khan (fitter)', status: 'Fixed', fixedOn: '13 Oct', fixedBy: 'Amir Khan', photos: 2,
      log: [{ when: '13 Oct', text: 'Noted by Amir during fitting' }, { when: '13 Oct', text: 'Grey trim fitted the same day · 2 photos' }] },
  ],
  updates: [
    { when: '15 Oct', text: 'Thank you for your 5-star review', icon: 'message' },
    { when: '14 Oct', text: 'Paid in full · thank you', icon: 'pound' },
    { when: '14 Oct', text: 'Guarantee, FENSA certificate and care guide added', icon: 'shield' },
    { when: '14 Oct', text: 'Fitting finished · you signed the handover', icon: 'check' },
    { when: '12 Oct', text: 'Fitting started', icon: 'tool' },
  ],
  phase: 'done',
  review: { stars: 5, text: 'Amir and the team were tidy, polite and finished on time. The roof looks fantastic.', on: '15 Oct' },
};

export const SEED: Record<AcctId, Account> = { smith: SMITH, patel: PATEL, khan: KHAN };
export const ACCOUNTS: { id: AcctId; name: string; job: string; email: string; sub: string; photo: Pic }[] = [
  { id: 'smith', name: 'Sarah & David Smith', job: 'JG-10482', email: SMITH.email, sub: 'Before fitting · stage payment due', photo: 'house' },
  { id: 'patel', name: 'Mrs Patel', job: 'JG-10471', email: PATEL.email, sub: 'Fitted · confirm the repairs', photo: 'bifold' },
  { id: 'khan', name: 'Mr Khan', job: 'JG-10455', email: KHAN.email, sub: 'All done · guarantee and aftercare', photo: 'orangery' },
];

/* ---------- helpers ---------- */
export const gbp = (n: number) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
const D = (s: string) => new Date(s + 'T12:00:00');
export const addDays = (s: string, n: number) => { const d = D(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const fmt = (s: string, o: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) => (s ? D(s).toLocaleDateString('en-GB', o) : '');
export const fmtLong = (s: string) => fmt(s, { weekday: 'long', day: 'numeric', month: 'long' });
export const dayRange = (v: Visit) => (v.days && v.days > 1 ? `${fmt(v.date)} – ${fmt(addDays(v.date, v.days - 1))}` : fmt(v.date));
export const daysUntil = (s: string) => Math.round((D(s).getTime() - D(TODAY).getTime()) / 86400000);
export const nowStamp = () => { const t = new Date(); return `16 Oct, ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`; };
