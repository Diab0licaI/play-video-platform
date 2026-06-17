import { motion } from "framer-motion";
import VideoCard from "./VideoCard";

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const VideoGrid = ({ videos }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </motion.div>
  );
};

export default VideoGrid;