import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import Loglib from "@loglib/tracker/react";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Source Map to Source Code",
  description: "A tool to map source maps to source code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
        <Toaster />
        <Loglib
          config={{
            id: "sourcemap",
          }}
        />
      </body>
    </html>
  );
}
