import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { FlowProvider } from "@/context/FlowContext";
import { SidebarProvider } from "@/context/SidebarContext";
import MainLayout from "@/components/MainLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mikir flow ai",
  description: "Canvas AI Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <FlowProvider>
            <SidebarProvider>
              <MainLayout>{children}</MainLayout>
            </SidebarProvider>
          </FlowProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
