"use client"
import LeavesTable from "@/components/LeavesTable"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function Leaves() {
    const [email, setEmail] = useState("ukashacoder@gmail.com")
    const [date, setDate] = useState("")
    const [reason, setReason] = useState("")
    const [openModel, setOpenModel] = useState(false)

    const handleApplyLeave = async (e: React.FormEvent) => {
        e.preventDefault()

        const employee_id = localStorage.getItem("employee_id")
        const access = localStorage.getItem("access")

        if (!employee_id) {
            alert("Employee ID not found in localStorage")
            return
        }

        const payload = {
            employee_id,
            email,
            date,
            reason
        }

        try {
            const res = await fetch('https://ukashacoder.pythonanywhere.com/api/apply_leave/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}` // agar JWT token chahiye
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            console.log(data)

            if (res.ok) {
                alert(data.message)
                setDate("")
                setReason("")
                setOpenModel(false)
            } else {
                alert(data.error || "Something went wrong")
            }
        } catch (error) {
            console.error(error)
            alert("Request failed")
        }
    }

    return (
        <section className="w-full bg-white rounded-lg p-6">
            <div className="flex items-center justify-between w-full">
                <h1 className="text-xl font-medium">Leaves</h1>
                <Dialog open={openModel} onOpenChange={setOpenModel}>
                    <DialogTrigger>
                        <button className="flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light">
                            <Plus size="18px" strokeWidth={1.8} className="mr-1" /> 
                            Add Leave
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleApplyLeave} className="flex flex-col justify-start gap-2">
                            <label>Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border border-black rounded-sm px-2 py-[2px]"
                            />

                            <label>Reason</label>
                            <textarea
                                rows={4}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="border border-black rounded-sm px-2 py-[2px]"
                            />

                            <label>HR Email</label>
                            <input
                                readOnly
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-black rounded-sm px-2 py-[2px]"
                            />

                            <button
                                type="submit"
                                className="bg-[#141D38] p-2 rounded-sm text-white text-sm font-light"
                            >
                                Submit
                            </button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <LeavesTable handleLeave={handleApplyLeave} />
        </section>
    )
}
