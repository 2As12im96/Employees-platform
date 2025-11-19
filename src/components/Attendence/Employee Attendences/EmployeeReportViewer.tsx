import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import * as domToImage from 'dom-to-image-more'; 
import type { ArchiveItem, MonthlyReport } from "../../Types/type";
import { getAttendanceArchive, getMyMonthlyReport } from "../../services/AttendanceService";
import AttendanceReportTable from "../AttendanceReportTable";

const getMonthName = (m: number) => {
    const date = new Date(2000, m - 1, 1);
    return format(date, 'MMMM');
};

const EmployeeReportViewer: React.FC = () => {
    const { year, month } = useParams<{ year: string, month: string }>();
    const navigate = useNavigate();
    
    const printRef = useRef<HTMLDivElement>(null); 
    
    const [report, setReport] = useState<MonthlyReport | null>(null);
    const [archive, setArchive] = useState<ArchiveItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentYear = parseInt(year || new Date().getFullYear().toString(), 10); 
    const currentMonth = parseInt(month || (new Date().getMonth() + 1).toString(), 10);

    const exportPdf = async () => {
        const targetElement = printRef.current;
        if (!targetElement || !report) return;

        const exportButton = targetElement.querySelector('.export-button') as HTMLElement | null;
        const tableContainer = targetElement.querySelector('.daily-attendance-container') as HTMLElement | null;
        
        const originalOverflowX = targetElement.style.overflowX;
        const originalOverflowY = targetElement.style.overflowY; 
        const originalWidth = targetElement.style.width;
        const originalPaddingBottom = targetElement.style.paddingBottom; 
        const originalTableOverflow = tableContainer?.style.overflowX;

        try {
            if (exportButton) exportButton.style.display = 'none';
            if (tableContainer) tableContainer.style.overflow = 'visible';

            targetElement.style.overflowX = 'visible';
            targetElement.style.overflowY = 'visible';
            targetElement.style.width = `${targetElement.scrollWidth}px`; 
            targetElement.style.paddingBottom = '50px'; 
            
            await new Promise(resolve => setTimeout(resolve, 50));

            const actualWidth = targetElement.scrollWidth;
            const actualHeight = targetElement.scrollHeight; 

            const dataUrl = await domToImage.toJpeg(targetElement, { 
                quality: 0.95, 
                width: actualWidth, 
                height: actualHeight,
                bgcolor: '#ffffff' 
            });

            targetElement.style.overflowX = originalOverflowX;
            targetElement.style.overflowY = originalOverflowY; 
            targetElement.style.width = originalWidth;
            targetElement.style.paddingBottom = originalPaddingBottom; 
            if (exportButton) exportButton.style.display = 'flex';
            if (tableContainer && originalTableOverflow) tableContainer.style.overflowX = originalTableOverflow;

            const pdf = new jsPDF('l', 'mm', 'a4'); 
            const pdfWidth = pdf.internal.pageSize.getWidth();
            
            const imgWidth = pdfWidth; 
            const imgHeight = (actualHeight * imgWidth) / actualWidth; 
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
            
            while (heightLeft >= -1) { 
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            const employeeNameForFile = report.name.replace(/\s+/g, '_') || `Employee_Report`;
            const filename = `${employeeNameForFile}_Monthly_Report_${getMonthName(currentMonth)}_${currentYear}.pdf`;
            pdf.save(filename);
            
        } catch (error) {
            console.error("PDF export failed:", error);

            if (targetElement) { 
                targetElement.style.overflowX = originalOverflowX;
                targetElement.style.overflowY = originalOverflowY; 
                targetElement.style.width = originalWidth;
                targetElement.style.paddingBottom = originalPaddingBottom;
                if (exportButton) exportButton.style.display = 'flex';
                if (tableContainer && originalTableOverflow) tableContainer.style.overflowX = originalTableOverflow;
            }
            setError("Failed to create PDF file. Ensure all styles are loaded correctly try again.");
        }
    };


    useEffect(() => {
        
        const fetchArchive = async () => {
             try {
                 const res = await getAttendanceArchive('employee'); 
                 setArchive(res.data.archive);
            } catch (err: any) {
                 console.error("Failed to retrieve the archive :", err);
            }
        };

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getMyMonthlyReport(currentYear, currentMonth); 
                setReport(res.data.report);
            } catch (err: any) {
                setError(`Failed to bring the report for the month ${currentMonth}/${currentYear}: ` + (err.response?.data?.message || err.message));
                setReport(null);
            } finally {
                setLoading(false);
            }
        };

        fetchArchive();
        fetchReport();
    }, [currentYear, currentMonth]);

    const handleArchiveNavigation = (newYear: number, newMonth: number) => {
        navigate(`/employee-dashboard/attendence-report/${newYear}/${newMonth}`); 
    };

    

    if (loading) return <p className="text-center mt-10 text-lg">Loading employee report...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="p-6">
            
            <div className="mb-8">
                <p className="text-lg font-medium mb-2">Archives:</p>
                <div className="flex flex-wrap gap-2">
                    {archive.map(item => (
                        <button 
                            key={`${item.year}-${item.month}`} 
                            onClick={() => handleArchiveNavigation(item.year, item.month)}
                            className={`px-4 py-1 text-sm rounded-full transition duration-150 ${
                                currentYear === item.year && currentMonth === item.month
                                    ? 'bg-blue-600 text-white shadow' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {getMonthName(item.month)} {item.year}
                        </button>
                    ))}
                </div>
            </div>
            
            <hr className="my-6" />

            {report && (
                <div ref={printRef} className="bg-white p-6 rounded-lg shadow-md"> 
                    <div className="mb-6 pb-4 border-b border-gray-200 flex flex-col gap-3">
                        <h2 className="text-2xl font-bold text-gray-800 w-full text-center sm:text-left">
                            Monthly Summary {getMonthName(currentMonth)} {currentYear}: {report.name || 'N/A'} 
                            {report.department && ` (${report.department})`} 
                        </h2>
                        
                        <div className="export-button w-full">
                            <button 
                                onClick={exportPdf} 
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 flex items-center justify-center text-sm font-medium"
                            >
                                📥 Export Report as PDF
                            </button>
                        </div>
                    </div>
                    <AttendanceReportTable report={report} />

                </div>
            )}
        </div>
    );
};

export default EmployeeReportViewer;