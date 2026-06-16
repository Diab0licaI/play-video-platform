import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { videoApi } from "../api/videoApi";
import MainLayout from "../components/layout/MainLayout";

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await videoApi.getVideoById(videoId);
        const video = res.data.data;
        setTitle(video.title);
        setDescription(video.description);
        setPreview(video.thumbnail);
      } catch (error) {
        console.error("FETCH VIDEO ERROR:", error);
        setError("Video not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await videoApi.updateVideo(videoId, formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      setError("Failed to update video.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading video...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-6xl">😕</p>
            <p className="mt-4 text-gray-400">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-6">

        <h1 className="mb-6 text-2xl font-bold text-white">
          Edit Video
        </h1>

        <div className="space-y-5">

          {/* Title */}
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-[#272727] p-3 text-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full rounded-lg bg-[#272727] p-3 text-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Thumbnail
            </label>
            {preview && (
              <img
                src={preview}
                alt="thumbnail preview"
                className="mb-3 h-40 w-full rounded-lg object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full rounded-lg bg-[#272727] p-3 text-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default EditVideo;