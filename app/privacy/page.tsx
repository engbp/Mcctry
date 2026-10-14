import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return <main className="mcc-v2-legal">
    <Link href="/" className="mcc-v2-legal-back"><ArrowLeft size={16} /> Back home</Link>
    <div className="mcc-v2-legal-icon"><ShieldCheck size={26} /></div>
    <p className="mcc-v2-overline">MCC MNU · PRIVACY</p>
    <h1>Privacy policy</h1>
    <p className="mcc-v2-legal-updated">Last updated: 14 October 2026</p>
    <p className="mcc-v2-legal-lede">This policy describes how the Microsoft Campus Club at Mansoura National University learning website handles information when you browse, create an account, or send feedback.</p>
    <section><h2>Information we collect</h2><p>If you create an account, the platform uses your email address, profile name, authentication records, and lesson-completion progress to provide account features. This website does not currently accept new club membership applications. Previously submitted application records, if any, may remain in the database until they are removed under the club’s retention practices.</p><p>Learning reviews and offline-session feedback are designed to be anonymous. Do not include personal information in those messages if you want to remain anonymous.</p></section>
    <section><h2>How information is used</h2><p>Account and progress data are used to manage access, remember learning progress, and help administrators maintain learning content. Feedback is used to improve courses and learning sessions.</p></section>
    <section><h2>Data storage and access</h2><p>Application and learning data are stored in the platform database. Authentication is handled by the connected authentication provider. Access controls restrict private account information and administrative records to authorized roles. Anonymous feedback forms do not ask you to sign in or store an account identifier.</p></section>
    <section><h2>Retention and deletion</h2><p>Records may be retained while needed to operate the learning platform, maintain security, or meet applicable obligations. Any legacy application records are subject to the club’s data-retention practices. For a request to access, correct, or delete personal account or application data, contact the MCC MNU team through its official channels.</p></section>
    <section><h2>Third-party links</h2><p>Course resources and social links can lead to external services with their own privacy policies. Review those policies before sharing information with those services.</p></section>
    <section><h2>Changes to this policy</h2><p>This policy may be updated as the website’s features change. The updated date at the top indicates the latest published revision.</p></section>
    <p className="mcc-v2-legal-note">This is a platform privacy notice, not legal advice. Confirm contact details and retention practices with the club before treating it as the final official policy.</p>
  </main>;
}
