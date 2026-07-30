"use client";

import Image from "next/image";
import FlipCard from "@/components/home/FlipCard";
import { contactLinks } from "@/lib/contact";
import { withBasePath } from "@/lib/base-path";

const aboutText =
  "15 yılı aşkın süredir İstikbal ailesinin güvenilir çözüm ortağı olarak müşterilerimize kaliteli, konforlu ve estetik yaşam alanları sunuyoruz. Demka Mobilya olarak müşteri memnuniyetini her zaman ön planda tutuyor, zengin ürün yelpazemiz, uygun fiyat politikamız ve profesyonel hizmet anlayışımızla sizlere en iyi alışveriş deneyimini yaşatmayı hedefliyoruz. Siz de Demka Mobilya'nın kalite ve güvenini yakından keşfetmek için mağazamızı ziyaret edebilir veya bizimle iletişime geçebilirsiniz.";

const managers: { name: string; role: string; bio: string; image?: string; nameLines?: [string, string] }[] = [
  {
    name: "Mehmet Şimşek",
    role: "Yönetici",
    image: "/slider6.jpeg",
    bio: "25 yılı aşkın süredir İstikbal bünyesinde edindiğim deneyim ve bilgi birikimiyle, meslek hayatıma çırak olarak başladığım bu yolculukta bugün Demka Mobilya'nın yönetiminde sizlere hizmet vermekten büyük gurur duyuyorum. Uzun yılların kazandırdığı tecrübe, müşteri odaklı hizmet anlayışı ve kaliteye verdiğimiz önem sayesinde her misafirimizi en doğru şekilde ağırlamayı hedefliyoruz. Sizleri mağazamızda ağırlamaktan mutluluk duyarız.",
  },
  {
    name: "İlknur Yıldız",
    nameLines: ["İlknur", "Yıldız"],
    role: "Müdür",
    image: "/ilknur.png",
    bio: "Satış temsilcisi olarak başladığım bu yolculukta, müşterilerimizin ihtiyaçlarını en doğru şekilde analiz ederek onlara en uygun yaşam alanlarını sunmayı ilke edindim. Demka Mobilya'da güler yüzlü hizmet anlayışı, kaliteli ürünler ve müşteri memnuniyeti odaklı yaklaşımımızla her ziyaretçimizin kendini özel hissetmesini hedefliyoruz. Sizleri mağazamızda ağırlamaktan mutluluk duyarım.",
  },
];

function StoreIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-[#00519E]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 4l9 5.75M5 10.5V19a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-8.5" />
    </svg>
  );
}

function ContactIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-[#00519E]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function ManagerAvatar({ imageSrc, name, large = false }: { imageSrc?: string; name: string; large?: boolean }) {
  if (imageSrc) {
    return (
      <div className={`manager-avatar manager-avatar--photo ${large ? "manager-avatar--large" : ""}`}>
        <Image
          src={withBasePath(imageSrc)}
          alt={name}
          fill
          sizes="(max-width: 768px) 72px, 88px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`manager-avatar ${large ? "manager-avatar--large" : ""}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="manager-avatar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="contact-btn__arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ContactButton({
  id,
  icon,
  label,
  value,
  href,
  external,
}: {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`contact-btn contact-btn--${id} cursor-pointer`}
    >
      <span className="contact-btn__icon-wrap" aria-hidden="true">
        <span className="contact-btn__icon">{icon}</span>
      </span>
      <span className="contact-btn__content">
        <span className="contact-btn__label">{label}</span>
        <span className="contact-btn__value">{value}</span>
      </span>
      <ArrowIcon />
    </a>
  );
}

function ManagerCardContent({
  name,
  nameLines,
  role,
  bio,
  imageSrc,
  flipped = false,
}: {
  name: string;
  nameLines?: [string, string];
  role: string;
  bio?: string;
  imageSrc?: string;
  flipped?: boolean;
}) {
  return (
    <>
      <div className="manager-card__stripe" aria-hidden="true" />
      <div className={`manager-card__body ${flipped ? "manager-card__body--back" : ""}`}>
        <ManagerAvatar imageSrc={imageSrc} name={name} large={!flipped} />
        <h5 className="manager-card__name">
          {nameLines ? (
            <>
              {nameLines[0]}
              <br />
              {nameLines[1]}
            </>
          ) : (
            name
          )}
        </h5>
        <p className="manager-card__role">{role}</p>
        {flipped && bio ? (
          <p className="corporate-text manager-card__bio">{bio}</p>
        ) : (
          <p className="manager-card__hint">Detaylar için tıklayın</p>
        )}
      </div>
    </>
  );
}

export default function CorporateInfoSection() {
  return (
    <div className="w-full px-4 md:px-12 mt-16">
      <div className="mb-8 pb-4 text-center">
        <h3 className="text-3xl md:text-[2.5rem] font-black text-[#00519E] tracking-tight">
          Mağazamız
        </h3>
        <div className="corporate-title-line mx-auto mt-3" aria-hidden="true" />
      </div>

      <div className="corporate-grid">
        {/* Hakkımızda */}
        <FlipCard
          className="corporate-grid__item corporate-grid__item--about corporate-animate corporate-animate--1 h-full"
          front={
            <div className="flip-card__content flip-card__content--center flip-card__content--spacious">
              <div className="corporate-icon-wrap">
                <StoreIcon />
              </div>
              <h4 className="corporate-title">Hakkımızda</h4>
              <p className="corporate-subtitle mt-3">Demka Mobilya</p>
              <p className="corporate-hint mt-8">Detaylar için tıklayın</p>
            </div>
          }
          back={
            <div className="flip-card__content flip-card__content--scroll flip-card__content--spacious">
              <span className="corporate-badge">⭐ 15+ Yıllık Tecrübe</span>
              <h4 className="corporate-title corporate-title--back mt-4">Demka Mobilya</h4>
              <div className="corporate-title-line" aria-hidden="true" />
              <p className="corporate-text mt-5 flex-1">{aboutText}</p>
              <div className="corporate-highlight mt-6">
                Kalite, Güven ve Müşteri Memnuniyeti
              </div>
            </div>
          }
        />

        {/* Yönetim */}
        <div className="corporate-grid__item corporate-grid__item--management corporate-card corporate-animate corporate-animate--2 h-full">
          <div className="corporate-card__body flex flex-col h-full">
            <div className="text-center mb-6 shrink-0">
              <h4 className="corporate-title">Yönetim</h4>
              <p className="corporate-subtitle corporate-subtitle--light mt-2">
                Demka Mobilya Yönetim Kadrosu
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1 min-h-0">
              {managers.map((manager) => (
                <FlipCard
                  key={manager.name}
                  compact
                  manager
                  className="h-full min-h-[280px]"
                  front={
                    <div className="flip-card__content flip-card__content--manager">
                      <ManagerCardContent name={manager.name} nameLines={manager.nameLines} role={manager.role} imageSrc={manager.image} />
                    </div>
                  }
                  back={
                    <div className="flip-card__content flip-card__content--scroll flip-card__content--manager">
                      <ManagerCardContent name={manager.name} nameLines={manager.nameLines} role={manager.role} bio={manager.bio} imageSrc={manager.image} flipped />
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <FlipCard
          className="corporate-grid__item corporate-grid__item--contact corporate-animate corporate-animate--3 h-full"
          front={
            <div className="flip-card__content flip-card__content--center flip-card__content--spacious">
              <div className="corporate-icon-wrap">
                <ContactIcon />
              </div>
              <h4 className="corporate-title">İletişim Bilgileri</h4>
              <p className="corporate-hint mt-8">Detaylar için tıklayın</p>
            </div>
          }
          back={
            <div className="flip-card__content flip-card__content--scroll flip-card__content--spacious">
              <h4 className="corporate-title corporate-title--back shrink-0">İletişim Bilgileri</h4>
              <div className="corporate-title-line mb-5" aria-hidden="true" />
              <div className="contact-btn-grid">
                {contactLinks.map((link) => (
                  <ContactButton
                    key={link.id}
                    id={link.id}
                    icon={link.icon}
                    label={link.label}
                    value={link.value}
                    href={link.href}
                    external={link.external}
                  />
                ))}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
