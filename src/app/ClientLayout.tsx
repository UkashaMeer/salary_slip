"use client";

import { Spinner } from "@heroui/spinner"
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const publicRoutes = ["/", "/auth/login", "/auth/signup"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const cleanPath = pathname.split("?")[0].replace(/\/$/, "");

    if (!publicRoutes.includes(cleanPath)) {
      const accessKey = localStorage.getItem("access");
      const employeeId = localStorage.getItem("employee_id");

      if (!accessKey || !employeeId) {
        router.replace("/auth/login");
        return;
      }
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#141D38]">
        <Spinner color="primary" />
    </div>;
  }

  return children;
}
