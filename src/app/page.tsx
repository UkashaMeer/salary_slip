"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter()
  const [loading, isLoading] = useState<boolean>(true)

  useEffect(() => {
    const access = localStorage.getItem("access")
    const role = localStorage.getItem("role")

    if (access) {
      if(role === "admin"){
          router.replace('/employees')
      }else{
          router.replace('/dashboard')
      }
    } else {
      router.replace('/auth')
    }

    isLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full h-screen">
        <Loader className="size-12 text-black animate-spin" />
        <h2 className="text-lg">Loading...</h2>
      </div>
    )
  }

  return null
}
