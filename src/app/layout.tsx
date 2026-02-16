import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Font configurations
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bellas Glamour - Elegance Meets Desire",
  description: "Premium adult content platform featuring exclusive models and creators. Sophisticated, discreet, and luxurious experience.",
  keywords: ["premium content", "exclusive models", "adult entertainment", "glamour", "luxury", "creators"],
  authors: [{ name: "Bellas Glamour Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Bellas Glamour",
    description: "Premium adult content platform",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0A0A0A] text-[#F5F5F5]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
