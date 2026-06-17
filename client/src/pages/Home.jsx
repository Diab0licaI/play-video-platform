import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import VideoGrid from "../components/video/VideoGrid";
import VideoCardSkeleton from "../components/video/VideoCardSkeleton";
import { videoApi } from "../api/videoApi";


const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await videoApi.getAllVideos(searchQuery);
        setVideos(res.data.data);
      } catch (error) {
        console.log("VIDEO ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {searchQuery && (
          <h2 className="mb-4 text-lg font-semibold text-white">
            Results for "{searchQuery}"
          </h2>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-6xl">🔍</p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              No videos found
            </h2>
            <p className="mt-2 text-gray-400">
              Try searching for something else.
            </p>
          </div>
        ) : (
          <VideoGrid videos={videos} />
        )}

      </div>
    </MainLayout>
  );
};

export default Home;