import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "../../ui/input"
import { ChevronRight } from "lucide-react"
import { EditDialogProps } from "../../types"

export default function EditDialog({
    openEditDialog,
    setOpenEditDialog,
    handleUpdate,
    editName,
    editEmail,
    editSalary,
    editPhone,
    editCnic,
    editAddress,
    setEditName,
    setEditEmail,
    setEditSalary,
    setEditPhone,
    setEditCnic,
    setEditAddress} : EditDialogProps) {
    return (
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <DialogContent>
                <DialogTitle>Update Employee</DialogTitle>
                <Input type="text" placeholder="Enter Name" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <Input type="email" placeholder="Enter Email" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                <Input type="text" placeholder="Enter Salary" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" value={editSalary} onChange={(e) => setEditSalary(e.target.value)} />
                <Input type="tel" placeholder="Enter Phone" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                <Input type="text" placeholder="Enter CNIC" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" value={editCnic} onChange={(e) => setEditCnic(e.target.value)} />
                <Input type="text" placeholder="Enter Address" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                <button onClick={handleUpdate} className="flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light">
                    Update Employee
                    <ChevronRight strokeWidth={2} size='20px' />
                </button>
            </DialogContent>
        </Dialog>
    )
}
