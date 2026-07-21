import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trendgolig.com"),
  title: {
    default: "TrendgoLig",
    template: "%s | TrendgoLig",
  },
  description:
    "TrendgoLig resmi web sitesi. Fikstür, puan durumu, takımlar, blog ve lig duyuruları.",
  keywords: [
    "halı saha ligi",
    "futbol ligi",
    "halı saha turnuvası",
    "fikstür",
    "puan durumu",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "TrendgoLig",
    title: "TrendgoLig",
    description:
      "TrendgoLig resmi web sitesi. Fikstür, puan durumu, takımlar ve lig duyuruları.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendgoLig",
    description:
      "TrendgoLig resmi web sitesi. Fikstür, puan durumu, takımlar ve lig duyuruları.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
