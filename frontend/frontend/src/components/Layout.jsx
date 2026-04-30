import { Outlet } from "react-router-dom";
import { Navbar } from "./Header/Navbar";

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};