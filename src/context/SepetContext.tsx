"use client";

import React, { createContext, useContext, useState } from "react";

export interface SepetUrunu {
    id: number;
    isim: string;
    yeniFiyat: string;
    emoji: string;
    kategori: string;
    adet: number;
}

interface SepetContextType {
    sepet: SepetUrunu[];
    sepetSayisi: number;
    sepeteEkle: (urun: Omit<SepetUrunu, "adet">) => void;
    sepettenCikar: (id: number) => void;
    sepetiTemizle: () => void;
}

const SepetContext = createContext<SepetContextType | undefined>(undefined);

export function SepetProvider({ children }: { children: React.ReactNode }) {
    const [sepet, setSepet] = useState<SepetUrunu[]>([]);

    const sepeteEkle = (yeniUrun: Omit<SepetUrunu, "adet">) => {
        setSepet((mevcutSepet) => {
            const varMi = mevcutSepet.find((item) => item.id === yeniUrun.id);
            if (varMi) {
                return mevcutSepet.map((item) =>
                    item.id === yeniUrun.id ? { ...item, adet: item.adet + 1 } : item
                );
            }
            return [...mevcutSepet, { ...yeniUrun, adet: 1 }];
        });
    };

    const sepettenCikar = (id: number) => {
        setSepet((mevcutSepet) =>
            mevcutSepet.reduce((acc, item) => {
                if (item.id === id) {
                    if (item.adet > 1) acc.push({ ...item, adet: item.adet - 1 });
                } else {
                    acc.push(item);
                }
                return acc;
            }, [] as SepetUrunu[])
        );
    };

    const sepetiTemizle = () => setSepet([]);

    // Toplam ürün adedi hesabı
    const sepetSayisi = sepet.reduce((toplam, item) => toplam + item.adet, 0);

    return (
        <SepetContext.Provider value={{ sepet, sepetSayisi, sepeteEkle, sepettenCikar, iade: sepetiTemizle, sepetiTemizle }}>
            {children}
        </SepetContext.Provider>
    );
}

export function useSepet() {
    const context = useContext(SepetContext);
    if (!context) {
        throw new Error("useSepet bir SepetProvider içinde kullanılmalıdır!");
    }
    return context;
}