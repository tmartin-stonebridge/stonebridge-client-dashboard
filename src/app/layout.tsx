import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// To use licensed Gotham, drop the font files in /public/fonts and wire
// next/font/local here, then set the --font-display variable. See README.
export const metadata: Metadata = {
  title: "Stonebridge — Client Dashboard",
  description: "Client portfolio dashboards for Stonebridge Wealth Management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
