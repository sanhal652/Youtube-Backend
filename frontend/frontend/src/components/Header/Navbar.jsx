import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Bell, Upload, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import Logout from "../Logout";

export const Navbar = () => {
  const { status, userData } = useSelector(state => state.auth)
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">

      {/* 1. Logo */}
      <Link to="/" className="flex items-center gap-1 shrink-0">
        <div className="bg-red-600 text-white font-bold text-sm px-2 py-1 rounded">
          VT
        </div>
        <span className="text-xl font-bold text-gray-900 hidden sm:block">
          VideoTube
        </span>
      </Link>

      {/* 2. Search Bar */}
      <div className="flex items-center w-full max-w-md mx-4">
        <div className="flex items-center w-full border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full px-4 py-2 text-sm outline-none bg-transparent"
          />
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border-l border-gray-300 transition-colors">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 3. Right Side */}
      <div className="flex items-center gap-2 shrink-0">
        {status ? (
          // Logged in state
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/upload")}
              className="hidden sm:flex"
              title="Upload video"
            >
              <Upload className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Button>

            <Logout />

            {/* Avatar */}
            <button
              onClick={() => {
                if (userData?.username) {
                  navigate(`/channel/${userData.username}`);
                } else {
                  // Optional: show a toast or alert
                  console.warn("User data not loaded yet");
                }
              }}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
            >
              <img
                src={userData?.avatar}
                alt={userData?.username}
                className="w-full h-full object-cover"
              />
            </button>
          </>
        ) : (
          // Logged out state
          <>
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};