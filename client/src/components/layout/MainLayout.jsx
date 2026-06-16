import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">

      {/* Header */}
      <Header />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>

      </div>
    </div>
  );
};

export default MainLayout;