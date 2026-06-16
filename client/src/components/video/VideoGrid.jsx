import VideoCard from "./VideoCard";

const VideoGrid = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl">📺</p>
        <h2 className="mt-4 text-xl font-semibold text-white">
          No videos yet
        </h2>
        <p className="mt-2 text-gray-400">
          Upload your first video to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;