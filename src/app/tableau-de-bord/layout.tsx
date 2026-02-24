import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
