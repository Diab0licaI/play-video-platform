import { Routes, Route, Navigate } from "react-router-dom";
import UploadVideo from "../pages/UploadVideo";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import VideoDetail from "../pages/VideoDetail";
import ProtectedRoute from "./ProtectedRoute";
import Channel from "../pages/Channel";
import Subscribers from "../pages/Subscribers";
import EditVideo from "../pages/EditVideo";
import Subscriptions from "../pages/Subscriptions";
import Playlists from "../pages/Playlists";
import PlaylistDetail from "../pages/PlaylistDetail";
import Search from "../pages/Search";
import WatchHistory from "../pages/WatchHistory";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import LikedVideos from "../pages/LikedVideos";
import Notifications from "../pages/Notifications";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/channel/:username" element={<Channel />} />
      <Route path="/channel/:username/subscribers" element={<Subscribers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/videos/:videoId" element={<VideoDetail />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadVideo />
          </ProtectedRoute>
        }
      />
      <Route
         path="/videos/edit/:videoId"
         element={
           <ProtectedRoute>
              <EditVideo />
           </ProtectedRoute>
         }
       />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
       }
     />
      <Route
         path="/playlists"
         element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          }
        />
        <Route
         path="/playlist/:playlistId"
         element={
           <ProtectedRoute>
             <PlaylistDetail />
           </ProtectedRoute>
          }
        />
        <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
         </ProtectedRoute>
        }
       />
       <Route 
       path="/history" 
       element={
         <ProtectedRoute>
            <WatchHistory />
        </ProtectedRoute>
       } 
      />
      <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
         <Profile />
        </ProtectedRoute>
      } 
      />
      <Route
      path="/community"
      element={
       <ProtectedRoute>
         <Community />
       </ProtectedRoute>
      }
      />
      <Route
      path="/liked-videos"
      element={
        <ProtectedRoute>
           <LikedVideos />
        </ProtectedRoute>
    }
/>
     <Route 
     path="/notifications" 
     element={
     <ProtectedRoute>
       <Notifications />
    </ProtectedRoute>
    } 
    />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;