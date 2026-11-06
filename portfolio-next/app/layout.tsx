import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { SiteBackground } from "@/components/site/SiteBackground";
import "./globals.css";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gautier Baleda — Product Builder",
  description: "Product Builder — je construis des outils sur mesure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteBackground />
        <div className="flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
