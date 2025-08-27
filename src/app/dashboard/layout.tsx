import ProtectedRoute from "@/components/ProtectedRoute";
import { SideBar } from "@/components/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
        <SidebarProvider>
            <main className="w-full min-h-screen flex gap-4 items-star justify-start bg-[#141D38] py-8 px-4">
                <SideBar />
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    </ProtectedRoute>
  );
}
