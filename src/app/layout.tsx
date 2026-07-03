import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "@/context/AppProvider";
import BootLoader from "@/components/BootLoader";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SwasthSetu AI — Smart Health Centre & Supply Chain Command",
  description: "AI-driven medicine stock, footfall, beds, attendance and lab monitoring for PHCs & CHCs — with Vertex AI forecasting and smart redistribution. Hack2Skill Track 3 · Google Cloud.",
};
export const viewport: Viewport = { themeColor: "#0d9488" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable} font-body antialiased`}>
        <AppProvider>
          <BootLoader />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
