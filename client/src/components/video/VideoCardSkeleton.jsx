const VideoCardSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-video w-full rounded-xl bg-[#1f1f1f]" />
      <div className="flex gap-3 pt-3">
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-[#1f1f1f]" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 w-5/6 rounded bg-[#1f1f1f]" />
          <div className="h-3.5 w-2/3 rounded bg-[#1f1f1f]" />
          <div className="h-3 w-1/2 rounded bg-[#1f1f1f]" />
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;