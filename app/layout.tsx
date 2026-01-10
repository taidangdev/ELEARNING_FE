import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduCenter - Hệ thống quản lý học tập",
  description: "Nâng tầm kỹ năng, làm chủ tương lai cùng EduCenter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${roboto.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
