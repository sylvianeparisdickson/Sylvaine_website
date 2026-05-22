import type { Metadata } from "next";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

export const metadata: Metadata = {
  title: "Sylviane Paris-Dickson",
  description: "I paint spaces shaped by human hands, exploring the quiet presence and memory they hold.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}