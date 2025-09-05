"use client"

import { fetchGetTasks } from '@/components/tasks/api/get-tasks'
import { TasksTable } from '@/components/tasks/components/TasksTable'
import React, { useEffect, useState } from 'react'

function Tasks() {

    const [tasksData, setTaskData] = useState<any[]>([])
    
    const handleFetchTasks = async () => {
        const data = await fetchGetTasks()
        setTaskData(data)
    }

    useEffect(() => {
        handleFetchTasks()
    }, [])

    return (
        <section className="w-full bg-white rounded-lg p-6">
            <div className="w-full flex flex-col justify-between gap-4">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-xl font-medium">Tasks</h1>
                </div>
                <TasksTable data={tasksData} onRefresh={handleFetchTasks} />
            </div>
        </section>
    )
}

export default Tasks