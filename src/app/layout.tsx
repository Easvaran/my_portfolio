import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-example.com'),
  title: {
    default: "Professional Developer Portfolio | Full-Stack Expert",
    template: "%s | Alex Johnson"
  },
  description: "I'm a passionate full-stack developer with a focus on building modern, performant web applications using Next.js, React, and MongoDB.",
  keywords: ["Next.js", "React", "TypeScript", "Full-Stack Developer", "Portfolio", "Web Development", "MongoDB"],
  authors: [{ name: "Alex Johnson" }],
  creator: "Alex Johnson",
  openGraph: {
    title: "Professional Developer Portfolio",
    description: "Building modern, scalable web applications with cutting-edge technologies.",
    url: 'https://portfolio-example.com',
    siteName: 'Alex Johnson Portfolio',
    images: [
      {
        url: '/og-image.png', // Make sure to add this image to public folder
        width: 1200,
        height: 630,
        alt: 'Alex Johnson Portfolio',
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Johnson | Full-Stack Developer',
    description: 'Building modern, scalable web applications with cutting-edge technologies.',
    creator: '@alexjohnson', // Replace with actual handle
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/api/branding/favicon', type: 'image/png' },
    ],
    shortcut: '/api/branding/favicon',
    apple: [
      { url: '/api/branding/favicon', type: 'image/png' },
    ],
  },
};

import PageTransition from "@/components/PageTransition";
import { ContentProvider } from "@/context/ContentContext";
import VisitorTracker from "@/components/VisitorTracker";
import BrandingManager from "@/components/BrandingManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="font-sans bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        <ContentProvider>
          <VisitorTracker />
          <BrandingManager />
          <PageTransition>{children}</PageTransition>
        </ContentProvider>
      </body>
    </html>
  );
}
