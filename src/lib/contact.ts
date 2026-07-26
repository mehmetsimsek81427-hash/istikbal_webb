export const storeContact = {
  address: {
    short: "Esenler Cad. No:99 A Bayrampaşa/İST (34035)",
    full: "Terazidere Mahallesi, Esenler Caddesi No:99 A, Bayrampaşa / İstanbul",
  },
  phone: {
    display: "0532 746 0570",
    href: "tel:05327460570",
  },
  gsm: {
    display: "0532 746 0570",
    href: "tel:05327460570",
  },
  email: {
    display: "demkamobilyaistikbal@gmail.com",
    href: "mailto:demkamobilyaistikbal@gmail.com",
  },
  website: {
    display: "istikbal.com.tr",
    href: "https://www.istikbal.com.tr",
  },
  instagram: {
    display: "@demkamobilya_istikbal",
    href: "https://instagram.com/demkamobilya_istikbal",
  },
  facebook: {
    display: "Demka Mobilya İstikbal",
    href: "https://www.facebook.com/demkamobilya.istikbal",
  },
  googleMaps: {
    display: "Google Maps",
    href: "https://www.google.com/maps/search/?api=1&query=Terazidere+Mahallesi+Esenler+Caddesi+No:99+A+Bayrampaşa+İstanbul",
  },
} as const;

export type ContactLinkItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  value: string;
  external?: boolean;
};

export const contactLinks: ContactLinkItem[] = [
  {
    id: "address",
    label: "Adres",
    icon: "📍",
    href: storeContact.googleMaps.href,
    value: storeContact.address.full,
    external: true,
  },
  {
    id: "phone",
    label: "Telefon",
    icon: "☎",
    href: storeContact.phone.href,
    value: storeContact.phone.display,
  },
  {
    id: "gsm",
    label: "GSM",
    icon: "📱",
    href: storeContact.gsm.href,
    value: storeContact.gsm.display,
  },
  {
    id: "email",
    label: "E-Posta",
    icon: "✉",
    href: storeContact.email.href,
    value: storeContact.email.display,
  },
  {
    id: "website",
    label: "Web Sitesi",
    icon: "🌐",
    href: storeContact.website.href,
    value: storeContact.website.display,
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "📷",
    href: storeContact.instagram.href,
    value: storeContact.instagram.display,
    external: true,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "📘",
    href: storeContact.facebook.href,
    value: storeContact.facebook.display,
    external: true,
  },
  {
    id: "googleMaps",
    label: "Google Maps",
    icon: "📍",
    href: storeContact.googleMaps.href,
    value: storeContact.googleMaps.display,
    external: true,
  },
];
