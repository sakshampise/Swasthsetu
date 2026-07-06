import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppProvider from "@/context/AppProvider";
import BootLoader from "@/components/BootLoader";

export const metadata: Metadata = {
  title: "SwasthSetu AI — Smart Health Centre & Supply Chain Command",
  description: "AI-driven medicine stock, footfall, beds, attendance and lab monitoring for PHCs & CHCs — with Vertex AI forecasting and smart redistribution. Hack2Skill Track 3 · Google Cloud.",
};
export const viewport: Viewport = { themeColor: "#0d9488" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <script dangerouslySetInnerHTML={{ __html: `try{var s=JSON.parse(localStorage.getItem("swasthsetu")||"{}");if(s.dark)document.documentElement.classList.add("dark")}catch(e){}` }} />
        <AppProvider>
          <BootLoader />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
