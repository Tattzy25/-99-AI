import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import footer from "@/components/layout/footer";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import navbar from "@/components/layout/navbar";

export const metadata = {
  title: "Precedent - Building blocks for your Next.js project",
  description:
    "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
  metadataBase: new URL("https://precedent.dev"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          <navbar />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
          {children}
        </main>
        <footer />
        <VercelAnalytics />
      </body>
    </html>
  );
}