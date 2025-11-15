import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as domtoimage from 'dom-to-image-more'; 
import jsPDF from 'jspdf';
import type { MonthlyReport } from '../../Types/type'; 
import { getMyMonthlyReport } from '../../services/AttendanceService';
import AttendanceReportTable from '../AttendanceReportTable'; 

export const getMonthName = (month: number) => {
    const monthNames: { [key: number]: string } = {
        1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 
        7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
    }; 
    return monthNames[month] || 'Unknown month';
};

const EmployeeReportViewer: React.FC = () => {
  const { year, month } = useParams<{ year: string, month: string }>();
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  const reportYear = parseInt(year || '0', 10);
  const reportMonth = parseInt(month || '0', 10);

  useEffect(() => {
    if (reportYear && reportMonth) {
      const fetchReport = async () => {
        setIsLoading(true);
        try {
          const response = await getMyMonthlyReport(reportYear, reportMonth);
          setReport(response.data.report);
        } catch (error) {
          console.error("Error fetching employee report:", error);
          setReport(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReport();
    }
  }, [reportYear, reportMonth]);

 const downloadPdf = async () => {
    if (!report || !reportRef.current) {
        console.error("Report data is missing or table reference is null.");
        return; 
    }
    const input = reportRef.current as HTMLDivElement;
    const tableContainer = input.querySelector('.overflow-x-auto') as HTMLDivElement;
    
    if (!tableContainer) {
        console.warn("Table container '.overflow-x-auto' not found. Exporting static view.");
    }
    let originalOverflowX: string | undefined;
    let originalWidth: string | undefined;

    if (tableContainer) {
        originalOverflowX = tableContainer.style.overflowX;
        originalWidth = tableContainer.style.width;

        try {
            tableContainer.style.overflowX = 'visible';
            tableContainer.style.width = `${tableContainer.scrollWidth}px`;
            await new Promise(resolve => setTimeout(resolve, 50));
            
        } catch (e) {
            console.error("Error setting temporary styles:", e);
        }
    }
    try {
        const imgData = await domtoimage.toPng(input, {
            quality: 1.0, 
            bgcolor: '#ffffff', 
            style: {
                padding: '20px', 
            }
        });

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= -1) { 
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        const filename = `Attendance Report_${report.name}_${reportYear}_${reportMonth}.pdf`;
        pdf.save(filename);

    } catch (error: any) {
        console.error('oops, something went wrong while creating the PDF!', error);
    } finally {
        if (tableContainer && originalOverflowX !== undefined && originalWidth !== undefined) {
            tableContainer.style.overflowX = originalOverflowX;
            tableContainer.style.width = originalWidth;
        }
    }
};

  if (isLoading) {
    return <div className="p-8 text-center text-indigo-700">Loading monthly report {getMonthName(reportMonth)}...</div>;
  }

  if (!report) {
    return <div className="p-8 text-center text-red-600">Sorry, no records were found for this month.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Personal Attendance Report</h1>
      <p className="text-lg text-indigo-600 mb-6">
        For a month {getMonthName(reportMonth)} {reportYear} - employee: {report.name}
      </p>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPdf}
          disabled={isLoading || !report} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-md transition duration-200 disabled:opacity-50"
        >
          ⬇️ Download the report (PDF)
        </button>
      </div>

      <div ref={reportRef} className="p-4"> 
        <AttendanceReportTable report={report} />
      </div>
      
    </div>
  );
};

export default EmployeeReportViewer;