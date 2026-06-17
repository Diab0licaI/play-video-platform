import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : m;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} view${views === 1 ? "" : "s"}`;
};

const VideoCard = ({ video, showOwner = true }) => {
  const owner = video.owner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/videos/${video._id}`} className="group flex flex-col">

        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#1f1f1f]">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          {video.duration > 0 && (
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* Info below thumbnail */}
        <div className="flex gap-3 pt-3">
          {showOwner && (
            owner?.avatar ? (
              <img
                src={owner.avatar}
                alt={owner.fullName}
                className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-600 text-sm text-white">
                {owner?.fullName?.[0]?.toUpperCase() ?? "U"}
              </div>
            )
          )}

          <div className="flex-1 overflow-hidden">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-white/90">
              {video.title}
            </h3>
            {showOwner && (
              <p className="mt-1 truncate text-xs text-gray-400">
                {owner?.fullName}
              </p>
            )}
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {formatViews(video.views)}
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
    </motion.div>
  );
};

export default VideoCard;