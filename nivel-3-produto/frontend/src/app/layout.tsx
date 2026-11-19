import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "GDS Boutique — Perfumaria e Cosméticos",
  description:
    "Vitrine de perfumes importados, árabes e de nicho, cosméticos e skin care. Monte seu pedido e finalize direto pelo WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "GDS Boutique",
    title: "GDS Boutique — Perfumaria e Cosméticos",
    description: "Perfumes importados, árabes e de nicho, cosméticos e skin care.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bodoniModa.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-graphite font-body">
        {children}
      </body>
    </html>
  );
}
