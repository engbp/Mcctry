import "./globals.css";
import { SiteHeader } from "../components/site-header";
export const metadata={title:"MCC MNU — Build what's next.",description:"MCC MNU — learn, build, connect."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteHeader/><main>{children}</main></body></html>}