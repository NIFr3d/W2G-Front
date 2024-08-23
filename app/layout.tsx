import { Cookie, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
        <CookiesProvider>
          <div className="flex flex-col min-h-dvh">
            <Header />
            <div className="min-h-[calc(100vh-11rem)]">{children}</div>
            <Footer />
          </div>
        </CookiesProvider>
      </body>
    </html>
  );
}
