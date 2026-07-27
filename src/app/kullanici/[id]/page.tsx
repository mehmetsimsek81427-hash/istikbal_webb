import LegacyProfileRedirect from "@/components/profile/LegacyProfileRedirect";

type KullaniciProfilPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KullaniciProfilPage({ params }: KullaniciProfilPageProps) {
  const { id } = await params;
  return <LegacyProfileRedirect userId={id} />;
}
