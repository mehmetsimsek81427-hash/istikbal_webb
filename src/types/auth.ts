// ─── Kullanıcı Kayıt Giriş Tipleri ───────────────────────────────────────────

export interface KayitVerisi {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface GirisVerisi {
    email: string;
    password: string;
}

// ─── API Yanıt Tipleri ───────────────────────────────────────────────────────

export interface AuthYanit {
    basarili: boolean;
    mesaj: string;
    kullanici?: KullaniciOzeti;
}

export interface KullaniciOzeti {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

// ─── JWT Payload Tipi ────────────────────────────────────────────────────────

export interface JwtPayload {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    iat?: number;
    exp?: number;
}
