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
  const [uploadProgress, setUploadProgress] = useState(0);


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
      setUploadProgress(10);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      // Simulate progress increments while uploading
      const interval = setInterval(() => {
        setUploadProgress((p) => (p < 85 ? p + Math.random() * 8 : p));
      }, 400);

      await videoApi.uploadVideo(formData);

      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => navigate("/"), 600);
    } catch (error) {
      console.log(error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Upload video</h1>
          <p className="mt-1 text-sm text-gray-400">Share your content with the world</p>
        </div>

        <div className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Give your video a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full rounded-lg bg-[#272727] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-red-500"
              />
              <p className="mt-1 text-right text-xs text-gray-500">{title.length} / 100</p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                placeholder="Tell viewers what this video is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full resize-none rounded-lg bg-[#272727] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-red-500"
              />
              <p className="mt-1 text-right text-xs text-gray-500">{description.length} / 500</p>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Thumbnail <span className="text-red-500">*</span>
              </label>

              {thumbnailPreview ? (
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="aspect-video w-full object-cover"
                  />
                  <button
                    onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white transition hover:bg-black"
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-[#272727] transition hover:border-red-500 hover:bg-[#1f1f1f]">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-600/10 text-red-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-300">Click to upload thumbnail</p>
                  <p className="mt-1 text-xs text-gray-500">PNG or JPG · 16:9 ratio recommended</p>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                </label>
              )}
              <p className="mt-1.5 text-xs text-gray-500">
                A great thumbnail gets more clicks — use bright, high-contrast images.
              </p>
            </div>

            {/* Video File */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Video file <span className="text-red-500">*</span>
              </label>

              {videoFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-[#333] bg-[#1a1a1a] px-4 py-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{videoFile.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <label className="cursor-pointer text-xs font-medium text-red-400 hover:text-red-300">
                    Change
                    <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-600 bg-[#272727] px-4 py-8 transition hover:border-red-500 hover:bg-[#1f1f1f]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600/10 text-red-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-300">Click to select video</p>
                  <p className="text-xs text-gray-500">MP4, MOV, AVI · Up to 2 GB</p>
                  <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="hidden" />
                </label>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="rounded-xl bg-[#1a1a1a] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-red-500" />
                    <p className="text-sm text-gray-300">Uploading to Cloudinary…</p>
                  </div>
                  <p className="text-xs text-gray-400">{Math.round(uploadProgress)}%</p>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#333]">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="rounded-lg bg-red-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload video"}
              </button>
              <button
                onClick={() => navigate("/")}
                className="rounded-lg bg-[#272727] px-8 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
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
