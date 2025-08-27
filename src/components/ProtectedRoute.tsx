"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (!access) {
      router.replace("/auth"); // agar access token nahi hai -> auth par bhej do
    } else {
      setLoading(false); // agar login hai -> allow
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full h-screen">
        <Loader className="size-12 text-black animate-spin" />
        <h2 className="text-lg">Loading...</h2>
      </div>
    );
  }

  return <>{children}</>;
}
