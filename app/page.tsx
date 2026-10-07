import Link from "next/link";
import {ArrowRight,ChevronRight,CalendarDays,Code2,BookOpen,Users} from "lucide-react";

const learning=[
 {title:"Applied AI Foundations",track:"AI & Data",meta:"8 lessons · 2h 40m · Beginner"},
 {title:"Modern Web Builder",track:"Software Development",meta:"10 lessons · 3h 15m · Intermediate"},
 {title:"Cloud Concepts, Clearly",track:"Cloud",meta:"7 lessons · 2h 05m · Beginner"}
];
const paths=[
 ["AI & Data","Explore practical AI concepts and experiments.","8 courses","2h 40m"],
 ["Software Development","Build interfaces, products, and useful tools.","12 courses","6h 10m"],
 ["Cloud","Understand modern infrastructure and cloud systems.","6 courses","3h 25m"],
 ["Cybersecurity","Learn foundations of secure digital systems.","7 courses","4h 05m"]
];
const events=[["18","Oct","Build Night: From idea to prototype","MNU · Demo event"],["02","Nov","AI Builders Meetup","MNU · Demo event"],["16","Nov","Git & Open Source Night","MNU · Demo event"]];
const opportunities=[["Campus AI Challenge","Hackathon","Oct 24"],["Student Cloud Sprint","Competition","Nov 02"],["Open Source Starter Week","Community","Nov 16"]];

function Arrow(){return <ArrowRight className="arrow" size={16}/>}

export default function Home(){
 return <>
  <section className="home-hero">
   <div className="hero-copy">
    <span className="eyebrow blue">MCC MNU</span>
    <h1>Learn. Build. Connect.</h1>
    <p>A student technology community at Mansoura National University for people who want to learn useful skills, build real projects, and meet others who are building too.</p>
    <div className="hero-actions"><Link className="primary" href="/courses">Explore learning <Arrow/></Link><Link className="secondary" href="/join">Join MCC <Arrow/></Link></div>
   </div>
   <div className="hero-media" aria-label="MCC technical project visual">
    <div className="hero-visual">
      <div className="hero-visual-top"><span className="hero-dot"/><span className="hero-dot"/><span className="hero-dot"/><span style={{marginLeft:"auto",fontSize:12,color:"#666"}}>MCC project workspace</span></div>
      <div className="hero-visual-body">
       <div className="hero-visual-code"><b>const</b> community = {"{"}<br/>{"  "}learn: <em>true</em>,<br/>{"  "}build: <em>true</em>,<br/>{"  "}connect: <em>true</em><br/>{"}"};<br/><br/>ship(idea);<br/>learn(from: work);</div>
       <div className="hero-visual-project"><span className="eyebrow" style={{color:"#fff"}}>Student technology</span><h3>From idea to working prototype.</h3><p>Projects, learning and community in one place.</p></div>
      </div>
    </div>
   </div>
  </section>

  <section className="intro"><div className="container">
   <div className="editorial-grid"><h2>A community for students who want to build what's next.</h2><p>MCC brings learning, projects, events and opportunities into one clear experience. Start with a course, explore what other students are building, or find a reason to get involved.</p></div>
   <div className="value-row">
    <div className="value-item"><span className="value-number">01</span><h3>Learn</h3><p>Short, practical learning experiences organized into clear paths.</p></div>
    <div className="value-item"><span className="value-number">02</span><h3>Build</h3><p>See projects, experiments and technical work created by students.</p></div>
    <div className="value-item"><span className="value-number">03</span><h3>Connect</h3><p>Find events, opportunities and people with similar interests.</p></div>
   </div>
  </div></section>

  <section className="section alt"><div className="container">
   <div className="section-head"><div><span className="eyebrow blue">Featured learning</span><h2>Learn something new.</h2></div><Link className="text-link" href="/courses">Browse all learning <Arrow/></Link></div>
   <div className="feature-learning">
    <div className="feature-learning-media"><div><span className="eyebrow" style={{color:"#9edcff"}}>AI & Data · Demo course</span><h3>Applied AI Foundations</h3></div></div>
    <div className="feature-learning-copy"><span className="eyebrow blue">Featured course</span><h3>Understand modern AI without the noise.</h3><p>Learn the mental models behind AI, experiment with practical tools, and understand how to evaluate what you build.</p><Link className="text-link" href="/courses/applied-ai-foundations">View course <Arrow/></Link></div>
   </div>
   <div className="learning-links">{learning.slice(1).map(c=><Link className="learning-link" href="/courses/applied-ai-foundations" key={c.title}><span className="eyebrow blue">{c.track}</span><h3>{c.title}</h3><p>{c.meta}</p><span className="text-link">Learn more <Arrow/></span></Link>)}<Link className="learning-link" href="/courses"><span className="eyebrow blue">All courses</span><h3>Find your next course</h3><p>Browse the full learning catalogue.</p><span className="text-link">Browse courses <Arrow/></span></Link></div>
  </div></section>

  <section className="section"><div className="container">
   <div className="section-head"><div><span className="eyebrow blue">Learning paths</span><h2>Explore learning paths.</h2></div><Link className="text-link" href="/tracks">View all tracks <Arrow/></Link></div>
   <div className="path-list">{paths.map((p,i)=><Link className="path-row" href="/tracks/ai-data" key={p[0]}><span className="path-icon">{i===0?<BookOpen size={19}/>:i===1?<Code2 size={19}/>:i===2?<span style={{fontWeight:700}}>☁</span>:<Users size={19}/>}</span><div><h3>{p[0]}</h3><p>{p[1]}</p></div><div className="path-meta">{p[2]}<br/>{p[3]}</div><ChevronRight className="arrow" size={18}/></Link>)}</div>
  </div></section>

  <section className="section alt"><div className="container">
   <div className="section-head"><div><span className="eyebrow blue">Student projects</span><h2>Build something real.</h2></div><Link className="text-link" href="/projects">Explore projects <Arrow/></Link></div>
   <div className="feature-project"><div className="project-media" aria-label="Project visual"/><div className="project-copy"><span className="eyebrow" style={{color:"#8fd8ff"}}>Featured project · Demo content</span><h3>VisionLab</h3><p>A presentation project exploring computer vision experiments and practical AI workflows.</p><div className="tech-list"><span className="tech">Python</span><span className="tech">OpenCV</span><span className="tech">AI</span></div><Link className="text-link" style={{color:"#8fd8ff"}} href="/projects/visionlab">View project <Arrow/></Link></div></div>
   <div className="project-links"><Link className="project-link" href="/projects/campusos"><span className="eyebrow blue">Demo project</span><h3>CampusOS <Arrow/></h3><p>A student-focused digital community concept.</p></Link><Link className="project-link" href="/projects/medtech-monitor"><span className="eyebrow blue">Demo project</span><h3>MedTech Monitor <Arrow/></h3><p>A prototype for visualizing biomedical signals.</p></Link></div>
  </div></section>

  <section className="section"><div className="container">
   <div className="section-head"><div><span className="eyebrow blue">Events</span><h2>What's happening at MCC.</h2></div><Link className="text-link" href="/events">View all events <Arrow/></Link></div>
   <div className="event-feature"><div className="event-date"><strong>18</strong><span>October</span></div><div className="event-copy"><span className="eyebrow" style={{color:"#fff"}}>Upcoming · Demo event</span><h3>Build Night: From idea to prototype</h3><p>Bring an idea, meet other builders, and leave with a clearer next step.</p></div><div className="event-cta"><Link className="secondary" href="/events/build-night">View event <Arrow/></Link></div></div>
   <div className="event-list">{events.slice(1).map(e=><Link className="event-row" href="/events/build-night" key={e[2]}><time>{e[0]} {e[1]}</time><div><h3>{e[2]}</h3><p>{e[3]}</p></div><span className="event-type">Demo event</span><Arrow/></Link>)}</div>
  </div></section>

  <section className="section alt"><div className="container">
   <div className="section-head"><div><span className="eyebrow blue">Opportunities</span><h2>Find your next opportunity.</h2></div><Link className="text-link" href="/opportunities">Explore opportunities <Arrow/></Link></div>
   <div className="opportunity-list">{opportunities.map(o=><Link className="op-row" href="/opportunities" key={o[0]}><strong>{o[0]}</strong><span>{o[1]}</span><span>{o[2]}</span><span className="arrow-cell"><Arrow/></span></Link>)}</div>
  </div></section>

  <section className="cta"><div className="container cta-inner"><div><h2>Ready to get involved?</h2><p>Join MCC MNU and find a place to learn, build and connect.</p></div><Link className="secondary" href="/join">Join MCC MNU <Arrow/></Link></div></section>

  <footer className="site-footer"><div className="container footer-grid">
   <div><div className="footer-brand">MCC MNU</div><p className="muted" style={{fontSize:13,lineHeight:1.6,maxWidth:270}}>A Microsoft-inspired student technology community experience for Mansoura National University.</p></div>
   <div><h3>Learning</h3><Link href="/courses">Courses</Link><Link href="/tracks">Tracks</Link><Link href="/resources">Resources</Link></div>
   <div><h3>Community</h3><Link href="/events">Events</Link><Link href="/projects">Projects</Link><Link href="/opportunities">Opportunities</Link></div>
   <div><h3>About</h3><Link href="/about">About MCC</Link><Link href="/join">Join MCC</Link><Link href="/demo/dashboard">Demo experience</Link></div>
   <div><h3>Connect</h3><Link href="/join">Get involved</Link><Link href="/resources">Useful links</Link><Link href="/about">More about MCC</Link></div>
  </div><div className="container footer-bottom"><span>© MCC MNU · Presentation prototype</span><span>Demo content is clearly marked where applicable.</span></div></footer>
 </>
}
