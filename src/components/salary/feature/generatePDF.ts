import { ApiResponse } from "@/components/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = async (responseMsg: ApiResponse) => {
  const doc = new jsPDF();

  const logoUrl = "/logo-dark.png";
  const logoImg = await fetch(logoUrl)
    .then(res => res.blob())
    .then(blob => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    }));

  const pageWidth = doc.internal.pageSize.getWidth();

  const logoWidth = 50;
  const logoHeight = 15;
  doc.addImage(logoImg, "PNG", 14, 10, logoWidth, logoHeight);

  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, 20);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const titleText = "Salary Slip";
  const textWidth = doc.getTextWidth(titleText);
  const centerX = (pageWidth - textWidth) / 2;
  doc.text(titleText, centerX, 28);

  autoTable(doc, {
    startY: 40,
    head: [["Description", "Amount"]],
    body: [
      ["Name", `${responseMsg.data.employee_name}`],
      ["Original Salary", `Rs ${responseMsg.data.original_salary.toLocaleString()}`],
      ["Salary Per Day", `Rs ${responseMsg.data.salary_per_day.toLocaleString()}`],
      ["Deduction Days", `${responseMsg.data.deduction_days}`],
      ["Final Salary", `Rs ${responseMsg.data.final_salary.toLocaleString()}`],
    ],
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is a system generated salary slip.",
    14,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).lastAutoTable.finalY + 10
  );

  doc.save(`salary-slip-${new Date().toISOString().split("T")[0]}.pdf`);
};
