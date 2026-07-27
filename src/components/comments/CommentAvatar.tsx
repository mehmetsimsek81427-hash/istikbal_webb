import { getInitials } from "@/types/comments";

type CommentAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md";
};

export default function CommentAvatar({ name, avatarUrl, size = "md" }: CommentAvatarProps) {
  const dimension = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={`${dimension} rounded-full object-cover ring-2 ring-[#F2A900]/40 shrink-0 shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${dimension} rounded-full bg-gradient-to-br from-[#0F365C] to-[#00519E] text-[#F2A900] font-black flex items-center justify-center shrink-0 ring-2 ring-[#F2A900]/40 shadow-sm`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
