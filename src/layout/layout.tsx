import { useLogout } from "@/api/auth/authMutations";
import Button from "@/components/button";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const { mutate: logout, isLoading } = useLogout();
  return (
    <div className="h-screen w-screen">
      <header className="p-4 bg-white text-black flex justify-between items-center">
        <h1 className="text-xl">آپا</h1>
        <div className="flex justify-center items-center gap-6">
          <div>image</div>
          <Button
            type="button"
            label={"خروج از حساب کاربری"}
            loading={isLoading}
            variant="primary"
            onClick={async () => logout()}
          />{" "}
        </div>
      </header>
      <main className="p-4 h-screen-minus-60 overflow-y-scroll scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
