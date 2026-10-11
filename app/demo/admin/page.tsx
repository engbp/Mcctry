import Link from "next/link";
import { ArrowUpRight, Users, BookOpen, CalendarDays, Trophy, Megaphone, ChartNoAxesCombined, ShieldCheck, ClipboardCheck, Settings2 } from "lucide-react";

const modules = [
  { icon: Users, title: "People & roles", detail: "Verify student accounts, review recruitment applicants, promote members, manage assignments, and appoint leaders.", state: "Admin managed" },
  { icon: BookOpen, title: "Tracks & learning", detail: "Create tracks, manage sessions and materials, review submissions, and scope leader permissions.", state: "Scoped access" },
  { icon: CalendarDays, title: "Events & attendance", detail: "Configure registration mode and capacity, manage waitlists, track attendance, and audit manual corrections.", state: "Configurable" },
  { icon: Trophy, title: "Points & achievements", detail: "Configure automatic awards, verify routine activities, limit discretionary bonuses, and preserve correction history.", state: "Audited points" },
  { icon: Megaphone, title: "Communications", detail: "Draft, edit, schedule, and publish announcements to the club or assigned tracks.", state: "Scheduled publishing" },
  { icon: ChartNoAxesCombined, title: "Reports", detail: "Review membership, attendance, track activity, assignments, points, and engagement.", state: "Operational reports" },
];

const queue = [
  { label: "Recruitment decisions", detail: "Admins make the final selection and promotion decision.", icon: ClipboardCheck },
  { label: "Team leadership", detail: "Members nominate replacements; admins approve appointments.", icon: ShieldCheck },
  { label: "Platform configuration", detail: "Manage permissions, point rules, event capacity, and publishing.", icon: Settings2 },
];

export default function AdminPreviewPage() {
  return (
    <div className="mcc-admin-preview">
      <header className="mcc-admin-top"><Link href="/" className="mcc-admin-brand">MCC <span>MNU</span> <small>ADMIN WORKSPACE</small></Link><span className="mcc-admin-demo">DEMO PREVIEW · NO LIVE DATA</span></header>
      <div className="mcc-admin-layout">
        <aside className="mcc-admin-sidebar"><span className="mcc-admin-side-label">WORKSPACE</span><a className="is-current" href="#overview">Overview</a><a href="#modules">Platform modules</a><a href="#governance">Governance rules</a><Link href="/teams">Public team page ↗</Link><Link href="/news">Public news ↗</Link><div className="mcc-admin-side-note">Role-scoped access<br />Audit history<br />Admin oversight</div></aside>
        <main className="mcc-admin-main" id="overview">
          <div className="mcc-admin-heading"><div><span className="mcc-section-label">MCC MNU / CONTROL ROOM</span><h1>Club operations,<br /> <em>in one place.</em></h1><p>This is a visual preview of the planned admin workspace. Actions shown here are not connected to a database and do not change real club records.</p></div><span className="mcc-admin-status"><i /> Preview workspace</span></div>
          <div className="mcc-admin-kpis"><div><span>Account model</span><strong>University-verified</strong><small>Student access is separate from team membership</small></div><div><span>Team authority</span><strong>Admin controlled</strong><small>Leaders operate only within assigned scope</small></div><div><span>Records</span><strong>Auditable</strong><small>Points and manual corrections require history</small></div></div>
          <section id="modules" className="mcc-admin-section"><div className="mcc-admin-section-heading"><div><span className="mcc-section-label">01 / ADMIN MODULES</span><h2>Everything the club runs.</h2></div><span>6 MODULES</span></div><div className="mcc-admin-module-grid">{modules.map((module,index)=>{const Icon=module.icon;return <article className="mcc-admin-module" key={module.title}><div className="mcc-admin-module-top"><span className="mcc-admin-module-icon"><Icon size={20}/></span><span>0{index+1}</span></div><h3>{module.title}</h3><p>{module.detail}</p><small>{module.state}</small></article>;})}</div></section>
          <section id="governance" className="mcc-admin-section"><div className="mcc-admin-section-heading"><div><span className="mcc-section-label">02 / GOVERNANCE</span><h2>Clear rules, visible history.</h2></div></div><div className="mcc-admin-queue">{queue.map((item)=>{const Icon=item.icon;return <article key={item.label}><Icon size={20}/><div><strong>{item.label}</strong><p>{item.detail}</p></div><ArrowUpRight size={17}/></article>;})}</div></section>
          <div className="mcc-admin-footnote"><ShieldCheck size={18}/><p><strong>Production boundary</strong><br/>Authentication, database persistence, email delivery, role enforcement, and audit storage are not implemented by this visual preview. They must be enforced server-side before real student data or administrative actions are enabled.</p></div>
        </main>
      </div>
    </div>
  );
}
