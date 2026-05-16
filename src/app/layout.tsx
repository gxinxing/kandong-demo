import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
  themeColor: "#fafafa",
  colorScheme: "light",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">
          跳到主内容
        </a>
        {children}
      </body>
    </html>
  );
}
