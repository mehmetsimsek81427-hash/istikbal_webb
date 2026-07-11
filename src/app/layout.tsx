import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
// Sepet havuzumuzu buraya çağırıyoruz
import { SepetProvider } from "@/context/SepetContext";
// Kimlik doğrulama bağlamı
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "İstikbal Mobilya | Her Ev Güzel İstikbal'le",
  description: "Modern ve konforlu mobilya alışverişinin adresi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-istikbal-gray-light`}>
        {/* Tüm siteyi sepet havuzu ile sararak ortak hafızayı aktifleştiriyoruz */}
        <AuthProvider>
          <SepetProvider>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </SepetProvider>
        </AuthProvider>
      </body>
    </html>
  );
}