import { AllTasksProps } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatTime } from "@/lib/formatTime";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function TasksTable({ tasksData, handleDeleteTask, handleUpdateTask }: AllTasksProps) {

    const [openEditModel, setOpenEditModel] = useState(false) 
    const [openDeletedConfirmModel ,setOpenDeletedConfirmModel] = useState(false)
    const [openViewModel , setOpenViewModel] = useState(false)
    const [selectedTask, setSelectedTask] = useState({
        id: "",
        title: "",
        start_date: "",
        end_date: "",
        task_priority: "",
        description: ""
    })
    
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee Id</TableHead>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Task Priority</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(tasksData) && tasksData.length > 0 ? (
                        tasksData.map((task, i) => (
                            <TableRow key={i} className="">
                                <TableCell className="whitespace-normal break-words mx-auto">{task.employee__id}</TableCell>
                                <TableCell className="whitespace-normal break-words mx-auto">{task.employee__name}</TableCell>
                                <TableCell className="whitespace-normal break-words mx-auto">{task.title}</TableCell>
                                <TableCell className="whitespace-normal break-words mx-auto">{new Date(task.start_date).toLocaleTimeString() + ' - ' + new Date(task.start_date).toLocaleDateString()}</TableCell>
                                <TableCell className="whitespace-normal break-words mx-auto">{new Date(task.end_date).toLocaleTimeString() + ' - ' + new Date(task.end_date).toLocaleDateString()}</TableCell>
                                <TableCell className={`whitespace-normal break-words mx-auto`}>
                                    <span className={` ${task.task_priority == "C" ? "bg-red-500" : task.task_priority == "H" ? "bg-orange-500" : task.task_priority == "M" ? 'bg-blue-500' : task.task_priority ? "bg-green-500" : ""} px-2 py-1 rounded-sm text-white`}>
                                        {
                                            task.task_priority == "C" ? "Critical" :
                                                task.task_priority == "H" ? "High" :
                                                    task.task_priority == "M" ? "Medium" :
                                                        task.task_priority == "L" ? "Low" : ""
                                        }
                                    </span>
                                </TableCell>
                                <TableCell className="whitespace-normal break-words mx-auto">
                                    <Dialog>
                                        <DialogTrigger>
                                            <Button className="bg-[#141D38] hover:bg-[#0f162e] px-2 py-0 rounded-sm leading-0 cursor-pointer">View Description</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Description</DialogTitle>
                                                <p>{task.description}</p>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="cursor-pointer">
                                            <MoreHorizontal size={18} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="bottom" align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => {
                                                setOpenEditModel(true);
                                                setSelectedTask({
                                                    id: task.id,
                                                    title: task.title,
                                                    start_date: task.start_date,
                                                    end_date: task.end_date,
                                                    task_priority: task.task_priority,
                                                    description: task.description
                                                })
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(() => {
                                                setOpenViewModel(true);
                                                setSelectedTask({
                                                    id: task.id,
                                                    title: task.title,
                                                    start_date: task.start_date,
                                                    end_date: task.end_date,
                                                    task_priority: task.task_priority,
                                                    description: task.description
                                                })
                                            })}>
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {setOpenDeletedConfirmModel(true); setSelectedTask({...selectedTask, id: task.id})}} className="text-red-500">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <p>No Tasks Found</p>
                    )}
                </TableBody>
            </Table>
            <Dialog open={openEditModel} onOpenChange={setOpenEditModel}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Task</DialogTitle>
                    </DialogHeader>
                    <form action="" className="flex flex-col gap-4" onSubmit={(e) => {e.preventDefault(); handleUpdateTask(selectedTask, setOpenEditModel)}}>
                        <Input type="text" placeholder="Enter Title" value={selectedTask.title} onChange={(e) => setSelectedTask({...selectedTask ,title: e.target.value})} />
                        <Input type="datetime-local" placeholder="Start Date" value={formatTime(selectedTask.start_date)} onChange={(e) => setSelectedTask({...selectedTask, start_date: e.target.value})} />
                        <Input type="datetime-local" placeholder="End Date" value={formatTime(selectedTask.end_date)} onChange={(e) => setSelectedTask({...selectedTask, end_date: e.target.value})} />
                        <Select
                            value={selectedTask.task_priority}
                            onValueChange={(value) => setSelectedTask({...selectedTask, task_priority: value})}
                        >
                            <SelectTrigger className="w-full border border-gray-300/60 shadow-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#141D38] focus:border-[#141D38]">
                                <SelectValue placeholder="Select Task Priority" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg border border-gray-200">
                                <SelectGroup>
                                    <SelectLabel>Select Task Priority</SelectLabel>
                                    <SelectItem value="C">Critical</SelectItem>
                                    <SelectItem value="H">High</SelectItem>
                                    <SelectItem value="M">Medium</SelectItem>
                                    <SelectItem value="L">Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <textarea className="border-1 border-[#e1e1e1] py-2 px-3 shadow-xs rounded-md" name="" id="" rows={5} value={selectedTask.description} onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})} placeholder="Enter Task Details"></textarea>
                        <Button className="bg-[#141D38] hover:bg-[#0f162e] text-white font-medium py-2 px-4 rounded-sm shadow-md transition-all disabled:opacity-50 cursor-pointer" type="submit">Update Task</Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={openDeletedConfirmModel} onOpenChange={setOpenDeletedConfirmModel}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                    </DialogHeader>
                    <p>Are You sure you want to delete this task.</p>
                    <Button className="bg-red-500 text-white font-medium py-2 px-4 rounded-sm shadow-md transition-all disabled:opacity-50 cursor-pointer" onClick={() => handleDeleteTask(selectedTask.id, setOpenDeletedConfirmModel)}>Delete Task</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={openViewModel} onOpenChange={setOpenViewModel}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Task Details</DialogTitle>
                    </DialogHeader>
                    <ul>
                        <li><span className="font-semibold">Title: </span>{selectedTask.title}</li>
                        <li><span className="font-semibold">Start Date:</span> {selectedTask.start_date}</li>
                        <li><span className="font-semibold">End Date:</span> {selectedTask.end_date}</li>
                        <li><span className="font-semibold">Task Priority:</span> {selectedTask.task_priority}</li>
                        <li><span className="font-semibold">Description: </span>{selectedTask.description}</li>
                    </ul>
                </DialogContent>
            </Dialog>
        </>
    )
}
