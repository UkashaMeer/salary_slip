'use client'

import { fetchGetAllTasks } from "@/components/tasks/api/fetch-get-all-tasks"
import TasksTable from "@/components/tasks/components/TasksTable"
import { TasksProps } from "@/components/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchEmployees } from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"

function Tasks() {

  const [openTask, setOpenTask] = useState(false)
  const [tasksData, setTasksData] = useState<TasksProps[]>([])
  const [Employees, setEmployees] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState()

  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [taskPriority, setTaskPriority] = useState<"C" | "H" | "M" | "L">("C")
  const [description, setDescription] = useState("")

  const handleFetchGetAllTasks = async () => {
    const res = await fetchGetAllTasks()
    setTasksData(res)
  }

  useEffect(() => {
    handleFetchGetAllTasks()
  }, [])

  const handleFetchEmployees = async () => {
    const res = await fetchEmployees()
    setEmployees(res)
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("https://ukashacoder.pythonanywhere.com/api/admin/create_task/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee__id: selectedEmployee,
          title: title,
          start_date: startDate,
          end_date: endDate,
          task_priority: taskPriority,
          description: description
        })
      }
    )
    if (res.ok) {
      toast.success("Task Created Successfully.")
      setOpenTask(false)
      await handleFetchGetAllTasks()
    }
  }

  const handleDeleteTask = async (taskid: number, setOpenDeletedConfirmModel) => {
    const res = await fetch(`https://ukashacoder.pythonanywhere.com/api/admin/delete_task/${taskid}/`, {
      method: "DELETE"
    })

    if (res.ok) {
      toast.success("Task Deleted Successfully.")
      setOpenDeletedConfirmModel(false)
      await handleFetchGetAllTasks()
    }

    const data = await res.json()
    console.log(data)
  }

  const handleUpdateTask = async (task, setOpenEditModel) => {
    const res = await fetch(`https://ukashacoder.pythonanywhere.com/api/admin/update_task/${task.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        start_date: task.start_date,
        end_date: task.end_date,
        task_priority: task.task_priority,
        description: task.description
      })
    })

    if (res.ok) {
      toast.success("Task Updated Successfully")
      setOpenEditModel(false)
      await handleFetchGetAllTasks()
    }
  }


  return (
    <section className="w-full bg-white rounded-lg p-6">
      <div className="w-full flex flex-col justify-between gap-4">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-medium">Tasks</h1>
          <Button className="bg-[#141D38] hover:bg-[#0f162e] text-white font-medium py-2 px-4 rounded-sm shadow-md transition-all disabled:opacity-50 cursor-pointer" onClick={() => { setOpenTask(true); handleFetchEmployees() }}>Create Task</Button>
        </div>
        <TasksTable tasksData={tasksData} handleDeleteTask={handleDeleteTask} handleUpdateTask={handleUpdateTask} />
        <Dialog onOpenChange={setOpenTask} open={openTask}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <form action="" className="flex flex-col gap-4" onSubmit={handleCreateTask}>
              <Select onValueChange={(value) => setSelectedEmployee(value)}>
                <SelectTrigger className="w-full border border-gray-300/60 shadow-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#141D38] focus:border-[#141D38]">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg border border-gray-200">
                  <SelectGroup>
                    <SelectLabel>Select Employee</SelectLabel>
                    {
                      Employees.map((employee, i) => (
                        <SelectItem key={i} value={employee.id.toString()}>{employee.name}</SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input type="text" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input type="datetime-local" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input type="datetime-local" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <Select
                value={taskPriority}
                onValueChange={(value) => setTaskPriority(value)}
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
              <textarea className="border-1 border-[#e1e1e1] py-2 px-3 shadow-xs rounded-md" name="" id="" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Task Details"></textarea>
              <Button className="bg-[#141D38] hover:bg-[#0f162e] text-white font-medium py-2 px-4 rounded-sm shadow-md transition-all disabled:opacity-50 cursor-pointer" type="submit">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

export default Tasks