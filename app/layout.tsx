import "./globals.css";
import { Inter } from "next/font/google";
import { SiteHeader } from "../components/site-header";
const inter=Inter({subsets:["latin"],display:"swap"});
export const metadata={title:"MCC MNU — Build what's next.",description:"Microsoft Campus Club MNU — learn, build, connect."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={inter.className}><SiteHeader/><main>{children}</main></body></html>}