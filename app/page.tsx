import Link from "next/link";
import {ArrowRight,ChevronRight,CalendarDays,BookOpen,Code2,Cloud,ShieldCheck,Search,Users} from "lucide-react";

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

function Arrow(){return <ArrowRight className="arrow" size={17}/>}

function CampaignVisual(){
 return <div className="campaign-visual" aria-label="MCC students and technology campaign visual">
   <div className="campaign-photo">
     <div className="photo-frame photo-frame-main">
       <div className="student-silhouette student-one"><span/></div>
       <div className="laptop-shape"/>
       <div className="screen-shape"><div/><div/><div/></div>
     </div>
     <div className="photo-frame photo-frame-small">
       <div className="project-device"><span className="device-screen"/><span className="device-base"/></div>
     </div>
   </div>
   <div className="campaign-blue-block"><span>MCC MNU</span><strong>Learn<br/>Build<br/>Connect</strong></div>
   <div className="campaign-label"><span>Student technology</span><strong>Ideas into working projects.</strong></div>
 </div>
}

export default function Home(){
 return <>
  <section className="home-campaign">
   <div className="campaign-copy">
    <span className="eyebrow blue">MCC MNU</span>
    <h1>Build what comes next.</h1>
    <p>Learn technology, build real projects, and connect with students at Mansoura National University.</p>
    <div className="campaign-actions"><Link className="primary" href="/courses">Explore learning <Arrow/></Link><Link className="text-link campaign-secondary" href="/join">Join MCC <Arrow/></Link></div>
   </div>
   <CampaignVisual/>
  </section>

  <section className="editorial-section"><div className="container editorial-feature">
    <div><span className="eyebrow blue">About MCC MNU</span><h2>A community built for students who want to create.</h2></div>
    <div className="editorial-copy"><p>MCC brings learning, projects, events and opportunities into one clear experience for students who want to turn curiosity into useful work.</p><Link className="text-link" href="/about">Learn more about MCC <Arrow/></Link></div>
  </div></section>

  <section className="media-feature-section"><div className="container">
   <div className="section-heading-row"><div><span className="eyebrow blue">Featured learning</span><h2>Learn something new.</h2></div><Link className="text-link" href="/courses">Explore all courses <Arrow/></Link></div>
   <div className="learning-feature">
    <div className="learning-art"><div className="learning-art-grid"/><div className="learning-art-window"><span>AI &amp; Data</span><strong>Applied AI<br/>Foundations</strong><small>8 lessons · 2h 40m</small></div></div>
    <div className="learning-feature-copy"><span className="eyebrow blue">Featured course</span><h3>Understand modern AI without the noise.</h3><p>Build practical mental models, experiment with useful tools, and learn how to evaluate what you build.</p><Link className="text-link" href="/courses/applied-ai-foundations">Start learning <Arrow/></Link></div>
   </div>
   <div className="learning-secondary">{learning.slice(1).map(c=><Link href="/courses/applied-ai-foundations" className="content-link" key={c.title}><span className="eyebrow blue">{c.track}</span><strong>{c.title}</strong><span>{c.meta}</span><Arrow/></Link>)}<Link href="/courses" className="content-link"><span className="eyebrow blue">Catalogue</span><strong>Browse all learning</strong><span>Courses, paths and lessons</span><Arrow/></Link></div>
  </div></section>

  <section className="section learning-paths"><div className="container">
   <div className="section-heading-row"><div><span className="eyebrow blue">Microsoft Learn-style discovery</span><h2>Explore learning paths.</h2><p className="section-lede">Choose a direction and follow a clear route through practical courses.</p></div><Link className="text-link" href="/tracks">View all tracks <Arrow/></Link></div>
   <div className="path-list">{paths.map((p,i)=><Link className="path-row" href="/tracks/ai-data" key={p[0]}><span className="path-icon">{i===0?<BookOpen size={19}/>:i===1?<Code2 size={19}/>:i===2?<Cloud size={19}/>:<ShieldCheck size={19}/>}</span><div><h3>{p[0]}</h3><p>{p[1]}</p></div><div className="path-meta">{p[2]} · {p[3]}</div><ChevronRight className="arrow" size={19}/></Link>)}</div>
  </div></section>

  <section className="dark-feature-section"><div className="container">
   <div className="section-heading-row dark-heading"><div><span className="eyebrow light">Student projects</span><h2>Build something real.</h2></div><Link className="text-link light-link" href="/projects">Explore projects <Arrow/></Link></div>
   <div className="project-feature">
     <div className="project-art"><div className="project-browser"><div className="browser-bar"><i/><i/><i/><span>visionlab.mcc</span></div><div className="browser-body"><div className="vision-grid"/><div className="vision-panel"><small>COMPUTER VISION</small><strong>VisionLab</strong><span>Python · OpenCV · AI</span></div></div></div></div>
     <div className="project-feature-copy"><span className="eyebrow light">Featured project · Demo content</span><h3>VisionLab</h3><p>A presentation project exploring computer vision experiments and practical AI workflows.</p><div className="tech-list"><span className="tech">Python</span><span className="tech">OpenCV</span><span className="tech">AI</span></div><Link className="text-link light-link" href="/projects/visionlab">View project <Arrow/></Link></div>
   </div>
   <div className="dark-project-links"><Link href="/projects/campusos">CampusOS <Arrow/></Link><Link href="/projects/medtech-monitor">MedTech Monitor <Arrow/></Link><Link href="/projects">View all projects <Arrow/></Link></div>
  </div></section>

  <section className="section events-section"><div className="container">
   <div className="section-heading-row"><div><span className="eyebrow blue">Events</span><h2>What's happening at MCC.</h2></div><Link className="text-link" href="/events">View all events <Arrow/></Link></div>
   <div className="event-feature"><div className="event-visual"><CalendarDays size={34}/><strong>18</strong><span>October</span></div><div className="event-copy"><span className="eyebrow blue">Upcoming · Demo event</span><h3>Build Night: From idea to prototype</h3><p>Bring an idea, meet other builders, and leave with a clearer next step.</p><Link className="text-link" href="/events/build-night">View event <Arrow/></Link></div></div>
   <div className="event-list">{events.slice(1).map(e=><Link className="event-row" href="/events/build-night" key={e[2]}><time>{e[0]} {e[1]}</time><div><h3>{e[2]}</h3><p>{e[3]}</p></div><Arrow/></Link>)}</div>
  </div></section>

  <section className="community-feature"><div className="container community-grid"><div className="community-art"><div className="community-panel"><span>COMMUNITY</span><strong>MCC MNU</strong><small>Students · Projects · Events</small></div><div className="community-blue"/></div><div className="community-copy"><span className="eyebrow blue">Community</span><h2>Meet the people building what's next.</h2><p>Find students to learn with, projects to explore, events to attend, and opportunities to get involved.</p><Link className="text-link" href="/join">Join MCC <Arrow/></Link></div></div></section>

  <section className="section opportunities-section"><div className="container">
   <div className="section-heading-row"><div><span className="eyebrow blue">Opportunities</span><h2>Find your next opportunity.</h2></div><Link className="text-link" href="/opportunities">Explore opportunities <Arrow/></Link></div>
   <div className="opportunity-list">{opportunities.map(o=><Link className="op-row" href="/opportunities" key={o[0]}><strong>{o[0]}</strong><span>{o[1]}</span><span>{o[2]}</span><span><Arrow/></span></Link>)}</div>
  </div></section>

  <section className="cta"><div className="container cta-inner"><div><h2>Ready to get started?</h2><p>Join MCC MNU and find a place to learn, build and connect.</p></div><Link className="secondary" href="/join">Join MCC MNU <Arrow/></Link></div></section>

  <footer className="site-footer"><div className="container footer-grid">
   <div><div className="footer-brand">MCC MNU</div><p className="muted" style={{fontSize:13,lineHeight:1.6,maxWidth:270}}>A student technology community experience for Mansoura National University.</p></div>
   <div><h3>Learning</h3><Link href="/courses">Courses</Link><Link href="/tracks">Learning paths</Link><Link href="/resources">Resources</Link></div>
   <div><h3>Community</h3><Link href="/events">Events</Link><Link href="/projects">Projects</Link><Link href="/opportunities">Opportunities</Link></div>
   <div><h3>About</h3><Link href="/about">About MCC</Link><Link href="/join">Join MCC</Link><Link href="/demo/dashboard">Student experience</Link></div>
   <div><h3>Connect</h3><Link href="/join">Get involved</Link><Link href="/resources">Useful links</Link><Link href="/about">More about MCC</Link></div>
  </div><div className="container footer-bottom"><span>© MCC MNU · Presentation prototype</span><span>Demo content is clearly marked where applicable.</span></div></footer>
 </>
}
