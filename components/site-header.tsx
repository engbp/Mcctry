"use client";
import Link from "next/link";
import {useState} from "react";
import {Menu,X,Search,ChevronDown,ArrowUpRight} from "lucide-react";

const links=[["Learn","/courses"],["Tracks","/tracks"],["Courses","/courses"],["Events","/events"],["Projects","/projects"],["Opportunities","/opportunities"]];

export function SiteHeader(){
 const[open,setOpen]=useState(false);
 return <header className="site-header">
  <div className="nav-wrap">
   <Link className="brand" href="/" aria-label="MCC MNU home">
    <span className="brand-mark" aria-hidden="true"><i/><i/><i/><i/></span>
    <span>MCC <span className="brand-mnu">MNU</span></span>
   </Link>
   <span className="brand-divider" aria-hidden="true"/>
   <nav className="desktop-nav" aria-label="Primary navigation">
    {links.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}
   </nav>
   <div className="nav-actions">
    <button className="search-btn" aria-label="Search"><Search size={17}/><span>Search</span></button>
    <button className="language-btn" aria-label="Change language">عربي</button>
    <Link className="join-button" href="/join">Join MCC <ArrowUpRight size={15}/></Link>
    <button className="menu-btn" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu size={21}/></button>
   </div>
  </div>
  {open&&<div className="mobile-panel">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",height:48}}>
      <strong>MCC MNU</strong><button className="menu-btn" aria-label="Close navigation" onClick={()=>setOpen(false)}><X size={22}/></button>
    </div>
    {links.map(([label,href])=><Link onClick={()=>setOpen(false)} key={label} href={href}>{label}<ChevronDown size={16}/></Link>)}
    <Link className="mobile-join primary" href="/join" onClick={()=>setOpen(false)}>Join MCC <ArrowUpRight size={15}/></Link>
  </div>}
 </header>
}
