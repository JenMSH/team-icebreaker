import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Icebreaker",
  description: "Galaga-style ice breaker for team planning days. Shoot the invaders, unlock a question.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
