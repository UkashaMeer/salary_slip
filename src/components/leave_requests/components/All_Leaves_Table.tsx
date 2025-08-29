import { AllLeavesDataProps, leavesDataProps } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = AllLeavesDataProps & {
    refreshLeaves: () => Promise<void>
}

export default function All_Leaves_Table({ leavesData, refreshLeaves }: Props) {

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState<leavesDataProps | null>(null)
    const [status, setStatus] = useState()
    const [leaveId, setLeaveId] = useState()
    const [rejectionReason, setRejectionReason] = useState()

    const HandleUpdateStatus = async () => {
        const res = await fetch(`https://ukashacoder.pythonanywhere.com/api/admin/leaves/${leaveId}/`, 
            {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    status: status,
                    rejection_reason: rejectionReason
                }) 
            }
        )
        if(res.ok){
            setDialogOpen(false)
            toast.success("Status Updated Successfully")
            await refreshLeaves()
        }
        else {
            throw new Error("Something went Wrong")
        }    
    }

    return (
        <>
            <Table className="rounded-sm overflow-hidden">
                <TableHeader className="bg-gray-300/50">
                    <TableRow>
                        <TableHead>Employee Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rejection Reason</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        leavesData.map((leave) => (
                            <TableRow key={leave.id}>
                                <TableCell className="font-medium">{leave.employee__id}</TableCell>
                                <TableCell className="font-medium">{leave.employee__name}</TableCell>
                                <TableCell className="font-medium">{leave.date}</TableCell>
                                <TableCell className="font-medium">{leave.reason}</TableCell>
                                <TableCell className="font-medium">{leave.email}</TableCell>
                                <TableCell className="font-medium">
                                    <span className={`px-2 py-1 rounded text-white text-xs ${leave.status == 'P' ? 'bg-yellow-600' : leave.status == 'R' ? 'bg-red-600' : 'bg-green-600'}`}>
                                        {leave.status == 'P' ? 'Pending' : leave.status == 'R' ? 'Reject' : 'Accepted'}
                                    </span>
                                </TableCell>
                                {
                                    leave.rejection_reason.split("").length > 0 ? (
                                        <TableCell className="font-medium">{leave.rejection_reason}</TableCell>
                                    ) : leave.status == "P" || leave.status == "A" ? (
                                        <TableCell className="font-medium">-</TableCell>
                                    ) : (
                                        <TableCell className="font-medium">No Reason Provided.</TableCell>
                                    )
                                }
                                <TableCell className="font-medium">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="outline-none">
                                            <MoreHorizontal size={18} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedLeave(leave)
                                                setStatus(leave.status)
                                                setLeaveId(leave?.id)
                                                setDialogOpen(true)
                                                setRejectionReason(leave?.rejection_reason)
                                            }}>
                                                Update Status
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Update Status</DialogTitle>
                    </DialogHeader>
                    {
                        selectedLeave && (
                            <Select
                                value={status}
                                onValueChange={(value) => setStatus(value)}
                            >
                                <SelectTrigger className="w-full border border-gray-300/60 shadow-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#141D38] focus:border-[#141D38]">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-lg border border-gray-200">
                                    <SelectGroup>
                                        <SelectLabel>Select Status</SelectLabel>
                                        <SelectItem value="P">Pending</SelectItem>
                                        <SelectItem value="A">Accepted</SelectItem>
                                        <SelectItem value="R">Rejected</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )
                    }
                    {
                        status == "R" && (
                            <textarea name="" id="" placeholder="Rejection Reason" className="border border-gray-300/60 rounded-lg px-3 py-2" onChange={(e) => setRejectionReason(e.target.value)} value={rejectionReason}></textarea>
                        )
                    }
                    <Button className="w-fit self-end" onClick={HandleUpdateStatus}>Update</Button>
                </DialogContent>
            </Dialog>
        </>
    )
}
