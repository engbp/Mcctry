"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle, ChevronDown, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BandHero } from "@/components/layout/BandHero";

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
  "Access to all learning tracks and courses",
  "Invitations to workshops, build nights, and hackathons",
  "Project showcase opportunities",
  "Microsoft Learn credits and certifications",
  "Mentorship from industry professionals",
  "Community of like-minded builders",
];

const faqs = [
  { q: "Do I need prior coding experience?", a: "No! MCC welcomes students at all levels. Our beginner tracks start from zero, and the community is happy to help you get started." },
  { q: "Is there a membership fee?", a: "No. MCC MNU is free for all Mansoura National University students. Some external events or certifications may have costs, but MCC activities are free." },
  { q: "How much time commitment is expected?", a: "As much or as little as you want. Attend events when you can, take courses at your own pace, contribute to projects when interested." },
  { q: "Can I join if I'm not in a tech major?", a: "Absolutely. Some of our best members come from business, design, engineering, medicine, and arts backgrounds. Diverse perspectives make better projects." },
  { q: "What happens after I apply?", a: "In production, applications are reviewed weekly. You'll receive an email with next steps, including orientation sessions and access to the community platforms." },
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
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (formData.interests.length === 0 && !formData.customInterest.trim()) newErrors.interests = "Select at least one interest or add your own";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <BandHero
          crumbs={[{ label: "Join" }, { label: "Submitted" }]}
          kicker="CONNECT · COMPLETE"
          title="Application submitted!"
          lede="Thanks for your interest in MCC MNU — we've received your application and will be in touch soon."
          color="#10b981"
          icon={<CheckCircle size={56} />}
        />
        <section className="section" aria-labelledby="success-title">
          <div className="container jn-success">
            <span className="jn-success-icon"><CheckCircle size={44} /></span>
            <h2 id="success-title">Welcome to MCC MNU!</h2>
            <p>Your application has been received. In a production environment, this would trigger a review process and you&apos;d hear back within a few days.</p>
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
        lede="Open to all Mansoura National University students. No technical background required — just curiosity and a willingness to learn. This is a presentation-only flow; nothing is stored."
        color="#00b7c3"
        meta={<span className="band-meta-pill"><UserPlus size={14} /> Applications open</span>}
        icon={<UserPlus size={56} />}
      />

      <section className="section" aria-labelledby="join-form-title">
        <div className="container jn-grid">
          <div className="jn-benefits">
            <div className="lk-section-head">
              <div>
                <span className="hp-section-kicker">APPLY TO MCC</span>
                <h2 id="join-form-title" className="hp-section-title">Start your journey with us.</h2>
              </div>
            </div>
            <p className="jn-benefits-lede">
              MCC MNU is open to all Mansoura National University students. Members get access to
              everything the club offers from day one.
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

          <div className="jn-form-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="jn-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={errors.name ? "is-invalid" : ""}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <p id="name-error" className="jn-error">{errors.name}</p>}
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
                  className={errors.email ? "is-invalid" : ""}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <p id="email-error" className="jn-error">{errors.email}</p>}
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
                  className={errors.interests ? "is-invalid" : ""}
                  style={{ marginTop: "12px" }}
                />
                {errors.interests && <p className="jn-error">{errors.interests}</p>}
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

              <Button variant="primary" type="submit" size="lg" style={{ width: "100%" }}>
                Submit application <ArrowRight size={17} />
              </Button>

              <p className="jn-demo-note">
                <strong>Demo mode:</strong> This form has no submission backend. In production, applications would be reviewed by the MCC leadership team.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="faq-title">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">FAQ</span>
              <h2 id="faq-title" className="hp-section-title">Common questions.</h2>
            </div>
          </div>
          <div className="jn-faq">
            {faqs.map((faq) => (
              <details key={faq.q} className="jn-faq-item">
                <summary>
                  {faq.q}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
