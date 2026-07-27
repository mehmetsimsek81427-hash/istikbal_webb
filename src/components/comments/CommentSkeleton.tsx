export default function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-5 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-[#00519E]/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 rounded bg-[#00519E]/10" />
        <div className="h-3 w-full rounded bg-[#00519E]/10" />
        <div className="h-3 w-4/5 rounded bg-[#F2A900]/20" />
      </div>
    </div>
  );
}
