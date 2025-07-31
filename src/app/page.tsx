"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FormData {
  salary: string;
  absents: string;
  short_shift: string;
  late: string;
  half_day: string;
}

interface ApiResponse {
  message: string;
  data: {
    original_salary: number;
    salary_per_day: number;
    deduction_days: number;
    final_salary: number;
  };
}

const generatePDF = async (responseMsg: ApiResponse) => {
  const doc = new jsPDF();

  // Load Logo (public/logo.png)
  const logoUrl = "/logo-dark.png";
  const logoImg = await fetch(logoUrl)
    .then(res => res.blob())
    .then(blob => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    }));

  // Page width for centering
  const pageWidth = doc.internal.pageSize.getWidth();

  // 🔹 Add Logo (Left side)
  const logoWidth = 50;
  const logoHeight = 15;
  doc.addImage(logoImg, "PNG", 14, 10, logoWidth, logoHeight);

  // 🔹 Date (Right side)
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, 20);

  // 🔹 "Salary Slip" Title (Center, Bold, Bigger)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const titleText = "Salary Slip";
  const textWidth = doc.getTextWidth(titleText);
  const centerX = (pageWidth - textWidth) / 2;
  doc.text(titleText, centerX, 28);

  // Table
  autoTable(doc, {
    startY: 40,
    head: [["Description", "Amount"]],
    body: [
      ["Original Salary", `Rs ${responseMsg.data.original_salary.toLocaleString()}`],
      ["Salary Per Day", `Rs ${responseMsg.data.salary_per_day.toLocaleString()}`],
      ["Deduction Days", `${responseMsg.data.deduction_days}`],
      ["Final Salary", `Rs ${responseMsg.data.final_salary.toLocaleString()}`],
    ],
  });

  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is a system generated salary slip.",
    14,
    (doc as any).lastAutoTable.finalY + 10
  );

  // Save PDF
  doc.save(`salary-slip-${new Date().toISOString().split("T")[0]}.pdf`);
};


export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    salary: "",
    absents: "",
    short_shift: "",
    late: "",
    half_day: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<ApiResponse | null>(null);

  // Handle Input Change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
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
            salary: Number(formData.salary),
            absents: Number(formData.absents),
            short_shift: Number(formData.short_shift),
            late: Number(formData.late),
            half_day: Number(formData.half_day),
          }),
        }
      );

      const data: ApiResponse = await res.json();
      setResponseMsg(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#141D38] flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-[#141D38] flex flex-col items-center justify-center py-6 px-4">
          <img src="/logo.png" alt="Company Logo" className="w-[40%] h-16 object-contain" />
          <h1 className="text-white text-2xl font-bold mt-3">Salary Slip Form</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#141D38] focus:outline-none"
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#141D38] hover:bg-[#0f162e] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Generate Salary Slip"}
            </button>
          </div>
        </form>

        {/* API Response */}
        {responseMsg && (
          <div className="bg-gray-50 p-6 border-t">
            <p className="text-green-700 font-medium mb-4">{responseMsg.message}</p>
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
                    <td className="px-4 py-2 font-bold text-green-700">Final Salary</td>
                    <td className="px-4 py-2 text-right font-bold text-green-700">
                      Rs {responseMsg.data.final_salary.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={() => generatePDF(responseMsg)}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md"
            >
              Download Salary Slip PDF
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
