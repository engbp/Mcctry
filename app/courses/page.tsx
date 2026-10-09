import Link from "next/link";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { CourseCatalog } from "@/components/learning/CourseCatalog";
import { coursesData, tracksData } from "@/lib/data";

export default function CoursesPage() {
  return (
    <>
      <BandHero
        crumbs={[{ label: "Courses" }]}
        kicker="LEARN · CATALOGUE"
        title="Learn with MCC MNU."
        lede="Focused courses and short lessons designed to help you learn at your own pace — all organised into structured learning tracks."
        meta={
          <>
            <span className="band-meta-pill"><BookOpen size={14} /> {coursesData.length} courses</span>
            <span className="band-meta-pill"><Layers size={14} /> {tracksData.length} tracks</span>
          </>
        }
        icon={<BookOpen size={56} />}
      />

      <section className="section" aria-labelledby="catalogue-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">CATALOGUE</span>
              <h2 id="catalogue-title" className="hp-section-title">Find your next course.</h2>
            </div>
          </div>
          <CourseCatalog />
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="tracks-cta-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>LEARNING PATHS</span>
            <h2 id="tracks-cta-title" className="hp-section-title" style={{ color: "#fff" }}>Prefer a guided journey?</h2>
            <p>Courses are organised into tracks — complete paths that take you from fundamentals to applied projects.</p>
          </div>
          <Link href="/tracks" className="lk-cta-btn">
            Explore tracks <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
