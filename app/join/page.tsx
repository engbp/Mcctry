"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink } from "@/components/ui/Links";
import { ArrowRight, CheckCircle, Mail, User, MessageSquare, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

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
    console.log("Join application submitted:", formData);
  };

  if (submitted) {
    return (
      <>
        <PageHero
          label="Join"
          title="Application Submitted"
          lede="Thanks for your interest in MCC MNU! We've received your application and will be in touch soon."
          badge="SUCCESS"
          badgeVariant="featured"
          kicker="01 / COMPLETE"
        />

        <section className="section" aria-labelledby="success-title">
          <div className="container" style={{ textAlign: "center", maxWidth: "600px" }}>
            <div style={{ fontSize: "64px", color: "var(--mcc-accent-green)", marginBottom: "24px" }}>
              <CheckCircle size={64} />
            </div>
            <h2 id="success-title" className="display-md" style={{ marginBottom: "16px" }}>Welcome to MCC MNU!</h2>
            <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginBottom: "32px" }}>Your application has been received. In a production environment, this would trigger a review process and you'd hear back within a few days.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Button variant="primary" asChild>
                <Link href="/">Back to Home <ArrowRight size={16} /></Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/events">Explore Events <ArrowRight size={16} /></Link>
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        label="Join"
        title="Join MCC MNU."
        lede="A presentation-only recruitment flow. Nothing is submitted or stored in this frontend prototype. Demo content is clearly marked."
        badge="APPLY NOW"
        badgeVariant="demo"
        kicker="01 / RECRUITMENT"
      />

      <section className="section" aria-labelledby="join-form-title">
        <div className="container">
          <div className="grid-2-uneven" style={{ gap: "48px", alignItems: "start" }}>
            <div>
              <SectionHeader number="01" label="APPLY TO MCC" title="Start your journey with us." />
              <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginTop: "16px", marginBottom: "24px" }}>MCC MNU is open to all Mansoura National University students. No technical background required — just curiosity and willingness to learn.</p>

              <div className="benefits" style={{ marginTop: "32px" }}>
                <h3 style={{ marginBottom: "16px" }}>What you get</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    "Access to all learning tracks and courses",
                    "Invitations to workshops, build nights, and hackathons",
                    "Project showcase opportunities",
                    "Microsoft Learn credits and certifications",
                    "Mentorship from industry professionals",
                    "Community of like-minded builders",
                  ].map((benefit) => (
                    <li key={benefit} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <CheckCircle size={18} style={{ color: "var(--mcc-accent-green)", flexShrink: 0, marginTop: "2px" }} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Card variant="default" className="join-form-card" style={{ position: "sticky", top: "90px", padding: "32px" }}>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="name" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="form-input"
                    style={{ width: "100%", padding: "12px 16px", border: `1px solid ${errors.name ? "var(--mcc-accent-red)" : "var(--mcc-line)"}`, borderRadius: "var(--radius-sm)", fontSize: "14px", background: "var(--mcc-white)", outline: "none" }}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" style={{ color: "var(--mcc-accent-red)", fontSize: "13px", marginTop: "6px" }}>{errors.name}</p>}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="email" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="form-input"
                    style={{ width: "100%", padding: "12px 16px", border: `1px solid ${errors.email ? "var(--mcc-accent-red)" : "var(--mcc-line)"}`, borderRadius: "var(--radius-sm)", fontSize: "14px", background: "var(--mcc-white)", outline: "none" }}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" style={{ color: "var(--mcc-accent-red)", fontSize: "13px", marginTop: "6px" }}>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="heardFrom" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>How did you hear about MCC?</label>
                  <select
                    id="heardFrom"
                    name="heardFrom"
                    value={formData.heardFrom}
                    onChange={handleChange}
                    className="form-input"
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--mcc-line)", borderRadius: "var(--radius-sm)", fontSize: "14px", background: "var(--mcc-white)", outline: "none" }}
                  >
                    <option value="">Select an option</option>
                    <option value="social">Social Media (Instagram, Facebook, LinkedIn)</option>
                    <option value="friend">Friend or Classmate</option>
                    <option value="event">MCC Event or Workshop</option>
                    <option value="faculty">Faculty Recommendation</option>
                    <option value="website">MCC Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <fieldset style={{ marginBottom: "20px", border: "none", padding: 0 }}>
                  <legend style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>What interests you? <span style={{ fontWeight: 400, color: "var(--mcc-text-light)", fontSize: "13px" }}>Select all that apply</span></legend>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {interestOptions.map((interest) => (
                      <label key={interest} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", border: `1px solid ${formData.interests.includes(interest) ? "var(--mcc-blue)" : "var(--mcc-line)"}`, background: formData.interests.includes(interest) ? "#f0f8fc" : "var(--mcc-white)", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "all var(--transition-fast)" }}>
                        <input
                          type="checkbox"
                          name="interests"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleChange}
                          style={{ width: "16px", height: "16px", accentColor: "var(--mcc-blue)" }}
                        />
                        <span style={{ fontSize: "13px" }}>{interest}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <input
                      name="customInterest"
                      type="text"
                      value={formData.customInterest}
                      onChange={handleChange}
                      placeholder="Or add your own interest..."
                      className="form-input"
                      style={{ width: "100%", padding: "12px 16px", border: `1px solid ${errors.interests ? "var(--mcc-accent-red)" : "var(--mcc-line)"}`, borderRadius: "var(--radius-sm)", fontSize: "14px", background: "var(--mcc-white)", outline: "none" }}
                    />
                    {errors.interests && <p style={{ color: "var(--mcc-accent-red)", fontSize: "13px", marginTop: "6px" }}>{errors.interests}</p>}
                  </div>
                </fieldset>

                <div style={{ marginBottom: "24px" }}>
                  <label htmlFor="motivation" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Why do you want to join MCC?</label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us what you want to learn, build, or achieve with MCC..."
                    className="form-input"
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--mcc-line)", borderRadius: "var(--radius-sm)", fontSize: "14px", fontFamily: "inherit", background: "var(--mcc-white)", outline: "none", resize: "vertical" }}
                  />
                </div>

                <Button variant="primary" type="submit" style={{ width: "100%", marginBottom: "16px" }}>
                  Submit Application <ArrowRight size={18} />
                </Button>

                <div className="notice" style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "var(--radius-sm)", padding: "12px 16px", fontSize: "13px", color: "#5d4a00" }}>
                  <strong>Demo Mode:</strong> This form has no submission backend. In production, applications would be reviewed by the MCC leadership team.
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="faq-title">
        <div className="container" style={{ maxWidth: "800px" }}>
          <SectionHeader number="02" label="FAQ" title="Common questions." />
          <div className="faq" style={{ marginTop: "24px" }}>
            {[
              { q: "Do I need prior coding experience?", a: "No! MCC welcomes students at all levels. Our beginner tracks start from zero, and the community is happy to help you get started." },
              { q: "Is there a membership fee?", a: "No. MCC MNU is free for all Mansoura National University students. Some external events or certifications may have costs, but MCC activities are free." },
              { q: "How much time commitment is expected?", a: "As much or as little as you want. Attend events when you can, take courses at your own pace, contribute to projects when interested." },
              { q: "Can I join if I'm not in a tech major?", a: "Absolutely. Some of our best members come from business, design, engineering, medicine, and arts backgrounds. Diverse perspectives make better projects." },
              { q: "What happens after I apply?", a: "In production, applications are reviewed weekly. You'll receive an email with next steps, including orientation sessions and access to the community platforms." },
            ].map((faq, i) => (
              <details key={i} className="faq-item" style={{ borderBottom: "1px solid var(--mcc-line)", padding: "20px 0" }}>
                <summary style={{ fontSize: "16px", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q}
                  <ChevronRight size={18} style={{ color: "var(--mcc-blue)", transition: "transform var(--transition-fast)" }} />
                </summary>
                <p className="body" style={{ color: "var(--mcc-text-muted)", marginTop: "12px", paddingRight: "24px" }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}