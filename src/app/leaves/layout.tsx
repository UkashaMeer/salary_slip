import { SideBar } from "@/components/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function LeavesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <SidebarProvider>
            <main className="w-full min-h-screen flex gap-4 items-star justify-start bg-[#141D38] py-8 px-4">
                <SideBar />
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
  );
}
