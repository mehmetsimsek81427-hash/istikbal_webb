export interface KayitVerisi {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface GirisVerisi {
  email: string;
  password: string;
}

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
  username?: string;
  avatarUrl?: string | null;
  isAdmin: boolean;
}
