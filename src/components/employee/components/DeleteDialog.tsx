import { DeleteDialogProps, ViewDialogProps } from "@/components/types"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DeleteDialog({openDeleteDialog, setOpenDeleteDialog, handleDelete, selectedUser} : DeleteDialogProps) {
    return (
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogContent>
                <DialogTitle>Delete Employee</DialogTitle>
                <span className="font-[600]">Are you sure you want to delete this employee: <span className="text-red-500">{selectedUser?.name}</span>?</span>
                <div className="flex items-center gap-2">
                    <button onClick={handleDelete} className="flex items-center justify-center bg-red-500 p-2 rounded-sm text-white text-sm font-light w-full">
                        Delete
                    </button>
                    <DialogClose className="w-full">
                        <button className="flex items-center justify-center bg-[#141D38] p-2 rounded-sm text-white text-sm font-light w-full">
                            Cancel
                        </button>
                    </DialogClose>
                </div>

            </DialogContent>
        </Dialog>
    )
}
