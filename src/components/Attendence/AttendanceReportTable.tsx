import type { ReportProps } from '../Types/type';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const AttendanceReportTable: React.FC<ReportProps> = ({ report }) => {
    const { year, month } = useParams<{ year: string, month: string }>();
    const reportYear = parseInt(year || '0', 10);
    const reportMonth = parseInt(month || '0', 10);

    const departmentName = typeof report.department === 'string' 
                            ? report.department 
                            : report.department?.dep_name || 'N/A';

    const formatTotalHours = (value: any) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) return '0.00';
        return numberValue.toFixed(2);
    };

    const formatMinutesToHours = (value: any) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) return '0.00';
        return (numberValue / 60).toFixed(2);
    };
    const getMonthName = (m: number) => {
        const date = new Date(2000, m - 1, 1);
        return format(date, 'MMMM');
    };

    return (
        <div id="print-content" className="bg-white shadow-2xl rounded-lg p-10 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Monthly Summary {getMonthName(reportMonth)} {reportYear}: {report.name} ({departmentName})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{report.presentDays}</p>
                    <p className="text-sm text-gray-500">Attendance Days</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-600">{report.totalLeaveDays}</p>
                    <p className="text-sm text-gray-500">Approved Leaves</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-red-600">{report.absenceDays}</p>
                    <p className="text-sm text-gray-500">Actual Absence</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-purple-600">{formatTotalHours(report.totalWorkDurationHours)}</p>
                    <p className="text-sm text-gray-500">Total Hours</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-gray-800">{formatTotalHours(report.requiredHours)}</p>
                    <p className="text-sm text-gray-500">Required Hours</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-indigo-600">{formatTotalHours(report.overtimeHours)}</p>
                    <p className="text-sm text-gray-500">Overtime Hours</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-pink-600">{formatTotalHours(report.shortfallHours)}</p>
                    <p className="text-sm text-gray-500">Shortfall Hours</p>
                </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 border-t pt-4">Daily attendance log</h3>
            {report?.dailyAttendance && report.dailyAttendance.length > 0 ? (
                <div className="daily-attendance-container overflow-x-auto bg-white rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Check In</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Check Out</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Working Time (Hours)</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {report.dailyAttendance.map((day, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{day.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{day.checkIn}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{day.checkOut}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                        {formatMinutesToHours(day.workDuration)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${day.status === 'Full Day' ? 'bg-green-100 text-green-800' :
                                              day.status === 'Early Out' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-gray-100 text-gray-800'}`}
                                        >
                                            {day.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-4">There are no attendance records for this month.</p>
            )}
        </div>
    );
};
export default AttendanceReportTable;