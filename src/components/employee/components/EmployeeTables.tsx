"use client"

import { useState } from "react";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { showToast } from "@/lib/showToast";
import { deleteEmployee, updateEmployee } from "@/lib/employeeApi";
import { useRouter } from "next/navigation";
import { Employee } from "../../types";
import EditDialog from "./EditDialog";
import useEditDialogState from "../hooks/useEditDialogState";
import ViewDialog from "./ViewDialog";
import DeleteDialog from "./DeleteDialog";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function EmployeeTables({ employees, reloadEmployees }: { employees: Employee[], reloadEmployees: () => void }) {

  const router = useRouter()
    
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null)
  
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewsDialog, setOpenViewDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  
  const editDialogState =  useEditDialogState()

  const handleEditClick = (user: Employee) => {
    setSelectedUser(user)
    editDialogState.setEditName(user.name)
    editDialogState.setEditEmail(user.email)
    editDialogState.setEditSalary(user.salary)
    editDialogState.setEditPhone(user.phone)
    editDialogState.setEditCnic(user.cnic)
    editDialogState.setEditAddress(user.address)
    setOpenEditDialog(true)
  }

  const handleUpdate = async () => {
    if (!selectedUser) return;

    const payload = {
      name: editDialogState.editName,
      email: editDialogState.editEmail,
      salary: editDialogState.editSalary,
      phone: editDialogState.editPhone,
      cnic: editDialogState.editCnic,
      address: editDialogState.editAddress
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
    <EditDialog openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} handleUpdate={handleUpdate}   {...editDialogState} />

    {/* View Dialog */}
    <ViewDialog openViewsDialog={openViewsDialog} setOpenViewDialog={setOpenViewDialog} selectedUser={selectedUser} />

    {/* Delete Dialog */}
    <DeleteDialog openDeleteDialog={openDeleteDialog} setOpenDeleteDialog={setOpenDeleteDialog} handleDelete={handleDelete} selectedUser={selectedUser} />

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
