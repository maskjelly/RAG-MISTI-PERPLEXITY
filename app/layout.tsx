import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Image from "next/image";

import { ThemeProvider } from "@/components/theme-provider";


const montserrat = Montserrat({ subsets: ["latin"] });

let title = "Llama based AI tutori MISTI";
let description = "Learn faster with AI tutor at your call 24/7";
// let url = "https://llamatutor.com/";
// let ogimage = "https://llamatutor.together.ai/og-image.png";
let sitename = "MISTI";

export const metadata: Metadata = {
  // metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    // images: [ogimage],
    title,
    description,
    // url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    // images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${montserrat.className} bg-white flex h-full flex-col justify-between text-gray-700 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
