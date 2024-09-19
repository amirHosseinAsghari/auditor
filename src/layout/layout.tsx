import { useState, useEffect } from "react";
import { useLogout } from "@/api/auth/authMutations";
import Button from "@/components/button";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const { mutate: logout, isLoading } = useLogout();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-screen w-screen">
      <header
        className={`p-4 flex justify-between items-center transition-all duration-300 ${
          isScrolled
            ? "bg-gray-300 shadow-md border-b border-gray-400"
            : "bg-white"
        }`}
      >
        <h1 className="text-xl">آپا</h1>
        <div className="flex justify-center items-center gap-6">
          <Button
            type="button"
            label={"خروج از حساب کاربری"}
            loading={isLoading}
            variant="primary"
            onClick={async () => logout()}
          />
        </div>
      </header>
      <main className="p-4 h-screen-minus-60 overflow-y-scroll scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
