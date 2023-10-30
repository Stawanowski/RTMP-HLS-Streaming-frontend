import Navbar from "@/components/Navbar/Navbar.component";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar/Sidebar.component";
// import { session } from '@/lib/session'
import { cookies } from "next/headers";
import axios from "axios";
import Loader from "@/components/Loader/Loader.component";
// import React from 'react'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Loader />
        <Navbar />
        <Sidebar />
        <div className="layoutContainer">{children}</div>
      </body>
    </html>
  );
}
