import { useCallback, useEffect, useState, useRef } from "react";
import type { ArchiveItem, DailySummary, MonthlyReport } from "../../Types/type";
import { getAllEmployeesMonthlyReport, getAttendanceArchive } from "../../services/AttendanceService";
import { format } from "date-fns";
import jsPDF from 'jspdf';
import * as domToImage from 'dom-to-image-more'; 

const restructureReports = (reports: MonthlyReport[]): DailySummary => {
    const dailySummary: DailySummary = {};

    reports.forEach(report => {
        const employeeId = report.employeeId; 

        if (Array.isArray(report.dailyAttendance)) {
             report.dailyAttendance.forEach(dayRecord => {
                const date = dayRecord.date; 
                
                if (!dailySummary[date]) {
                    dailySummary[date] = {};
                }

                dailySummary[date][employeeId] = {
                    checkIn: dayRecord.checkIn || 'N/A', 
                    checkOut: dayRecord.checkOut || 'N/A',
                };
            });
        }
    });

    return dailySummary;
};

function Attendence() {
    const printRef = useRef<HTMLDivElement>(null); 
    
    const [archive, setArchive] = useState<ArchiveItem[]>([]);
    const [reports, setReports] = useState<MonthlyReport[]>([]);
    const [selectedDate, setSelectedDate] = useState<{ year: number, month: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getMonthName = (month: number) => {
        const date = new Date(2000, month - 1, 1);
        return format(date, 'MMMM');
    };

    const fetchReport = useCallback(async (year: number, month: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllEmployeesMonthlyReport(year, month);
            const receivedReports = res.data.reports.reports; 
            
            if (receivedReports && Array.isArray(receivedReports) && receivedReports.length > 0) {
                 setReports(receivedReports); 
                 console.log("🎉 SUCCESS: State updated to length:", receivedReports.length);
            } else {
                 setReports([]); 
                 console.log("⚠️ WARNING: Received reports were empty or not an array.");
            }
        } catch (err: any) {
            setError(`Failed to fetch report for month ${month}/${year}: ` + (err.response?.data?.message || err.message));
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, []); 

    const handleMonthSelect = useCallback(async (year: number, month: number) => {
        setSelectedDate({ year, month });
        await fetchReport(year, month);
    }, [fetchReport, setSelectedDate]);

    useEffect(() => {
        const fetchArchive = async () => {
            setLoading(true); 
            try {
                const resArchive = await getAttendanceArchive('admin'); 
                setArchive(resArchive.data.archive);
                
                if (resArchive.data.archive.length > 0) {
                    const latest = resArchive.data.archive[0];
                    await handleMonthSelect(latest.year, latest.month);
                } else {
                    setLoading(false);
                }
            } catch (err: any) {
                setError("Failed to fetch archive: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };
        fetchArchive(); 
    }, [handleMonthSelect]); 
    
  const exportPdf = async () => {
      const targetElement = printRef.current;
      if (!targetElement || !selectedDate) return;

      const tableContainer = targetElement.querySelector('.overflow-x-auto') as HTMLDivElement;
      if (!tableContainer) {
          setError("Table container not found for PDF export.");
          return; 
      }

      const originalOverflowX = tableContainer.style.overflowX;
      const originalOverflowY = tableContainer.style.overflowY; 
      const originalWidth = tableContainer.style.width;
      const originalHeight = tableContainer.style.height;
      const originalPaddingBottom = tableContainer.style.paddingBottom; 

      try {
          tableContainer.style.overflowX = 'visible';
          tableContainer.style.overflowY = 'visible';
          tableContainer.style.width = `${tableContainer.scrollWidth}px`;
          tableContainer.style.paddingBottom = '50px'; 
          
          await new Promise(resolve => setTimeout(resolve, 50));

          const actualWidth = tableContainer.scrollWidth;
          const actualHeight = tableContainer.scrollHeight; 

          const dataUrl = await domToImage.toJpeg(tableContainer, { 
              quality: 0.95, 
              width: actualWidth, 
              height: actualHeight,
          });

          tableContainer.style.overflowX = originalOverflowX;
          tableContainer.style.overflowY = originalOverflowY; 
          tableContainer.style.width = originalWidth;
          tableContainer.style.height = originalHeight;
          tableContainer.style.paddingBottom = originalPaddingBottom; 

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

          const filename = `Attendance_Report_${getMonthName(selectedDate!.month)}_${selectedDate!.year}.pdf`;
          pdf.save(filename);
          
      } catch (error) {
          console.error("PDF export failed:", error);

          if (tableContainer) {
              tableContainer.style.overflowX = originalOverflowX;
              tableContainer.style.overflowY = originalOverflowY; 
              tableContainer.style.width = originalWidth;
              tableContainer.style.height = originalHeight;
              tableContainer.style.paddingBottom = originalPaddingBottom;
          }
          setError("Failed to create PDF file. Ensure all styles are loaded correctly.");
      }
  };
    
    const employees = reports.map(r => ({
        id: r.employeeId,
        name: r.name.trim().split(' ')[0] || `Employee ${r.employeeID_Number}`,
        employeeID_Number: r.employeeID_Number
    }));

    const dailyRecords = restructureReports(reports);
    const sortedDates = Object.keys(dailyRecords).sort(); 


    return (
        <div className="p-6 text-left"> 
            <h2 className="text-3xl font-bold mb-6 text-teal-600">Attendance and Departure Reports (Manager)</h2>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Select Month:</h3>
                <div className="flex flex-wrap gap-2">
                    {archive.map(item => (
                        <button 
                            key={`${item.year}-${item.month}`} 
                            onClick={() => handleMonthSelect(item.year, item.month)}
                            className={`px-4 py-2 rounded-md transition duration-150 ${
                                selectedDate?.year === item.year && selectedDate?.month === item.month
                                    ? 'bg-teal-600 text-white shadow-lg' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {getMonthName(item.month)} {item.year}
                        </button>
                    ))}
                </div>
            </div>
            
            <hr className="my-6" />

            {selectedDate && (
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold mb-4">
                        Attendance and Departure Sheet for {getMonthName(selectedDate.month)} {selectedDate.year}
                    </h3>

                    {loading && <p className="text-center text-teal-600">Loading report...</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {!loading && !error && reports.length > 0 && (
                        <div className="flex justify-start mb-4">
                            <button 
                                onClick={exportPdf} 
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-150 flex items-center"
                            >
                                📥 Export Table as PDF
                            </button>
                        </div>
                    )}

                    {!loading && !error && reports.length > 0 && (
                        <div ref={printRef}>
                            <div className="overflow-x-auto bg-white shadow-lg rounded-md border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200 text-left"> 
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th colSpan={1 + employees.length * 2} className="px-3 py-2 text-center text-lg font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300">
                                                Attendance and Departure Sheet for {getMonthName(selectedDate.month)} {selectedDate.year}
                                            </th>
                                        </tr>
                                        <tr className="text-center">
                                            <th rowSpan={2} className="px-3 py-2 border-r border-gray-300">Date</th>
                                            {employees.map(emp => (
                                                <th key={emp.id} colSpan={2} className="px-3 py-2 border-r border-gray-300">
                                                    {emp.name} ({emp.employeeID_Number})
                                                </th>
                                            ))}
                                        </tr>
                                        <tr className="text-center">
                                            {employees.map(emp => (
                                                <>
                                                    <th key={`${emp.id}-in`} className="px-3 py-2 text-xs font-medium text-gray-500 border-r border-gray-300">Check In</th>
                                                    <th key={`${emp.id}-out`} className="px-3 py-2 text-xs font-medium text-gray-500">Check Out</th>
                                                </>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedDates.map(date => (
                                            <tr key={date} className="hover:bg-gray-50 text-center">
                                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">{date}</td>
                                                {employees.map(emp => {
                                                    const record = dailyRecords[date]?.[emp.id];
                                                    return (
                                                        <>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-center border-r border-gray-200">
                                                                {record?.checkIn || 'N/A'}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                                                                {record?.checkOut || 'N/A'}
                                                            </td>
                                                        </>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-100 font-bold border-t border-gray-300">
                                            <td className="px-3 py-2 text-center font-bold border-r border-gray-300">Absence:</td>
                                            {reports.map(report => (
                                                <td key={report.employeeId + 'abs'} colSpan={2} className="px-3 py-2 text-center text-red-600 font-bold border-r border-gray-300">
                                                    {report.absenceDays}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="bg-gray-100 font-bold">
                                            <td className="px-3 py-2 text-center font-bold border-r border-gray-300">Leave:</td>
                                            {reports.map(report => (
                                                <td key={report.employeeId + 'leave'} colSpan={2} className="px-3 py-2 text-center text-blue-600 font-bold border-r border-gray-300">
                                                    {report.totalLeaveDays}
                                                </td>
                                            ))}
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                    {!loading && !error && reports.length === 0 && <p className="text-gray-500 text-center">No reports available for this month.</p>}
                </div>
            )}
        </div>
    );
}

export default Attendence;