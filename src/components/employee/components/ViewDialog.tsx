import { ViewDialogProps } from "@/components/types"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronRight } from "lucide-react"

export default function ViewDialog({openViewsDialog, setOpenViewDialog, selectedUser} : ViewDialogProps) {
    return (
        <Dialog open={openViewsDialog} onOpenChange={setOpenViewDialog}>
            <DialogContent>
                <DialogTitle>View Employee</DialogTitle>
                <ul>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px" />Name: {selectedUser?.name}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px" />Email: {selectedUser?.email}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px" />Salary: {selectedUser?.salary}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px" />Phone: {selectedUser?.phone}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px" />CNIC: {selectedUser?.cnic}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px" />Address: {selectedUser?.address}</li>
                </ul>
                <DialogClose>
                    <button className="flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light w-auto">
                        Close
                    </button>
                </DialogClose>

            </DialogContent>
        </Dialog>
    )
}
