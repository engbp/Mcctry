"use client";

import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle, ChevronDown, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BandHero } from "@/components/layout/BandHero";
import { Reveal } from "@/components/fx/Reveal";
import { submitJoinApplication, type JoinFormServerState } from "./actions";

const interestOptions = [
  "AI & Machine Learning",
  "Web Development",
  "Cloud & DevOps",
  "Cybersecurity",
  "Data Science",
  "Mobile Development",
  "Design & UX",
  "Open Source",
  "Entrepreneurship",
  "Research",
];

const benefits = [
  "Access to sessions and materials in tracks you join",
  "Updates about public events and workshops",
  "Opportunities to share student projects",
  "A community for learning across technology topics",
  "A clear recruitment process for club-wide team membership",
  "A way to discover official announcements and opportunities",
];

const faqs = [
  { q: "Do I need prior coding experience?", a: "No! MCC welcomes students at all levels. Our beginner tracks start from zero, and the community is happy to help you get started." },
  { q: "Is there a membership fee?", a: "Any eligibility, fee, or event-specific requirements will be stated in the relevant official announcement. This prototype does not collect payments." },
  { q: "How much time commitment is expected?", a: "As much or as little as you want. Attend events when you can, take courses at your own pace, contribute to projects when interested." },
  { q: "Can I join if I'm not in a tech major?", a: "Learning-track participation is separate from club-wide team membership. The club can publish the eligibility requirements for each recruitment cycle and activity." },
  { q: "What happens after I apply?", a: "Applications are reviewed during each announced recruitment cycle. Exact dates and next steps are published through official MCC MNU channels." },
];

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: [] as string[],
    customInterest: "",
    motivation: "",
    heardFrom: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [serverState, formAction, isPending] = useActionState<JoinFormServerState, FormData>(
    submitJoinApplication,
    { status: "idle" }
  );

  // Merge server-rejected field errors back into the visible form.
  const visibleErrors = { ...errors, ...(serverState.errors ?? {}) };
  const submitted = serverState.status === "success";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        interests: checked ? [...prev.interests, value] : prev.interests.filter((i) => i !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  if (submitted) {
    return (
      <>
        <BandHero
          crumbs={[{ label: "Join" }, { label: "Submitted" }]}
          kicker="CONNECT · COMPLETE"
          title="Application received"
          lede="Thanks for applying. Your application was submitted and stored securely in the club database for review by the MCC leadership team."
          color="#10b981"
          icon={<CheckCircle size={56} />}
        />
        <section className="section" aria-labelledby="success-title">
          <div className="container jn-success">
            <span className="jn-success-icon"><CheckCircle size={44} /></span>
            <h2 id="success-title">Application received</h2>
            <p>Applications are reviewed by the MCC leadership team during official recruitment cycles. Watch the official MCC MNU channels for next steps and announcements.</p>
            <div className="jn-success-actions">
              <Button variant="primary" asChild size="lg">
                <Link href="/">Back to home <ArrowRight size={17} /></Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/events">Explore events <ArrowUpRight size={17} /></Link>
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BandHero
        crumbs={[{ label: "Join" }]}
        kicker="CONNECT · RECRUITMENT"
        title="Join MCC MNU."
        lede="Team recruitment runs in formal cycles with announced opening and closing dates. Submit your application below and the MCC leadership team will review it during the next cycle."
        color="#00b7c3"
        meta={<span className="band-meta-pill"><UserPlus size={14} /> Formal recruitment cycles</span>}
        icon={<UserPlus size={56} />}
      />

      <section className="section" aria-labelledby="join-form-title">
        <div className="container jn-grid">
          <div className="jn-benefits">
            <Reveal className="lk-section-head">
              <div>
                <span className="hp-section-kicker">RECRUITMENT CYCLE PREVIEW</span>
                <h2 id="join-form-title" className="hp-section-title">Get ready for the next cycle.</h2>
              </div>
            </Reveal>
            <p className="jn-benefits-lede">
              Team recruitment is managed in defined application cycles. Track enrollment is separate: verified students can join multiple tracks and access their sessions and materials immediately.
            </p>

            <h3 className="jn-benefits-title"><Sparkles size={17} /> What you get</h3>
            <ul className="jn-benefit-list">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <CheckCircle size={18} aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="jn-form-card">
            <form action={formAction} noValidate>
              {/* Honeypot: hidden from real users, tempting to bots. */}
              <div className="jn-hp" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {/* end honeypot */}
              <div className="jn-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={visibleErrors.name ? "is-invalid" : ""}
                  aria-invalid={visibleErrors.name ? "true" : "false"}
                  aria-describedby={visibleErrors.name ? "name-error" : undefined}
                />
                {visibleErrors.name && <p id="name-error" className="jn-error">{visibleErrors.name}</p>}
              </div>

              <div className="jn-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={visibleErrors.email ? "is-invalid" : ""}
                  aria-invalid={visibleErrors.email ? "true" : "false"}
                  aria-describedby={visibleErrors.email ? "email-error" : undefined}
                />
                {visibleErrors.email && <p id="email-error" className="jn-error">{visibleErrors.email}</p>}
              </div>

              <div className="jn-field">
                <label htmlFor="heardFrom">How did you hear about MCC?</label>
                <select id="heardFrom" name="heardFrom" value={formData.heardFrom} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="social">Social Media (Instagram, Facebook, LinkedIn)</option>
                  <option value="friend">Friend or Classmate</option>
                  <option value="event">MCC Event or Workshop</option>
                  <option value="faculty">Faculty Recommendation</option>
                  <option value="website">MCC Website</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <fieldset className="jn-field">
                <legend>What interests you? <span>Select all that apply</span></legend>
                <div className="jn-interest-grid">
                  {interestOptions.map((interest) => (
                    <label key={interest} className={`jn-interest ${formData.interests.includes(interest) ? "is-checked" : ""}`}>
                      <input
                        type="checkbox"
                        name="interests"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleChange}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
                <input
                  name="customInterest"
                  type="text"
                  value={formData.customInterest}
                  onChange={handleChange}
                  placeholder="Or add your own interest…"
                  className={visibleErrors.interests ? "is-invalid" : ""}
                  style={{ marginTop: "12px" }}
                />
                {visibleErrors.interests && <p className="jn-error">{visibleErrors.interests}</p>}
              </fieldset>

              <div className="jn-field">
                <label htmlFor="motivation">Why do you want to join MCC?</label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us what you want to learn, build, or achieve with MCC…"
                />
              </div>

              <Button variant="primary" type="submit" size="lg" style={{ width: "100%" }} disabled={isPending}>
                {isPending ? "Submitting…" : <>Submit application <ArrowRight size={17} /></>}
              </Button>

              {serverState.status === "error" && serverState.message && (
                <p className="jn-error" role="alert">{serverState.message}</p>
              )}

              <p className="jn-demo-note">
                <strong>What happens next:</strong> Your application is stored securely and reviewed by the MCC leadership team during official recruitment cycles. Keep an eye on official MCC MNU channels for announcements.
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="faq-title">
        <div className="container" style={{ maxWidth: "860px" }}>
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">FAQ</span>
              <h2 id="faq-title" className="hp-section-title">Common questions.</h2>
            </div>
          </Reveal>
          <Reveal className="jn-faq">
            {faqs.map((faq) => (
              <details key={faq.q} className="jn-faq-item">
                <summary>
                  {faq.q}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
