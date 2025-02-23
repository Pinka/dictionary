import type { Metadata } from "next";
import localFont from "next/font/local";
import { CSPostHogProvider } from "./providers";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mauritian Creole to English Dictionary | Translate Creole Words",
  description: `Explore a comprehensive Mauritian Creole to English dictionary. Instantly search and translate between Creole and English to understand the local language better.`,
  robots: "index, follow",
  keywords:
    "Mauritian Creole to English, Creole dictionary, translate Creole, Mauritian language, English to Creole translation, Creole words, Mauritian Creole translation",
  openGraph: {
    title: "Mauritian Creole to English Dictionary",
    description: `Easily translate Mauritian Creole to English and vice versa with a comprehensive dictionary.`,
    url: "https://lingo.mom",
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Mauritian Creole to English Dictionary",
  //   description: `Search and translate from Mauritian Creole to English with our dictionary of ${dictionary.length} words. Improve your understanding of Mauritian Creole today!`,
  //   site: "@MyTwitterHandle",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </CSPostHogProvider>
    </html>
  );
}
