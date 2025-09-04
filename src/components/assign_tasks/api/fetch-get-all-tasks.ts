export const fetchGetAllTasks = async () => {
    const res = await fetch('https://ukashacoder.pythonanywhere.com/api/admin/get_all_tasks/', {
        method: "GET"
    })

    return res.json()
}