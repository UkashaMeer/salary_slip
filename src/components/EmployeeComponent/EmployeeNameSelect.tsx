"use client"

import { useEffect, useState } from "react"
import Select, { SingleValue } from "react-select"

type OptionType = {
    id: string; 
    value: string;
    label: string;
    salary: string;
}

export const EmployeeNameSelect = ({onSelectEmployee} : {onSelectEmployee: (employee: OptionType) => void}) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [selected, setSelected] = useState<OptionType | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try{
                const res = await fetch("https://ukashacoder.pythonanywhere.com/api/employees/")
                const data = await res.json()

                const formatted: OptionType[] = data.map((employee: {id: number, name: string, salary: string}) => ({
                    id: employee.id.toString(),
                    value: employee.id.toString(),
                    label: employee.name,
                    salary: employee.salary
                }))

                setOptions(formatted)

            }catch(err){
                alert("Error fetching Employees")
            }
        }

        fetchEmployees()
    }, [])

    const handleChange = (newValue: SingleValue<OptionType>) => {
        if (newValue){
            setSelected(newValue)
            onSelectEmployee(newValue)
        }
    }

    return(
        <Select 
            instanceId="employee-select"
            options={options}
            value={selected}
            onChange={handleChange}
            placeholder="Search Employee..."
            isSearchable
        />
    )
}