"use client"

import { EmployeeNameSelect } from "@/components/EmployeeComponent/EmployeeNameSelect";
import { generatePDF } from "@/components/salary/feature/generatePDF";
import { ApiResponse, FormData } from "@/components/types";
import { useState,  ChangeEvent, FormEvent } from "react";

function Salary() {
  const [formData, setFormData] = useState<FormData>({
    salary: "",
    absents: "",
    short_shift: "",
    late: "",
    half_day: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<ApiResponse | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/calculate-salary/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: formData.employee_id,
            salary: Number(formData.salary),
            absents: Number(formData.absents),
            short_shift: Number(formData.short_shift),
            late: Number(formData.late),
            half_day: Number(formData.half_day),
          }),
        }
      );

      const data: ApiResponse = await res.json();
      console.log(data)
      setResponseMsg(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#141D38] flex justify-center items-center py-12 p-4 max-[768px]:p-4">
      <div className="bg-white w-full rounded-xl shadow-lg overflow-hidden border-1 border-solid border-white">
        <div className="bg-[#141D38] flex flex-col items-center justify-center py-6 px-4 max-[768px]:p-2">
          <img src="/logo.png" alt="Company Logo" className="w-[40%] h-16 object-contain" />
          <h1 className="text-white text-2xl font-bold mt-3 max-[768px]:mb-3">Salary Slip Form</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-[768px]:p-2">
          <EmployeeNameSelect

            onSelectEmployee={(employee) => {
              setFormData((prev) => ({
                ...prev,
                employee_id: employee.id,
                salary: employee.salary
              }));
            }}
          />
          {(
            ["salary", "absents", "short_shift", "late", "half_day"] as const
          ).map((field) => (
            <div key={field}>
              <label className="block text-gray-800 font-medium mb-2 capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replace("_", " ")}`}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>
          ))}

          <div className="pt-4 max-[768px]:!py-2 ">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#141D38] hover:bg-[#0f162e] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Generate Salary Slip"}
            </button>
          </div>
        </form>

        {responseMsg && (
          <div className="bg-gray-50 p-6 border-t max-[768px]:p-2">
            <p className="text-[#141D38]-700 font-medium mb-4">{responseMsg.message}</p>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <table className="w-full text-sm text-gray-700">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Original Salary</td>
                    <td className="px-4 py-2 text-right">
                      Rs {responseMsg.data.original_salary.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Salary Per Day</td>
                    <td className="px-4 py-2 text-right">
                      Rs {responseMsg.data.salary_per_day.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Deduction Days</td>
                    <td className="px-4 py-2 text-right">
                      {responseMsg.data.deduction_days}
                    </td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-2 font-bold text-[#141D38]">Final Salary</td>
                    <td className="px-4 py-2 text-right font-bold text-[#141D38]">
                      Rs {responseMsg.data.final_salary.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => generatePDF(responseMsg)}
              className="mt-4 w-full bg-[#141D38] text-white py-2 px-4 rounded-lg shadow-md max-[768px]:mb-2"
            >
              Download Salary Slip PDF
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Salary