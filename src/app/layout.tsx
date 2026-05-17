import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "看懂一下 · 给爸妈的反诈助手",
  description:
    "对着手机说一句话，AI 用大字加语音帮长辈看懂截图、链接、文案，识别诈骗风险。",
  applicationName: "看懂一下",
  authors: [{ name: "Kandong Team" }],
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Elder users must be allowed to pinch-zoom. WCAG 1.4.4 Resize Text.
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">
          跳到主内容
        </a>
        {children}
      </body>
    </html>
  );
}
