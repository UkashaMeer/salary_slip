"use client"

import { fetchAllLeaves } from "@/components/leave_requests/api/fetch_all_leaves"
import All_Leaves_Table from "@/components/leave_requests/components/All_Leaves_Table"
import { leavesDataProps } from "@/components/types"
import { useEffect, useState } from "react"

export default function LeaveRequests() {
  const [leavesData, setLeavesData] = useState<leavesDataProps[]>([])

  const getLeaves = async () => {
    const res = await fetchAllLeaves()
    setLeavesData(res)
  }
  useEffect(() => {
    getLeaves()
  }, [])
  return (
    <section className="w-full bg-white rounded-lg p-6">
      <div className="w-full flex flex-col justify-between gap-4">
        <h1 className="text-xl font-medium">Leaves</h1>
        <All_Leaves_Table leavesData={leavesData} refreshLeaves={getLeaves} />
      </div>
    </section>
  )
}
