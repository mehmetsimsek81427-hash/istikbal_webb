import ProfilePageView from "@/components/profile/ProfilePageView";

type ProfileUsernamePageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ProfileUsernamePage({ params, searchParams }: ProfileUsernamePageProps) {
  const { username } = await params;
  const { tab } = await searchParams;

  return <ProfilePageView usernameSlug={username} initialTab={tab ?? null} />;
}
