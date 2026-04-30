import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      {/* 1. VideoTube Logo */}
      <Link to="/" className="text-2xl font-bold text-red-600">
        VideoTube
      </Link>

      {/* 2. Search Bar */}
      <div className="w-1/3">
        <input 
          type="text" 
          placeholder="Search videos..." 
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* 3. Authentication Buttons */}
      <div className="flex gap-3">
        <Link to="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link to="/signup">
          <Button>Signup</Button>
        </Link>
      </div>
    </nav>
  );
};