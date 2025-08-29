export const fetchAllLeaves = async () => {
    const res = await fetch("https://ukashacoder.pythonanywhere.com/api/admin/leaves/", {
        method: "GET"
    })

    const data = await res.json()
    return data
}