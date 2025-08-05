export async function fetchEmployees() {
  try {
    const res = await fetch("https://ukashacoder.pythonanywhere.com/api/employees/");
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }

    const data = await res.json();
    return data; // Employees array return karega
  } catch (error) {
    console.error("Error fetching employees:", error);
    return []; // Error aane par empty array return karega
  }
}
