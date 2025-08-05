"use client"

import { useEffect, useState } from "react"
import Select, { SingleValue } from "react-select"

type OptionType = {
    value: string;
    label: string;
}

export const EmployeeNameSelect = () => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [selected, setSelected] = useState<OptionType | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try{
                const res = await fetch("https://ukashacoder.pythonanywhere.com/api/employees/")
                const data = await res.json()

                const formatted: OptionType[] = data.map((employee: any) => ({
                    value: employee.id.toString(),
                    label: employee.name,
                }))

                setOptions(formatted)

            }catch(err){
                alert("Error fetching Employees")
            }
        }

        fetchEmployees()
    }, [])

    const handleChange = (newValue: SingleValue<OptionType>) => {
        setSelected(newValue)
    }

    return(
        <Select 
            options={options}
            value={selected}
            onChange={handleChange}
            placeholder="Search Employee..."
            isSearchable
        />
    )
}