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

import PageTransition from "@/components/PageTransition";
import { ContentProvider } from "@/context/ContentContext";
import VisitorTracker from "@/components/VisitorTracker";
import BrandingManager from "@/components/BrandingManager";
import { getInitialContent } from "@/lib/data-fetchers";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getInitialContent();
  const timestamp = new Date().getTime();
  const faviconUrl = `/api/branding/favicon?v=${timestamp}`;

  return {
    metadataBase: new URL('https://portfolio-example.com'),
    title: {
      default: content.branding?.heading || "Professional Developer Portfolio",
      template: `%s | ${content.branding?.heading || "Alex Johnson"}`
    },
    description: content.hero?.description || "I'm a passionate full-stack developer with a focus on building modern, performant web applications.",
    keywords: ["Next.js", "React", "TypeScript", "Full-Stack Developer", "Portfolio", "Web Development", "MongoDB"],
    authors: [{ name: content.hero?.name || "Alex Johnson" }],
    creator: content.hero?.name || "Alex Johnson",
    openGraph: {
      title: content.branding?.heading || "Professional Developer Portfolio",
      description: content.hero?.description || "Building modern, scalable web applications with cutting-edge technologies.",
      url: 'https://portfolio-example.com',
      siteName: content.branding?.heading || 'Alex Johnson Portfolio',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: content.branding?.heading || 'Alex Johnson Portfolio',
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: 'summary_large_image',
      title: `${content.hero?.name || 'Alex Johnson'} | Full-Stack Developer`,
      description: content.hero?.description || 'Building modern, scalable web applications with cutting-edge technologies.',
      creator: '@alexjohnson',
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
        { url: faviconUrl, type: 'image/png' },
      ],
      shortcut: faviconUrl,
      apple: [
        { url: faviconUrl, type: 'image/png' },
      ],
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialContent = await getInitialContent();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="font-sans bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        <ContentProvider initialContent={initialContent}>
          <VisitorTracker />
          {/* We handle favicon and title via generateMetadata in Next.js App Router, 
              removing the direct DOM manipulation from BrandingManager */}

          <PageTransition>{children}</PageTransition>
        </ContentProvider>
      </body>
    </html>
  );
}
