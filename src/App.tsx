import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Device } from './ui/kit';
import { useStore } from './data/store';
import { Login, Code, Locked, Invite, Welcome } from './pages/Auth';
import Home from './pages/Home';
import Dates, { Prepare } from './pages/Dates';
import { Order, Payments } from './pages/Money';
import Documents, { DocView } from './pages/Documents';
import Messages from './pages/Messages';
import Help, { Report, Request, SignOff } from './pages/Help';
import More, { Details, Contact, Security, Notifications } from './pages/More';

// My Jadeite — the customer's phone app (375 × 812). Same customers and jobs as the Customer portal and the Office Admin.
const OPEN = ['/login', '/code', '/locked', '/invite'];
function Guard({ children }: { children: React.ReactElement }) {
  const loc = useLocation();
  const { st } = useStore();
  if (OPEN.includes(loc.pathname)) return children;
  if (!st.me) return <Navigate to="/login" replace />;
  if (!st.data[st.me].onboarded && !loc.pathname.startsWith('/welcome')) return <Navigate to="/welcome/1" replace />;
  return children;
}

export default function App() {
  return (
    <Device>
      <Guard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/code" element={<Code />} />
          <Route path="/locked" element={<Locked />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/welcome/:step" element={<Welcome />} />
          <Route path="/" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dates" element={<Dates />} />
          <Route path="/dates/prepare" element={<Prepare />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocView />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help/report" element={<Report />} />
          <Route path="/help/:id" element={<Request />} />
          <Route path="/sign-off" element={<SignOff />} />
          <Route path="/more" element={<More />} />
          <Route path="/more/details" element={<Details />} />
          <Route path="/more/contact" element={<Contact />} />
          <Route path="/more/security" element={<Security />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Guard>
    </Device>
  );
}
