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
          <ThemeController></ThemeController>
          <CustomHeader></CustomHeader>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
