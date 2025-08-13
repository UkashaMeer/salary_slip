import { useEffect, useState } from "react"

type Leave = {
    id: number;
    date: string;
    reason: string;
    email: string;
    status: string;
};

type LeaveTableProps = {
    handleLeave: (id: number, status: string) => void; // function ka type
};

export default function LeavesTable({handleLeave}: LeaveTableProps) {

    const [leavesData, setLeavesData] = useState([])

    useEffect(() => {
        const handleLeavesRequest = async () => {
            const employee_id = localStorage.getItem("employee_id")

            try {
                const res = await fetch(`https://ukashacoder.pythonanywhere.com/api/get_apply_leaves/${employee_id}/`,
                    {
                        method: "GET"
                    }
                )

                const data = await res.json()
                if (res.ok) {
                    console.log(data)
                    setLeavesData(data)
                } else {
                    console.log('data not fetched')
                }
            } catch (err) {
                console.log(err)
                alert(err)
            }
        }
        handleLeavesRequest()
    }, [handleLeave])


    return (
        <div className="overflow-x-auto mt-6">
            <table className="min-w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Reason</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leavesData.map((item: Leave, index: number) => (
                        <tr
                            key={item.id}
                            className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.reason}</td>
                            <td className="p-3">{item.email}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded text-white text-xs ${item.status === "A"
                                            ? "bg-green-500"
                                            : item.status === "P"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                >
                                    {item.status === "A"
                                        ? "Approved"
                                        : item.status === "P"
                                            ? "Pending"
                                            : "Rejected"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}
