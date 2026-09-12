import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gator Wash Solutions | Business Manager",
  description:
    "Dashboards, CRM, scheduling, and KPIs for Gator Wash Solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
