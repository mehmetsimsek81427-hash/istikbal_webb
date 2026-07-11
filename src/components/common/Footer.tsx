"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#0A192F] text-gray-300 pt-16 pb-8 border-t border-white/10 font-sans antialiased">

            {/* Orijinal Sitedeki Geniş 10 Sütunlu Link İskelet Yapısı */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-6 pb-12 border-b border-white/5">

                {/* 1. SÜTUN: KURUMSAL */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">KURUMSAL</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/sayfa/hakkimizda" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hakkımızda</a></li>
                        <li><a href="https://www.istikbal.com.tr/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="https://www.istikbal.com.tr/sayfa/uyelik-sozlesmesi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Üyelik Sözleşmesi</a></li>
                        <li><a href="https://www.istikbal.com.tr/sayfa/iptal-ve-iade-kosullari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">İptal ve İade Koşulları</a></li>
                        <li><a href="https://www.istikbal.com.tr/sayfa/gizlilik-ve-guvenlik" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gizlilik ve Güvenlik</a></li>
                        <li><a href="https://www.istikbal.com.tr/sayfa/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</a></li>
                        <li><a href="https://www.istikbal.com.tr/iletisim" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">İletişim Formu</a></li>
                        <li><a href="https://www.istikbal.com.tr/sayfa/sikca-sorulan-sorular" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</a></li>
                        <li><a href="https://www.istikbal.com.tr/sayfa/kampanyalar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">11.11 İndirimleri</a></li>
                        <li><a href="https://www.istikbal.com.tr/sayfa/kampanyalar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kasım İndirimleri</a></li>
                    </ul>
                </div>

                {/* 2. SÜTUN: OTURMA ODASI */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">OTURMA ODASI</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/koltuk-takimlari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Koltuk Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/berjer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Berjer</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/sehpalar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sehpalar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/kose-takimlari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Köşe Koltuk Takımı</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/tv-koltugu-1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TV Koltukları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/kanepe-koltuk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kanepe / Koltuk</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/tv-unitesi-1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TV Ünitesi</a></li>
                    </ul>
                </div>

                {/* 3. SÜTUN: YEMEK ODASI */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">YEMEK ODASI</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/yemek-odasi-takimi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yemek Odası Takımı</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/mutfak-masa-takimi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Mutfak Masa Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/konsol" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Konsol</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/konsol-aynasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Konsol Aynası</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/vitrin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Vitrin</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/gumusluk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gümüşlük</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/yemek-masasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yemek Masası</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/sandalye" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sandalye</a></li>
                    </ul>
                </div>

                {/* 4. SÜTUN: YATAK ODASI */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">YATAK ODASI</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/yatak-odasi-takimi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yatak Odası Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/dolap" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dolap</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/sifonyer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Şifonyer</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/komodin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Komodin</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/makyaj-masasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Makyaj Masası</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/makyaj-aynasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Makyaj Aynası</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/karyola" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Karyola</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/karyola-basliklari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Karyola Başlıkları</a></li>
                    </ul>
                </div>

                {/* 5. SÜTUN: GENÇ VE ÇOCUK ODASI */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">GENÇ VE ÇOCUK ODASI</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/genc-odasi-takimlari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Genç Odası Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/genc-odasi-sifonyer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Genç Odası Şifonyer</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/genc-odasi-baslik" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Genç Odası Başlık</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/calisma-masasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Çalışma Masası</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/oyuncu-koltugu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Oyuncu Koltuğu</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/bebek-odasi-takimlari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bebek Odası Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/kitaplik" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kitaplık</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/genc-odasi-karyola" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Genç Odası Karyola</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/genc-odasi-sandalyesi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Çalışma Sandalyesi</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/genc-odasi-dolap" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Genç Odası Dolap</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/genc-odasi-komodin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Genç Odası Komodin</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/ranza" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Ranza</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/besik" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bebek Beşiği</a></li>
                        <li><a href="https://www.istikbal.com.tr/blog/icerik/pencere-onu-dekorasyonu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Pencere önü dekorasyonu</a></li>
                    </ul>
                </div>

                {/* 6. SÜTUN: YATAK */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">YATAK</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/malzemeye-gore-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Malzemeye göre yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/pedli-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Pedli Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/sunger-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sünger Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/visco-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Visco Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/yayli-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yaylı Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/olcuye-gore-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Ölçüye göre yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/tek-kisilik-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Tek Kişilik Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/cift-kisilik-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Çift Kişilik Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/bebek-yatagi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bebek Yatağı</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/yatak-sertligi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sertliğe göre yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/yumusak-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yumuşak Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/orta-sert-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Orta - Sert Yataklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/sert-yataklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sert Yataklar</a></li>
                    </ul>
                </div>

                {/* 7. SÜTUN: BAZA VE BAŞLIK */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">BAZA VE BAŞLIK</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/baza" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Baza</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/baslik" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Başlık</a></li>
                        <li><a href="https://www.istikbal.com.tr/blog/icerik/baza-alti-duzeni-nasil-olmali" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Baza altı düzeni nasıl olmalı</a></li>
                        <li><a href="https://www.istikbal.com.tr/blog/icerik/karyola-ne-demek-yatak-odalarinda-baza-mi-karyola-mi-tercih-edilmeli" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yatak odalarında baza mı karyola mı tercih edilmeli</a></li>
                    </ul>
                </div>

                {/* 8. SÜTUN: BAHÇE MOBİLYASI */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">BAHÇE MOBİLYASI</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/bahce-masa-takimlari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bahçe Masa Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/bahce-kose-takimlari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bahçe Köşe Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/salincaklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Salıncaklar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/bahce-masalari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bahçe Masaları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/bahce-sehpalari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bahçe Sehpaları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/bahce-koltuklari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bahçe Koltukları</a></li>
                        <li><a href="https://www.istikbal.com.tr/blog/icerik/veranda-nedir-veranda-dekorasyonu-icin-en-iyi-mobilya-secimi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Veranda Nedir? Veranda Dekorasyonu</a></li>
                        <li><a href="https://www.istikbal.com.tr/blog/icerik/kis-bahcesi-tasarimi-icin-dekorasyon-onerileri" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kış bahçesi tasarımı için dekorasyon ürünleri</a></li>
                    </ul>
                </div>

                {/* 9. SÜTUN: TAMAMLAYICI ÜRÜNLER */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">TAMAMLAYICI ÜRÜNLER</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/portmanto" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Portmanto ve Vestiyer</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/dresuar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dresuar</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/puf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Puf</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/orta-sehpa-2" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Orta Sehpa</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/yan-sehpa-2" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yan Sehpa</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/zigon-sehpa-1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Zigon Sehpa</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/tv-sehpasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Tv Sehpası</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/markiz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Markiz</a></li>
                        <li><a href="https://www.istikbal.com.tr/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Evinizi Canlandırın: Popüler Sukulent çeşitleri ve Bakım ürünleri</a></li>
                    </ul>
                </div>

                {/* 10. SÜTUN: ONLINE ÖZEL */}
                <div className="space-y-3">
                    <h4 className="text-white font-black text-xs uppercase tracking-wider">⚡ ONLINE ÖZEL</h4>
                    <ul className="text-[11px] font-medium space-y-2 text-gray-400">
                        <li><a href="https://www.istikbal.com.tr/kategori/koltuk-takimlari-1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Koltuk Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/online-ozel-calisma-masasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Çalışma Masası</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/kose-koltuk-takimlari" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Köşe Koltuk Takımları</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/yatak-1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Yatak</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/online-ozel-kitapliklar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kitaplık</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/bahce-mobilyasi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Baza Başlık</a></li>
                        <li><a href="https://www.istikbal.com.tr/kategori/tv-sehpasi-1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Online Özel TV Sehpaları!</a></li>
                    </ul>
                </div>

            </div>

            {/* Alt Bilgi, İletişim ve Google Maps */}
            <div className="max-w-7xl mx-auto px-6 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 font-medium">

                {/* Sol Taraf: İletişim Bilgileri */}
                <div className="flex items-center gap-2.5">
                    <Phone className="w-5 h-5 text-[#BFC7D5]" />
                    <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-[#BFC7D5]">İSTİKBAL DEMKA MOBİLYA İLETİŞİM</span>
                        <span className="text-[16px] font-bold text-white">0532 746 0570</span>
                    </div>
                </div>

                {/* Orta Taraf: Google Maps Butonu */}
                <a
                    href="https://www.google.com/maps/search/?api=1&query=Terazidere+Mahallesi+Esenler+Caddesi+No:99+A+Bayrampaşa+İstanbul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 px-[18px] py-[10px] bg-[#FBBF24] text-gray-900 rounded-full font-bold hover:bg-[#F59E0B] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                    <span className="text-sm">MAĞAZAMIZI BULUN</span>
                    <span className="text-[10px] font-medium text-center">Terazidere Mahallesi, Esenler Caddesi No:99 A, Bayrampaşa / İstanbul</span>
                </a>

                {/* Sağ Taraf: Telif Hakları */}
                <div className="text-gray-500 font-medium text-center md:text-right">
                    © 2026 İstikbal Mobilya Klon Projesi. Tüm hakları saklıdır. Mehmet Tarafından Geliştirildi.
                </div>
            </div>

        </footer>
    );
}