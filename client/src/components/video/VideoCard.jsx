import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  const owner = video.owner;

  return (
    <Link to={`/videos/${video._id}`} className="group flex flex-col">

      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {Math.floor(video.duration / 60)}:
            {String(Math.floor(video.duration % 60)).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Info below thumbnail */}
      <div className="flex gap-3 pt-3">
        {owner?.avatar ? (
          <img
            src={owner.avatar}
            alt={owner.fullName}
            className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-600 text-sm text-white">
            {owner?.fullName?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {owner?.fullName}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {video.views ?? 0} views
            {video.createdAt && (
              <>
                {" • "}
                {new Date(video.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </>
            )}
          </p>
        </div>
      </div>

    </Link>
  );
};

export default VideoCard;