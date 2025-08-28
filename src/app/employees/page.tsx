"use client"

import { ChevronRight, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { EmployeeTables } from "@/components/employee/components/EmployeeTables";
import { useEffect, useState } from "react";
import { fetchEmployees } from "@/lib/api";
import { showToast } from "@/lib/showToast";

export default function Page(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [salary, setSalary] = useState("");
    const [phone, setPhone] = useState("");
    const [cnic, setCnic] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [openModel, setOpenModel] = useState<boolean>(false)
    const [employees, setEmployees] = useState<any[]>([]);

    const loadEmployees = async () => {
        const data = await fetchEmployees()
        setEmployees(data)
    }

    useEffect(() => {
        loadEmployees()
    }, [])

    const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
        name,
        email,
        salary,
        phone,
        cnic,
        address,
        password
    };

    try {
        const res = await fetch("https://ukashacoder.pythonanywhere.com/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
        showToast("Employee Created Successfully.")
        setOpenModel(false)

        console.log(data);
        setName("");
        setEmail("");
        setSalary("");
        setPhone("");
        setCnic("");
        setAddress("");
        setPassword("")

        await loadEmployees()
        } else {
        showToast(`${data.error} || Something went wrong!`)
        }
    } catch (error) {
        console.error("Error creating employee:", error);
        showToast("Failed To Create Employee.")
    }
    };


    return(
        <main className="w-full min-h-screen flex items-center justify-center bg-[#141D38] py-8 px-4">
            <section className="max-w-[1140px] w-full bg-white h-full p-6 rounded-lg mx-auto">
                
                {/* Title */}
                <h1 className="text-2xl font-semibold"><span className="text-[#141D38]">Invenzee</span> Employee Management</h1>
                
                {/* Search & Create Button */}
                <div className="flex items-center gap-2 w-full mt-4">
                    <div className="flex-1 flex items-center gap-2 border-1 border-solid border-[#ccc] rounded-sm p-2">
                        <Search strokeWidth={0.75} size='20px' />
                        <input type="input" placeholder="Search" className="w-full border-none outline-none text-sm" />
                    </div>
                    <Dialog open={openModel}  onOpenChange={setOpenModel} >
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-2 bg-[#141D38] p-2 rounded-sm text-white text-sm font-light">
                                <Plus strokeWidth={2} size='20px' />
                                Add New Employee
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add Employee Details</DialogTitle>
                            <form onSubmit={handleCreateEmployee} className="flex flex-col gap-2 w-full">
                            <Input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Name" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" />
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter Email" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" />
                            <Input value={salary} onChange={(e) => setSalary(e.target.value)} type="text" placeholder="Enter Salary" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" />
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Enter Phone" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" />
                            <Input value={cnic} onChange={(e) => setCnic(e.target.value)} type="text" placeholder="Enter CNIC" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" />
                            <Input value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="Enter Address" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" />
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Password" className="focus:!outline-none focus:!ring-0 rounded-sm border-[#ccc]" />
                             <button type="submit" className="flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light">
                                Add Employee
                                <ChevronRight strokeWidth={2} size='20px' />
                            </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Data Table */}
                <EmployeeTables employees={employees} reloadEmployees={loadEmployees} />

            </section>
        </main>
    )
}
