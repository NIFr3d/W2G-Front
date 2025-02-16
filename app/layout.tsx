import { Cookie, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import Header from "@/components/general/header";
import Footer from "@/components/general/footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/general/providers";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <title>W2G</title>
        <CookiesProvider>
          <Providers>
            <div className="flex flex-col min-h-dvh">
              <Header />
              <div className="h-[calc(100dvh-3.5rem)] grow overflow-scroll">
                {children}
                <Footer />
              </div>
            </div>
          </Providers>
        </CookiesProvider>
        <Toaster />
      </body>
    </html>
  );
}
