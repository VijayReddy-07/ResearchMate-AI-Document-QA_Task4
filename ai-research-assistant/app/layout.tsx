import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResearchMate — AI Document Assistant",
  description: "Ask questions and get grounded answers from your PDF documents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
