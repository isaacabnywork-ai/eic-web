import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AudioPlayerProvider } from "@/contexts/audio-player-context";
import { MiniAudioPlayer } from "@/components/mini-audio-player";
import { AuthProvider } from "@/contexts/auth-context";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "330+",
  description: "A comprehensive resource hub featuring videos, podcasts, articles, and book reviews to help you learn, grow, and connect with a broader community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${sourceSans.variable} font-sans antialiased bg-bg text-text-main`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AudioPlayerProvider>
              {children}
              <MiniAudioPlayer />
            </AudioPlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
