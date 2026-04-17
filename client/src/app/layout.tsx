import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Email protection solutions for businesses - Mailinblack",
  description: "Secure your business emails. Train your employees to cyber attacks. Protect your emails with Mailinblack.",
  keywords: ["email protection", "cybersecurity", "anti spam", "anti phishing", "mailinblack"],
  openGraph: {
    title: "Email protection solutions for businesses - Mailinblack",
    description: "Secure your business emails. Train your employees to cyber attacks. Protect your emails with Mailinblack.",
    type: "website",
    locale: "en_GB",
    url: "https://www.mailinblack.com/en/",
    siteName: "Mailinblack",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
