import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Ads Control Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-neutral-950 text-white">{children}</body>
    </html>
  );
}
