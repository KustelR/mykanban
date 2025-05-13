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
          <div className="font-arimo h-screen flex flex-col w-screen overflow-auto">
            <CustomHeader />
            {children}
          </div>
        </body>
      </html>
    </StoreProvider>
  );
}
