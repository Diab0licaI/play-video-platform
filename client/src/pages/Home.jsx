import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import VideoGrid from "../components/video/VideoGrid";
import { videoApi } from "../api/videoApi";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
        console.log("SEARCH QUERY:", searchQuery); 
      try {
        const res = await videoApi.getAllVideos(searchQuery);
        console.log("API URL:", res.config.url);
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
      <div className="px-6 py-4">

        {/* Search heading */}
        {searchQuery && (
          <h2 className="mb-4 text-lg font-semibold text-white">
            Results for "{searchQuery}"
          </h2>
        )}

        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
              <p className="text-gray-400">Loading videos...</p>
            </div>
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