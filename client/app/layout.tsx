import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutContainer } from "@/components/app-shell/layout-container";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${_geist.className}`}>
      <body className={`${_geistMono.className} font-sans antialiased`}>
        <QueryProvider>
          <ReduxProvider>
            <LayoutContainer>{children}</LayoutContainer>
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
