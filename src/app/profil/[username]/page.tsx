import ProfilePageView from "@/components/profile/ProfilePageView";

type ProfilUsernamePageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ProfilUsernamePage({ params, searchParams }: ProfilUsernamePageProps) {
  const { username } = await params;
  const { tab } = await searchParams;

  return <ProfilePageView usernameSlug={username} initialTab={tab ?? null} />;
}
