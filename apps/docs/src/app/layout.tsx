import "./globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono, Open_Sans, Poppins } from "next/font/google";

import { PaletteProvider } from "@/providers/palette-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "compacto-ui",
  description: "Flat, token-driven React primitives.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // No hardcoded `.dark`: PaletteProvider toggles it from the palette's
    // isLight flag on mount, and the default palette is now a light one. A
    // hardcoded class here would flash dark surfaces for one frame before the
    // provider corrected it.
    <html lang="en">
      <body
        className={`${poppins.variable} ${openSans.variable} ${jetbrainsMono.variable}`}
      >
        <PaletteProvider>{children}</PaletteProvider>
      </body>
    </html>
  );
}
