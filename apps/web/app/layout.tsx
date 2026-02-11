import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "EnvoysJobs",
  description: "A community-first opportunity platform for RCCG The Envoys.",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
