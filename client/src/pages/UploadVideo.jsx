import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { videoApi } from "../api/videoApi";
import MainLayout from "../components/layout/MainLayout";

const UploadVideo = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required");
    if (!videoFile) return alert("Video file is required");
    if (!thumbnail) return alert("Thumbnail is required");

    try {
      setUploading(true);
      setProgress("Uploading to Cloudinary...");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      await videoApi.uploadVideo(formData);

      setProgress("Done!");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      setProgress("");
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Upload Video</h1>
          <p className="mt-1 text-sm text-gray-400">
            Share your video with the world
          </p>
        </div>

        <div className="space-y-5">

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Give your video a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-[#272727] px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Tell viewers about your video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full rounded-lg bg-[#272727] px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Thumbnail <span className="text-red-500">*</span>
            </label>

            {thumbnailPreview ? (
              <div className="relative mb-3 overflow-hidden rounded-lg">
                <img
                  src={thumbnailPreview}
                  alt="thumbnail preview"
                  className="aspect-video w-full object-cover"
                />
                <button
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview(null);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-[#272727] hover:border-red-500 hover:bg-[#1f1f1f] transition">
                <svg className="mb-2 h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-400">Click to upload thumbnail</p>
                <p className="mt-1 text-xs text-gray-600">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Video File */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Video File <span className="text-red-500">*</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-600 bg-[#272727] px-4 py-4 hover:border-red-500 hover:bg-[#1f1f1f] transition">
              <svg className="h-8 w-8 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <div>
                <p className="text-sm text-gray-300">
                  {videoFile ? videoFile.name : "Click to select video file"}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  MP4, MOV, AVI supported
                </p>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {/* Progress */}
          {uploading && (
            <div className="rounded-lg bg-[#272727] p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-red-500" />
                <p className="text-sm text-gray-300">{progress}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="rounded-lg bg-red-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-lg bg-[#272727] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#3a3a3a] transition"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default UploadVideo;