import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Solo Leveling — Developer Career Progression System",
  description:
    "Level up your real-life developer career like a legendary system. Track skills, XP, and your path from Intern to CTO.",
  keywords: [
    "developer",
    "career",
    "progression",
    "leveling",
    "frontend",
    "CTO",
    "skills",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full`}
    >
      <body
        className="min-h-full"
        style={{ background: "#070B14", color: "#F8FAFC" }}
      >
        {children}
      </body>
    </html>
  );
}
