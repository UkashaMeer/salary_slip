export const fetchGetTasks = async () => {
    const employee_id = localStorage.getItem("employee_id")
    const res = await fetch(`https://ukashacoder.pythonanywhere.com/api/admin/get_all_tasks/?employee_id=${employee_id}`, {
        method: 'GET'
    })

    return res.json()
}