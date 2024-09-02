import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="h-screen w-screen">
      <header className="p-4 bg-white text-black flex justify-between items-center">
        <h1 className="text-xl">آپا</h1>
        <div>image</div>
      </header>
      <main className="p-4 h-screen-minus-60 overflow-y-scroll scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
