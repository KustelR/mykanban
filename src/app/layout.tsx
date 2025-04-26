import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import CustomHeader from "@/components/ui/CustomHeader";
import ThemeController from "@/components/ThemeController";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <div className="font-arimo">
            <ThemeController></ThemeController>
            <CustomHeader></CustomHeader>
          </div>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
