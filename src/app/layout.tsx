import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorldForge — A World Shaped by Its People",
  description: "A real-time community-driven persistent world. Claim territories, form factions, wage wars, and shape history together.",
  openGraph: {
    title: "WorldForge",
    description: "Claim. Conquer. Create History.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
