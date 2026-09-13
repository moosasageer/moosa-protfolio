import Sidebar from "@/components/admin/Sidebar";
import MobileTopbar from "@/components/admin/MobileTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <MobileTopbar />
        <main className="p-5 md:p-10 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
