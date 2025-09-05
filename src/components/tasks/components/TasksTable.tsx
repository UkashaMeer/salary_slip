"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowDown, ArrowUp } from "lucide-react"
import { toast } from "sonner"
import { fetchGetTasks } from "../api/get-tasks"
import TimerCell, { formatTimeInSeconds } from "./TaskTimer"

type Task = {
    id: number
    employee__name: string
    title: string
    start_date: string
    end_date: string
    task_priority: "C" | "H" | "M" | "L"
    status: "NS" | "IP" | "OH" | "CP" | "CN" | "" | string
    description: string
    total_time_hours: string
    total_time_seconds: string | number
}

const PRIORITY_LABELS: Record<Task["task_priority"], string> = {
    C: "Critical",
    H: "High",
    M: "Medium",
    L: "Low",
}

const STATUS_LABELS: Record<Task["status"], string> = {
    NS: "Not Started",
    IP: "In Progress",
    OH: "On Hold",
    CP: "Completed",
}

const priorityColors: Record<Task["task_priority"], string> = {
    C: "bg-red-600",
    H: "bg-orange-500",
    M: "bg-yellow-500",
    L: "bg-green-500",
}

const statusColors: Record<Task["status"], string> = {
    NS: "bg-gray-400",
    IP: "bg-blue-500",
    OH: "bg-purple-500",
    CP: "bg-green-600",
    CN: "bg-red-700",
}

export function TasksTable({ data, onRefresh }: { data: Task[], onRefresh: () => void }) {
    const [sorting, setSorting] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const columns: ColumnDef<Task>[] = [
        {
            accessorKey: "id",
            header: "Task Id",
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "start_date",
            header: "Start Date",
            cell: ({ row }) =>
                new Date(row.original.start_date).toLocaleString(),
        },
        {
            accessorKey: "end_date",
            header: "End Date",
            cell: ({ row }) =>
                new Date(row.original.end_date).toLocaleString(),
        },
        {
            accessorKey: "task_priority",
            header: "Priority",
            cell: ({ row }) => (
                <Badge className={`${priorityColors[row.original.task_priority]} text-white`}>
                    {PRIORITY_LABELS[row.original.task_priority]}
                </Badge>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const [status, setStatus] = React.useState(row.original.status || "NS")

                const handleUpdateTaskStatus = async (value: string) => {

                    setStatus(value)

                    const res = await fetch(`https://ukashacoder.pythonanywhere.com/api/update_task_status/${row.original.id}/`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "task_status": value
                        })
                    })

                    if (res.ok) {
                        toast.success("Task Status Updated Successfully.")
                        onRefresh()
                    }
                }

                return (
                    <div className="flex items-center gap-2 relative">
                        <Select
                            defaultValue={status}
                            value={status}
                            onValueChange={handleUpdateTaskStatus}
                        >
                            <SelectTrigger
                                iconClassName="text-white"
                                className={`w-auto px-2 py-[4px] text-xs rounded-md leading-0 !h-auto ${statusColors[status]} text-white cursor-pointer`}
                            >
                                {STATUS_LABELS[status]}
                            </SelectTrigger>
                            {status !== "CP" ? <SelectContent>
                                {Object.entries(STATUS_LABELS).filter(([key]) => key !== "NS").map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent> : 
                            <span></span>
                            }
                        </Select>

                    </div>
                )
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {

                const [openDescriptionModel, setOpenDescriptionModel] = React.useState(false)

                return (
                    <>
                        <Badge className="cursor-pointer py-[4px]" onClick={() => setOpenDescriptionModel(true)}>View Description</Badge>
                        <Dialog open={openDescriptionModel} onOpenChange={setOpenDescriptionModel}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>View Description</DialogTitle>
                                </DialogHeader>
                                {row.original.description}
                            </DialogContent>
                        </Dialog>
                    </>
                )
            }
        },
        {
            accessorKey: "total_time_seconds",
            header: "Total Working Hours",
            cell: ({ row }) => {
                const rawSeconds = row.original.total_time_seconds;
                const parsedSeconds = rawSeconds ? Math.floor(Number(rawSeconds)) : 0;

                return row.original.status == "CP" || row.original.status == "OH" ? (
                    <h1>{formatTimeInSeconds(parsedSeconds)}</h1>
                ) : (
                    <TimerCell
                        taskId={row.original.id}
                        status={row.original.status}
                        total_time_seconds={parsedSeconds}
                    />
                );
            }

        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search tasks..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full"
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: <ArrowUp size={14} className="ml-1 inline-block" />,
                                            desc: <ArrowDown size={14} className="ml-1 inline-block" />,
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
        </div>
    )
}
