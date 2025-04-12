import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { HeroProviders } from "./HeroProviders";
import Navigation from "@/components/Navigation";
import { WalletProviders } from "./WalletProviders";
import { getConfig } from "./wagmi";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Passport Application | Secure Online Application Process",
  description: "Apply for your passport online with our secure, step-by-step application process. Complete your personal information, address details, and document uploads in one place.",
  keywords: "passport application, online passport, secure passport application, digital passport process",
  openGraph: {
    title: "Passport Application | Secure Online Application Process",
    description: "Apply for your passport online with our secure, step-by-step application process.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Passport Application | Secure Online Application Process",
    description: "Apply for your passport online with our secure, step-by-step application process."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie'),
  )
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://yourwebsite.com/passport-application" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HeroProviders>
            <WalletProviders initialState={initialState}>
            <Navigation/>
          {children}
            </WalletProviders>
            <Footer/>
          </HeroProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
