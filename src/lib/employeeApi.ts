export async function updateEmployee(id: string, payload: any) {
    const res = await fetch(
        `https://ukashacoder.pythonanywhere.com/api/employees/update/${id}/`,
        {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload)
        }
    )

    return res
}

export async function deleteEmployee(id: string){
    const res = await fetch(
        `https://ukashacoder.pythonanywhere.com/api/employees/delete/${id}/`,
        {
          method: "DELETE",
        }
    );

    return res
}