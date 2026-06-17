import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  PlayIcon,
  ClockIcon,
  UserIcon,
  Squares2X2Icon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Home", icon: HomeIcon, path: "/" },
  { name: "Subscriptions", icon: PlayIcon, path: "/subscriptions" },
  { name: "Community", icon: ChatBubbleLeftIcon, path: "/community" },
  { name: "History", icon: ClockIcon, path: "/history" },
  { name: "Liked", icon: HandThumbUpIcon, path: "/liked-videos" },
  { name: "Playlists", icon: Squares2X2Icon, path: "/playlists" },
  { name: "Profile", icon: UserIcon, path: "/profile" },
];

const bottomItems = [
  { name: "Dashboard", icon: ChartBarIcon, path: "/dashboard" },
  { name: "Upload", icon: ArrowUpTrayIcon, path: "/upload" },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-16 shrink-0 flex-col border-r border-white/10 bg-[#0f0f0f] lg:flex">
        <div className="flex flex-1 flex-col items-center gap-1 py-4">

          {menuItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/"}
              title={name}
              className={({ isActive }) =>
                `relative flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-xs transition-all duration-200
                ${isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:bg-white/5 hover:text-white hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-red-500" />
                  )}
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-[10px]">{name}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="my-2 w-8 border-t border-white/10" />

          {user && bottomItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              title={name}
              className={({ isActive }) =>
                `relative flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-xs transition-all duration-200
                ${isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:bg-white/5 hover:text-white hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-red-500" />
                  )}
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-[10px]">{name}</span>
                </>
              )}
            </NavLink>
          ))}

        </div>

        {/* Avatar at bottom */}
        {user && (
          <div className="flex justify-center border-t border-white/10 py-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 transition-transform hover:scale-105"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                {user.fullName?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/10 bg-[#0f0f0f] px-2 py-2 lg:hidden">
        {menuItems.slice(0, 5).map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors
              ${isActive ? "text-white" : "text-gray-500"}`
            }
          >
            <Icon className="h-6 w-6" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;