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
    default: "TrendgoLig — Para Ödüllü Futbol Ligi",
    template: "%s | TrendgoLig",
  },
  description:
    "Ücretli katılımlı, para ödüllü halı saha futbol ligi. Fikstür, puan durumu, takımlar, blog ve daha fazlası.",
  keywords: [
    "halı saha ligi",
    "futbol ligi",
    "para ödüllü lig",
    "halı saha turnuvası",
    "fikstür",
    "puan durumu",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "TrendgoLig",
    title: "TrendgoLig — Para Ödüllü Futbol Ligi",
    description:
      "Ücretli katılımlı, para ödüllü halı saha futbol ligi. Takımını kur, sahaya çık, ödülü kap.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
