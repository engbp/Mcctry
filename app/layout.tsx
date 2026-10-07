import "./globals.css";
import {SiteHeader} from "../components/site-header";
export const metadata={title:"MCC MNU",description:"MCC MNU — a student community for learning, building, and connecting."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteHeader/><main>{children}</main></body></html>}
