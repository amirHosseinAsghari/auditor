
import { Outlet } from "react-router-dom";
import Button from "@/components/button.tsx";
import {useLogout} from "@/api/auth/authMutations.ts";
import {useEffect, useRef, useState} from "react";

const Layout: React.FC = () => {

  const mainRef = useRef<HTMLDivElement>(null);
  const { mutate: logout, isLoading } = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const mainElement = mainRef.current;
    const handleScroll = () => {if (mainElement?.scrollTop && mainElement?.scrollTop > 50){
      setIsScrolled(true);
    }else {
      setIsScrolled(false);
    }};
    mainElement?.addEventListener("scroll", handleScroll);
    return () => mainElement?.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div  className="h-screen w-screen">
      <header
          className={`p-4 flex justify-between items-center transition-all duration-300 ${
              isScrolled
                  ? "bg-gray-100 shadow-md border-b border-gray-100"
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
      <main ref={mainRef} className="p-4 h-screen-minus-60 overflow-y-scroll scroll">
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;
