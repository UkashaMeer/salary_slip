"use client"

import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { showToast } from "@/lib/showToast";
import { deleteEmployee, updateEmployee } from "@/lib/employeeApi";
import { useRouter } from "next/navigation";

export type Employee = {
  id: string
  name: string
  email: string
  salary: string
  phone: string
  cnic: string
  address: string
}

export function EmployeeTables({ employees, reloadEmployees }: { employees: Employee[], reloadEmployees: () => void }) {

  const router = useRouter()
    
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null)
  
  // Dialog State 
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewsDialog, setOpenViewDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  
  // Edit Employee State
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editSalary, setEditSalary] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editCnic, setEditCnic] = useState("")
  const [editAddress, setEditAddress] = useState("")

  const handleEditClick = (user: Employee) => {
    setSelectedUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditSalary(user.salary)
    setEditPhone(user.phone)
    setEditCnic(user.cnic)
    setEditAddress(user.address)
    setOpenEditDialog(true)
  }

  const handleUpdate = async () => {
    if (!selectedUser) return;

    const payload = {
      name: editName,
      email: editEmail,
      salary: editSalary,
      phone: editPhone,
      cnic: editCnic,
      address: editAddress
    }

    try{
      const res = await updateEmployee(selectedUser.id, payload)

      if(res.ok){
        showToast("Employee Updated Successfully.")
        setOpenEditDialog(false)
        reloadEmployees()
      }else{
        showToast("Failed to Updated Employee.")
      }

    }catch (err) {
      console.error("Update error: ", err)
      showToast("Error In Updating Employee.")
    }
  }

  // Delete Employee Function
   const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const res = await deleteEmployee(selectedUser.id)

      if (res.ok) {
        showToast("Employee Deleted Successfully.")
        setOpenDeleteDialog(false);
        reloadEmployees();
      } else {
        showToast("Failed To Delete Employee.")
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      showToast("Error In Deleting Employee.")
    }
  };

  const columns: ColumnDef<Employee>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "id", header: "ID", cell: ({ row }) => <div>{row.getValue("id")}</div> },
    { accessorKey: "name", header: "Name", cell: ({ row }) => <div>{row.getValue("name")}</div> },
    { accessorKey: "email", header: "Email", cell: ({ row }) => <div>{row.getValue("email")}</div> },
    { accessorKey: "salary", header: "Salary", cell: ({ row }) => <div>{row.getValue("salary")}</div> },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => <div>{row.getValue("phone")}</div> },
    { accessorKey: "cnic", header: "CNIC", cell: ({ row }) => <div>{row.getValue("cnic")}</div> },
    { accessorKey: "address", header: "Address", cell: ({ row }) => <div>{row.getValue("address")}</div> },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  handleEditClick(user)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setSelectedUser(user)
                  setOpenViewDialog(true)
                }}
              >
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  router.replace(`/attendance/${user?.id}`)
                }}
              >
                View Attendance
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500"
                onSelect={(e) => {
                  e.preventDefault()
                  setSelectedUser(user)
                  setOpenDeleteDialog(true)
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: employees,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  return (
    <div className="w-full overflow-hidden">

    {/* Edit Dialog */}
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

    {/* View Dialog */}
        <Dialog open={openViewsDialog} onOpenChange={setOpenViewDialog}>
            <DialogContent>
            <DialogTitle>View Employee</DialogTitle>
                <ul>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px"/>Name: {selectedUser?.name}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px"/>Email: {selectedUser?.email}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px"/>Salary: {selectedUser?.salary}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px"/>Phone: {selectedUser?.phone}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px"/>CNIC: {selectedUser?.cnic}</li>
                    <li className="text-[16px] flex items-center"><ChevronRight strokeWidth={2} size="16px"/>Address: {selectedUser?.address}</li>
                </ul>
                <DialogClose>
                    <button className="flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light w-auto">
                        Close
                    </button>
                </DialogClose>

            </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
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

      <div className="overflow-x-auto rounded-md border w-full mt-4 mx-auto">
        <Table className="overflow-x-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-normal break-words max-w-xs">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
